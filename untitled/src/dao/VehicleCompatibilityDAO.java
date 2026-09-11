package dao;

import model.VehicleCompatibility;
import java.util.ArrayList;
import java.util.List;

public class VehicleCompatibilityDAO {
    private List<VehicleCompatibility> compatibilityList = new ArrayList<>();

    public VehicleCompatibilityDAO() {
        // Now you can map a vehicle to all its parts in just one line!
        
        // Vehicle 1 (Apex Sedan): V6, Spoiler, Matte Paint, Leather, Bose, 18-inch
        mapPartsToVehicle(1, 1, 4, 5, 6, 7, 8);
        
        // Vehicle 2 (Titan SUV): V6, Matte Paint, Leather, Bose, 18-inch
        mapPartsToVehicle(2, 1, 5, 6, 7, 8);
        
        // Vehicle 3 (Veloce Sport): V8, Spoiler, Matte Paint, Leather, Bose, 20-inch
        mapPartsToVehicle(3, 2, 4, 5, 6, 7, 9);
        
        // Example for a new car: 
        // mapPartsToVehicle(4, 2, 6, 9); 
    }

    // Helper method to make adding cars much faster
    private void mapPartsToVehicle(int vehicleId, int... partIds) {
        for (int partId : partIds) {
            compatibilityList.add(new VehicleCompatibility(vehicleId, partId));
        }
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

// updated to make it easier to add new cars later, made the helper method that accepst a vechile ID and
// a list of part IDs all at once
