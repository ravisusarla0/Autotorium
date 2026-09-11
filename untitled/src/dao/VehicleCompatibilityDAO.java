package dao;

import model.VehicleCompatibility;
import java.util.ArrayList;
import java.util.List;

public class VehicleCompatibilityDAO {
    // 1. Universal parts fit every car (ID 1 through 9)
    // 5 = Tomei Exhaust, 19 = Carbon Hood, 21 = Defi Gauges, 22 = Roll Cage, 23 = Recaro Seats
    int[] universalParts = {5, 19, 21, 22, 23};
    for (int vehicleId = 1; vehicleId <= 9; vehicleId++) {
        for (int partId : universalParts) {
            compatibilityList.add(new VehicleCompatibility(vehicleId, partId));
        }
    }

        // Now you can map a vehicle to all its parts in just one line!
        
        public VehicleCompatibilityDAO() {
        // Vehicle 1 (Skyline R34): Gets the RB26 (Part 1), GT Wing, Midnight Purple, TE37s
        mapPartsToVehicle(1, 1, 5, 6, 7, 8, 9, 11);
        
        // Vehicle 2 (Supra MK4): Gets the 2JZ (Part 2), GT Wing, big 19" Work Meisters
        mapPartsToVehicle(2, 2, 5, 6, 8, 9, 11, 12);
        
        // Vehicle 3 (Civic EK9): Gets the K20A (Part 3), no GT wing (hatchback!), 17" Enkeis
        mapPartsToVehicle(3, 3, 5, 7, 8, 9, 10);
        
        // Vehicle 4 (WRX STI): Gets the EJ20 (Part 4), GT Wing, 18" TE37s
        mapPartsToVehicle(4, 4, 5, 6, 8, 9, 11);
        // Example for a new car: 
        // mapPartsToVehicle(4, 2, 6, 9); 

        // 5. Mazda RX-7: 13B (13), Exhaust (5), Wing (6), Paint (7), Interior (8,9), 18" TE37 (11)
        mapPartsToVehicle(5, 13, 5, 6, 7, 8, 9, 11);
        
        // 6. Lancer Evo IX: 4G63 (14), Exhaust (5), Wing (6), Paint (7), Interior (8,9), 18" TE37 (11)
        mapPartsToVehicle(6, 14, 5, 6, 7, 8, 9, 11);
        
        // 7. Silvia S15: SR20 (15), Exhaust (5), Wing (6), Paint (7), Interior (8,9), 18" TE37 (11), 19" Meisters (12)
        mapPartsToVehicle(7, 15, 5, 6, 7, 8, 9, 11, 12);
        
        // 8. Honda NSX: C30A (16), Exhaust (5), Wing (6), Paint (7), Interior (8,9), 18" TE37 (11), 19" Meisters (12)
        mapPartsToVehicle(8, 16, 5, 6, 7, 8, 9, 11, 12);
        
        // 9. Toyota AE86: 4A-GE (17), Exhaust (5), Paint (7), Interior (8,9), 17" RPF1 (10) -- keep wheels small!
        mapPartsToVehicle(9, 17, 5, 7, 8, 9, 10);
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
