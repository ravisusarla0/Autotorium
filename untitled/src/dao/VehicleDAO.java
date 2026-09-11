package dao;

import model.Vehicle;
import java.util.ArrayList;
import java.util.List;

public class VehicleDAO {
    private List<Vehicle> vehicles = new ArrayList<>();

    public VehicleDAO() {
        // Load initial mock vehicles (id, name, type, basePrice, imageUrl)
       vehicles.add(new Vehicle(1, "Nissan Skyline GT-R R34", "Coupe", 85000.00, "r34.png"));
        vehicles.add(new Vehicle(2, "Toyota Supra MK4", "Coupe", 75000.00, "supra.png"));
        vehicles.add(new Vehicle(3, "Honda Civic Type R EK9", "Hatchback", 25000.00, "ek9.png"));
        vehicles.add(new Vehicle(4, "Subaru Impreza WRX STI", "Sedan", 35000.00, "sti.png"));
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
