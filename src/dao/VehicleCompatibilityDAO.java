package dao;

import model.VehicleCompatibility;
import java.util.ArrayList;
import java.util.List;

public class VehicleCompatibilityDAO {
    private List<VehicleCompatibility> compatibilityList = new ArrayList<>();

    public VehicleCompatibilityDAO() {
        // 1. Universal options for all 9 cars:
        // Performance: 5 (Tomei Exhaust)
        // Exterior Paints: 6, 7, 18, 19, 20
        // Interior Trims: 8, 9, 21, 22
        int[] universalParts = {5, 6, 7, 18, 19, 20, 8, 9, 21, 22};
        for (int vehicleId = 1; vehicleId <= 9; vehicleId++) {
            for (int partId : universalParts) {
                compatibilityList.add(new VehicleCompatibility(vehicleId, partId));
            }
        }

        // 2. Specific Engine Packages & Wheel Sizes per Car:
        // Skyline R34: RB26 (1), 18" TE37 (11), 18" BBS LM (25)
        mapPartsToVehicle(1, 1, 11, 25);

        // Supra MK4: 2JZ (2), 18" TE37 (11), 19" Meister (12), 19" Advan (26)
        mapPartsToVehicle(2, 2, 11, 12, 26);

        // Civic EK9: K20A (3), 17" Enkei (10), 15" Watanabe (24)
        mapPartsToVehicle(3, 3, 10, 24);

        // WRX STI: EJ20 (4), 18" TE37 (11), 18" BBS LM (25)
        mapPartsToVehicle(4, 4, 11, 25);

        // RX-7 FD3S: 13B (13), 18" TE37 (11), 18" BBS LM (25)
        mapPartsToVehicle(5, 13, 11, 25);

        // Evo IX: 4G63 (14), 18" TE37 (11), 18" BBS LM (25)
        mapPartsToVehicle(6, 14, 11, 25);

        // Silvia S15: SR20 (15), 18" TE37 (11), 19" Meister (12)
        mapPartsToVehicle(7, 15, 11, 12);

        // NSX NA1: C30A (16), 18" TE37 (11), 19" Advan (26)
        mapPartsToVehicle(8, 16, 11, 26);

        // AE86: 4A-GE (17), 17" Enkei (10), 15" Watanabe (24)
        mapPartsToVehicle(9, 17, 10, 24);
    }

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
