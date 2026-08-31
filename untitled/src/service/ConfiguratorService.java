package service;

import dao.PartCategoryDAO;
import dao.PartDAO;
import dao.VehicleCompatibilityDAO;
import dao.VehicleDAO;
import model.Part;
import model.PartCategory;
import model.Vehicle;

import java.util.ArrayList;
import java.util.List;

public class ConfiguratorService {
    private VehicleDAO vehicleDAO;
    private PartCategoryDAO partCategoryDAO;
    private PartDAO partDAO;
    private VehicleCompatibilityDAO compatibilityDAO;

    public ConfiguratorService() {
        this.vehicleDAO = new VehicleDAO();
        this.partCategoryDAO = new PartCategoryDAO();
        this.partDAO = new PartDAO();
        this.compatibilityDAO = new VehicleCompatibilityDAO();
    }

    // 1. Fetch all available vehicles for user selection
    public List<Vehicle> getAllVehicles() {
        return vehicleDAO.getAllVehicles();
    }

    // 2. Fetch all categories for organizing tabs/menus
    public List<PartCategory> getAllCategories() {
        return partCategoryDAO.getAllCategories();
    }

    // 3. Filter parts: Returns ONLY parts compatible with the selected vehicle
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

    // 4. Calculate total price dynamically
    public double calculateTotalPrice(Vehicle selectedVehicle, List<Part> selectedParts) {
        if (selectedVehicle == null) {
            return 0.0;
        }

        double total = selectedVehicle.getBasePrice();

        if (selectedParts != null) {
            for (Part part : selectedParts) {
                total += part.getPriceModifier();
            }
        }

        return total;
    }
}