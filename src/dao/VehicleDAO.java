package dao;

import model.Vehicle;
import java.util.ArrayList;
import java.util.List;

public class VehicleDAO {
    private List<Vehicle> vehicles = new ArrayList<>();

    public VehicleDAO() {
        // Load all 12 JDM vehicles: (vehicleId, name, type, basePrice, imageUrl)
        vehicles.add(new Vehicle(1, "Nissan Skyline GT-R R34", "Coupe", 85000.00, "r34.jpg"));
        vehicles.add(new Vehicle(2, "Toyota Supra MK4", "Coupe", 78000.00, "supra.jpg"));
        vehicles.add(new Vehicle(3, "Honda Civic Type R EK9", "Hatchback", 38000.00, "ek9.jpg"));
        vehicles.add(new Vehicle(4, "Subaru WRX STI", "Sedan", 42000.00, "gc8.jpg"));
        vehicles.add(new Vehicle(5, "Mazda RX-7 FD3S", "Coupe", 55000.00, "rx7.jpg"));
        vehicles.add(new Vehicle(6, "Mitsubishi Lancer Evo IX", "Sedan", 48500.00, "evo9.jpg"));
        vehicles.add(new Vehicle(7, "Nissan Silvia S15 Spec-R", "Coupe", 42000.00, "s15.jpg"));
        vehicles.add(new Vehicle(8, "Honda NSX NA1", "Coupe", 95000.00, "nsx.jpg"));
        vehicles.add(new Vehicle(9, "Toyota AE86 Sprinter Trueno", "Coupe", 32000.00, "ae86.jpg"));
        vehicles.add(new Vehicle(10, "Honda S2000 (AP2)", "Roadster", 46000.00, "s2000.jpg"));
        vehicles.add(new Vehicle(11, "Nissan 350Z (Z33)", "Coupe", 34000.00, "350z.jpg"));
        vehicles.add(new Vehicle(12, "Lexus LFA", "Supercar", 850000.00, "lfa.jpg"));
    }

    public List<Vehicle> getAllVehicles() {
        return vehicles;
    }

    public Vehicle getVehicleById(int vehicleId) {
        for (Vehicle v : vehicles) {
            if (v.getVehicleId() == vehicleId) {
                return v;
            }
        }
        return null;
    }
}
// what it does: Stores all base vehicle models available in your application.
// uses an array list to store vehicle objects in memory
//  getALLVehicles: Returns the full list of vehicles so your front end dropdown or menu can display them to the user.
// getVehicleById: Searches through the list and returns the exact car matching a specific ID.
