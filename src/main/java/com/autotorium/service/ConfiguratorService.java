package com.autotorium.service;

import com.autotorium.dao.GarageDAO;
import com.autotorium.dao.PartCategoryDAO;
import com.autotorium.dao.PartDAO;
import com.autotorium.dao.TicketDAO;
import com.autotorium.dao.VehicleCompatibilityDAO;
import com.autotorium.dao.VehicleDAO;
import com.autotorium.model.BuildTicket;
import com.autotorium.model.GarageBuild;
import com.autotorium.model.Part;
import com.autotorium.model.PartCategory;
import com.autotorium.model.Vehicle;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

@Service
public class ConfiguratorService {

    private static final Map<String, String> NEXT_TICKET_STATUS = Map.of(
            TicketDAO.PENDING, TicketDAO.IN_PROGRESS,
            TicketDAO.IN_PROGRESS, TicketDAO.COMPLETED);

    private final VehicleDAO vehicleDAO;
    private final PartCategoryDAO partCategoryDAO;
    private final PartDAO partDAO;
    private final VehicleCompatibilityDAO compatibilityDAO;
    private final GarageDAO garageDAO;
    private final TicketDAO ticketDAO;

    public ConfiguratorService(VehicleDAO vehicleDAO,
                               PartCategoryDAO partCategoryDAO,
                               PartDAO partDAO,
                               VehicleCompatibilityDAO compatibilityDAO,
                               GarageDAO garageDAO,
                               TicketDAO ticketDAO) {
        this.vehicleDAO = vehicleDAO;
        this.partCategoryDAO = partCategoryDAO;
        this.partDAO = partDAO;
        this.compatibilityDAO = compatibilityDAO;
        this.garageDAO = garageDAO;
        this.ticketDAO = ticketDAO;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleDAO.findAll();
    }

    public List<PartCategory> getAllCategories() {
        return partCategoryDAO.findAll();
    }

    public List<Part> getCompatibleParts(long vehicleId) {
        requireVehicle(vehicleId);
        return partDAO.findCompatibleForVehicle(vehicleId);
    }

    public GarageBuild saveToGarage(String buildName, long vehicleId, List<Long> partIds) {
        Vehicle vehicle = requireVehicle(vehicleId);
        List<Long> requested = partIds == null ? List.of() : new ArrayList<>(new LinkedHashSet<>(partIds));

        List<Part> parts = new ArrayList<>();
        long wheelCount = 0;
        long wheelsCategoryId = wheelsCategoryId();
        boolean singleSelectWheels = wheelsCategoryId > 0;

        for (long partId : requested) {
            if (!compatibilityDAO.exists(vehicleId, partId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Part " + partId + " does not fit the " + vehicle.name());
            }
            Part part = partDAO.findById(partId).orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Unknown part " + partId));
            if (singleSelectWheels && part.categoryId() == wheelsCategoryId) {
                wheelCount++;
            }
            parts.add(part);
        }

        if (wheelCount > 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only one wheel set can be fitted to a build");
        }

        double total = parts.stream().mapToDouble(Part::priceModifier).sum() + vehicle.basePrice();
        String name = (buildName == null || buildName.isBlank())
                ? vehicle.name() + " Custom"
                : buildName.trim();

        long buildId = garageDAO.insert(name, vehicleId, round(total));
        garageDAO.addParts(buildId, parts.stream().map(Part::partId).toList());
        return garageDAO.findById(buildId).orElseThrow();
    }

    public List<GarageBuild> getGarageBuilds() {
        return garageDAO.findActive();
    }

    public void removeFromGarage(long buildId) {
        GarageBuild build = garageDAO.findById(buildId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown garage build " + buildId));
        if (!GarageDAO.IN_GARAGE.equals(build.status())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Build " + buildId + " has already been checked out");
        }
        garageDAO.delete(buildId);
    }

    public BuildTicket checkout(long buildId, String customerName) {
        GarageBuild build = garageDAO.findById(buildId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown garage build " + buildId));
        if (!GarageDAO.IN_GARAGE.equals(build.status())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Build " + buildId + " has already been checked out");
        }
        garageDAO.updateStatus(buildId, GarageDAO.CHECKED_OUT);
        String customer = (customerName == null || customerName.isBlank())
                ? "Walk-In Customer"
                : customerName.trim();
        long ticketId = ticketDAO.insert(buildId, customer);
        return ticketDAO.findById(ticketId).orElseThrow();
    }

    public List<BuildTicket> getAllTickets() {
        return ticketDAO.findAll();
    }

    public BuildTicket advanceTicket(long ticketId, String status) {
        BuildTicket ticket = ticketDAO.findById(ticketId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown ticket " + ticketId));
        String expected = NEXT_TICKET_STATUS.get(ticket.status());
        if (expected == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Ticket " + ticketId + " is already complete");
        }
        if (!expected.equals(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Ticket " + ticketId + " must move to " + expected);
        }
        ticketDAO.updateStatus(ticketId, expected);
        return ticketDAO.findById(ticketId).orElseThrow();
    }

    private Vehicle requireVehicle(long vehicleId) {
        return vehicleDAO.findById(vehicleId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown vehicle " + vehicleId));
    }

    private long wheelsCategoryId() {
        return partCategoryDAO.findByName("Wheels")
                .map(PartCategory::categoryId)
                .orElse(0L);
    }

    private static double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
