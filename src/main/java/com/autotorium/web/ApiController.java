package com.autotorium.web;

import com.autotorium.model.BuildTicket;
import com.autotorium.model.GarageBuild;
import com.autotorium.model.Part;
import com.autotorium.model.PartCategory;
import com.autotorium.model.Vehicle;
import com.autotorium.service.ConfiguratorService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final ConfiguratorService service;

    public ApiController(ConfiguratorService service) {
        this.service = service;
    }

    @GetMapping("/vehicles")
    public List<Vehicle> vehicles() {
        return service.getAllVehicles();
    }

    @GetMapping("/categories")
    public List<PartCategory> categories() {
        return service.getAllCategories();
    }

    @GetMapping("/vehicles/{vehicleId}/parts")
    public List<Part> compatibleParts(@PathVariable long vehicleId) {
        return service.getCompatibleParts(vehicleId);
    }

    @GetMapping("/garage")
    public List<GarageBuild> garage() {
        return service.getGarageBuilds();
    }

    @PostMapping("/garage")
    @ResponseStatus(HttpStatus.CREATED)
    public GarageBuild saveBuild(@RequestBody CreateBuildRequest request) {
        if (request.vehicleId() == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "vehicleId is required");
        }
        return service.saveToGarage(request.buildName(), request.vehicleId(), request.partIds());
    }

    @DeleteMapping("/garage/{buildId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeBuild(@PathVariable long buildId) {
        service.removeFromGarage(buildId);
    }

    @PostMapping("/garage/{buildId}/checkout")
    public BuildTicket checkout(@PathVariable long buildId, @RequestBody(required = false) CheckoutRequest request) {
        return service.checkout(buildId, request == null ? null : request.customerName());
    }

    @GetMapping("/tickets")
    public List<BuildTicket> tickets() {
        return service.getAllTickets();
    }

    @PatchMapping("/tickets/{ticketId}")
    public BuildTicket advanceTicket(@PathVariable long ticketId, @RequestBody AdvanceTicketRequest request) {
        if (request.status() == null || request.status().isBlank()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "status is required");
        }
        return service.advanceTicket(ticketId, request.status());
    }

    public record CreateBuildRequest(String buildName, Long vehicleId, List<Long> partIds) {
    }

    public record CheckoutRequest(String customerName) {
    }

    public record AdvanceTicketRequest(String status) {
    }
}
