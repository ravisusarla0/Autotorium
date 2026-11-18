package com.autotorium.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AutotoriumApiTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper json;

    @Test
    void exposesTheTwelveJdmChassis() throws Exception {
        mvc.perform(get("/api/vehicles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(12))
                .andExpect(jsonPath("$[0].name").value("Nissan Skyline GT-R R34"))
                .andExpect(jsonPath("$[11].basePrice").value(850000.0));
    }

    @Test
    void onlyOffersPartsThatFitTheChassis() throws Exception {
        mvc.perform(get("/api/vehicles/1/parts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.partId == 1)]").isNotEmpty())   // RB26 fits the R34
                .andExpect(jsonPath("$[?(@.partId == 2)]").isEmpty())      // 2JZ does not
                .andExpect(jsonPath("$[?(@.partId == 100)]").isNotEmpty()); // OEM wheels are universal
    }

    @Test
    void savesChecksOutAndAdvancesATicket() throws Exception {
        String createBody = """
                {"buildName":"Test R34","vehicleId":1,"partIds":[1,11]}
                """;

        String created = mvc.perform(post("/api/garage")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("IN_GARAGE"))
                .andExpect(jsonPath("$.totalPrice").value(100200.0))
                .andReturn().getResponse().getContentAsString();

        long buildId = json.readTree(created).get("buildId").asLong();

        mvc.perform(get("/api/garage"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.buildId == " + buildId + ")]").isNotEmpty());

        String ticketBody = mvc.perform(post("/api/garage/" + buildId + "/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"customerName\":\"Marcus Lee\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.customerName").value("Marcus Lee"))
                .andReturn().getResponse().getContentAsString();

        long ticketId = json.readTree(ticketBody).get("ticketId").asLong();
        assertThat(ticketId).isPositive();

        mvc.perform(get("/api/garage"))
                .andExpect(jsonPath("$[?(@.buildId == " + buildId + ")]").isEmpty());

        mvc.perform(patch("/api/tickets/" + ticketId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"IN_PROGRESS\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));

        mvc.perform(patch("/api/tickets/" + ticketId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"COMPLETED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));

        mvc.perform(patch("/api/tickets/" + ticketId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"COMPLETED\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsPartsThatDoNotFitAndSecondWheelSets() throws Exception {
        mvc.perform(post("/api/garage")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"vehicleId\":1,\"partIds\":[2]}"))
                .andExpect(status().isBadRequest());

        mvc.perform(post("/api/garage")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"vehicleId\":1,\"partIds\":[11,25]}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void removesABuildFromTheGarage() throws Exception {
        String created = mvc.perform(post("/api/garage")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"buildName\":\"Removable\",\"vehicleId\":3,\"partIds\":[3]}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        long buildId = json.readTree(created).get("buildId").asLong();

        mvc.perform(delete("/api/garage/" + buildId))
                .andExpect(status().isNoContent());

        mvc.perform(get("/api/garage"))
                .andExpect(jsonPath("$[?(@.buildId == " + buildId + ")]").isEmpty());
    }
}
