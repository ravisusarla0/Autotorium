import model.Part;
import model.Vehicle;
import service.ConfiguratorService;

import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        ConfiguratorService service = new ConfiguratorService();

        // 1. Fetch and print all vehicles
        System.out.println("=== AVAILABLE VEHICLES ===");
        List<Vehicle> vehicles = service.getAllVehicles();
        for (Vehicle v : vehicles) {
            System.out.println("ID: " + v.getVehicleId() + " | " + v.getName() + " - $" + v.getBasePrice());
        }

        // 2. Test selecting Vehicle #1 (Apex Sedan)
        Vehicle selectedVehicle = vehicles.get(0); // Apex Sedan ($25,000)
        System.out.println("\n=== SELECTED VEHICLE: " + selectedVehicle.getName() + " ===");

        // 3. Fetch compatible parts for Vehicle #1
        System.out.println("\n=== COMPATIBLE PARTS FOR " + selectedVehicle.getName() + " ===");
        List<Part> compatibleParts = service.getCompatiblePartsForVehicle(selectedVehicle.getVehicleId());
        for (Part p : compatibleParts) {
            System.out.println("Part ID: " + p.getPartId() + " | " + p.getName() + " - $" + p.getPriceModifier());
        }

        // 4. Simulate user selecting parts (e.g., selecting the first 2 compatible parts)
        List<Part> chosenParts = new ArrayList<>();
        if (!compatibleParts.isEmpty()) {
            chosenParts.add(compatibleParts.get(0)); // V6 Turbo Engine ($3,500)
            chosenParts.add(compatibleParts.get(1)); // Carbon Fiber Spoiler ($800)
        }

        // 5. Calculate and print total price
        double totalPrice = service.calculateTotalPrice(selectedVehicle, chosenParts);
        System.out.println("\n=== FINAL BUILD SUMMARY ===");
        System.out.println("Base Vehicle Cost: $" + selectedVehicle.getBasePrice());
        System.out.println("Selected Upgrades Cost: $" + (totalPrice - selectedVehicle.getBasePrice()));
        System.out.println("TOTAL PRICE: $" + totalPrice);
    }
}