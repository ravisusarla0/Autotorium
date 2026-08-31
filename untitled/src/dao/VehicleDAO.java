package dao;

import model.Vehicle;
import java.util.ArrayList;
import java.util.List;

public class VehicleDAO {
    private List<Vehicle> vehicles = new ArrayList<>();

    public VehicleDAO() {
        // Load initial mock vehicles (id, name, type, basePrice, imageUrl)
        vehicles.add(new Vehicle(1, "Apex Sedan", "Sedan", 25000.00, "sedan.png"));
        vehicles.add(new Vehicle(2, "Titan SUV", "SUV", 35000.00, "suv.png"));
        vehicles.add(new Vehicle(3, "Veloce Sport", "Coupe", 42000.00, "sport.png"));
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
