package service;

import dao.*;
import model.*;

import java.util.ArrayList;
import java.util.List;

public class ConfiguratorService {
    private final VehicleDAO vehicleDAO;
    private final PartCategoryDAO partCategoryDAO;
    private final PartDAO partDAO;
    private final VehicleCompatibilityDAO compatibilityDAO;
    private final GarageDAO garageDAO;
    private final TicketDAO ticketDAO;

    public ConfiguratorService() {
        this.vehicleDAO = new VehicleDAO();
        this.partCategoryDAO = new PartCategoryDAO();
        this.partDAO = new PartDAO();
        this.compatibilityDAO = new VehicleCompatibilityDAO();
        this.garageDAO = new GarageDAO();
        this.ticketDAO = new TicketDAO();
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleDAO.getAllVehicles();
    }

    public List<PartCategory> getAllCategories() {
        return partCategoryDAO.getAllCategories();
    }

    public List<Part> getCompatiblePartsForVehicle(int vehicleId) {
        List<Integer> compatibleIds = compatibilityDAO.getCompatiblePartIdsForVehicle(vehicleId);
        List<Part> compatibleParts = new ArrayList<>();
        for (int partId : compatibleIds) {
            Part part = partDAO.getPartById(partId);
            if (part != null) {
                compatibleParts.add(part);
            }
        }
        return compatibleParts;
    }

    public double calculateTotalPrice(Vehicle selectedVehicle, List<Part> selectedParts) {
        if (selectedVehicle == null) return 0.0;
        double total = selectedVehicle.getBasePrice();
        if (selectedParts != null) {
            for (Part part : selectedParts) {
                total += part.getPriceModifier();
            }
        }
        return total;
    }

    // --- GARAGE METHODS ---
    public GarageBuild saveToGarage(String buildName, Vehicle vehicle, List<Part> selectedParts) {
        if (vehicle == null) return null;
        String finalName = (buildName == null || buildName.isBlank())
                ? vehicle.getName() + " Custom"
                : buildName.trim();
        double total = calculateTotalPrice(vehicle, selectedParts);
        GarageBuild build = new GarageBuild(garageDAO.getNextBuildId(), finalName, vehicle, selectedParts, total);
        garageDAO.addBuild(build);
        return build;
    }

    public List<GarageBuild> getGarageBuilds() {
        return garageDAO.getActiveGarageBuilds();
    }

    public void removeFromGarage(GarageBuild build) {
        garageDAO.removeBuild(build);
    }

    // --- TICKETING / CHECKOUT METHODS ---
    public BuildTicket checkoutBuild(GarageBuild build, String customerName) {
        if (build == null) return null;
        String customer = (customerName == null || customerName.isBlank()) ? "Walk-In Customer" : customerName.trim();
        build.setStatus("CHECKED_OUT");
        BuildTicket ticket = new BuildTicket(ticketDAO.getNextTicketId(), build, customer);
        ticketDAO.saveTicket(ticket);
        return ticket;
    }

    public List<BuildTicket> getAllTickets() {
        return ticketDAO.getAllTickets();
    }

    public void updateTicketStatus(BuildTicket ticket, String newStatus) {
        if (ticket != null) {
            ticket.setStatus(newStatus);
        }
    }
}
