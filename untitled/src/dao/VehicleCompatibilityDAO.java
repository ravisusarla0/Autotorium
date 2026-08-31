package dao;

import model.VehicleCompatibility;
import java.util.ArrayList;
import java.util.List;

public class VehicleCompatibilityDAO {
    private List<VehicleCompatibility> compatibilityList = new ArrayList<>();

    public VehicleCompatibilityDAO() {
        // Mapping Vehicle 1 (Apex Sedan) compatible part IDs
        compatibilityList.add(new VehicleCompatibility(1, 1)); // V6 Turbo Engine
        compatibilityList.add(new VehicleCompatibility(1, 4)); // Carbon Fiber Spoiler
        compatibilityList.add(new VehicleCompatibility(1, 5)); // Matte Black Paint
        compatibilityList.add(new VehicleCompatibility(1, 6)); // Leather Seats
        compatibilityList.add(new VehicleCompatibility(1, 7)); // Bose Sound System
        compatibilityList.add(new VehicleCompatibility(1, 8)); // 18-inch Alloy Wheels

        // Mapping Vehicle 2 (Titan SUV) compatible part IDs
        compatibilityList.add(new VehicleCompatibility(2, 1)); // V6 Turbo Engine
        compatibilityList.add(new VehicleCompatibility(2, 5)); // Matte Black Paint
        compatibilityList.add(new VehicleCompatibility(2, 6)); // Leather Seats
        compatibilityList.add(new VehicleCompatibility(2, 7)); // Bose Sound System
        compatibilityList.add(new VehicleCompatibility(2, 8)); // 18-inch Alloy Wheels

        // Mapping Vehicle 3 (Veloce Sport) compatible part IDs
        compatibilityList.add(new VehicleCompatibility(3, 2)); // V8 Dual-Turbo Engine
        compatibilityList.add(new VehicleCompatibility(3, 4)); // Carbon Fiber Spoiler
        compatibilityList.add(new VehicleCompatibility(3, 5)); // Matte Black Paint
        compatibilityList.add(new VehicleCompatibility(3, 6)); // Leather Seats
        compatibilityList.add(new VehicleCompatibility(3, 7)); // Bose Sound System
        compatibilityList.add(new VehicleCompatibility(3, 9)); // 20-inch Forged Rim
    }

    public List<Integer> getCompatiblePartIdsForVehicle(int vehicleId) {
        List<Integer> compatiblePartIds = new ArrayList<>();
        for (VehicleCompatibility vc : compatibilityList) {
            if (vc.getVehicleId() == vehicleId) {
                compatiblePartIds.add(vc.getPartId());
            }
        }
        return compatiblePartIds;
    }
}
/*
 Stores the rules that determine which parts fit which vehicles, enforcing your business logic.
 Pairs a vehicleId directly with a partId (e.g., Vehicle 3 [Veloce Sport] is mapped to Part 2 [V8 Engine]).
 getCompatiblePartIdsForVehicle(int vehicleId):
Filters through the mappings and returns a list containing only the part IDs allowed for that specific car.
 If a user selects the Sedan, it ensures the V8 engine option isn't shown on screen.
*/
