package dao;

import model.Part;
import java.util.ArrayList;
import java.util.List;

public class PartDAO {
    private List<Part> parts = new ArrayList<>();

    public PartDAO() {
        // Performance (Category 101)- engine 
        parts.add(new Part(1, 101, "RB26 N1 Twin Turbo Upgrade", 12000.00, "rb26_turbo.png"));
        parts.add(new Part(2, 101, "2JZ Big Single Turbo Kit", 8500.00, "2jz_turbo.png"));
        parts.add(new Part(3, 101, "K20A Engine Swap Kit", 6500.00, "k20a_swap.png"));
        parts.add(new Part(4, 101, "EJ20 Forged Internals Kit", 5500.00, "ej20_forged.png"));
        parts.add(new Part(5, 101, "Tomei Titanium Exhaust", 1200.00, "tomei_exhaust.png")); // Universal
        parts.add(new Part(13, 101, "13B-REW Rotary Big Turbo", 7000.00, "13b_turbo.png")); // RX-7
        parts.add(new Part(14, 101, "4G63T Stroker Kit", 6000.00, "4g63_stroker.png")); // Evo
        parts.add(new Part(15, 101, "SR20DET Forged Internals", 4500.00, "sr20_forged.png")); // Silvia
        parts.add(new Part(16, 101, "C30A Twin Supercharger Kit", 14000.00, "c30a_super.png")); // NSX
        parts.add(new Part(17, 101, "4A-GE 20V ITB Setup", 3500.00, "4age_itb.png")); // AE86

        // Exterior (Category 102)
        parts.add(new Part(6, 102, "Bayside Blue Paint", 2500.00, "paint_bayside_blue.png"));
        parts.add(new Part(7, 102, "Midnight Purple III Paint", 4500.00, "paint_midnight_purple.png"));
        parts.add(new Part(18, 102, "Championship White Paint", 2000.00, "paint_championship_white.png"));
        parts.add(new Part(19, 102, "Sonic Silver Metallic Paint", 1800.00, "paint_sonic_silver.png"));
        parts.add(new Part(20, 102, "World Rally Blue Paint", 2200.00, "paint_wrc_blue.png"));
        
        // Interior (Category 103)
        parts.add(new Part(8, 103, "Carbon Black Leather Interior", 1500.00, "interior_black.png"));
        parts.add(new Part(9, 103, "Type-R Crimson Red Alcantara", 2200.00, "interior_red.png"));
        parts.add(new Part(21, 103, "Bride Gradient Gray Fabric", 1800.00, "interior_bride_gray.png"));
        parts.add(new Part(22, 103, "Saddle Tan Leather Interior", 2000.00, "interior_tan.png"));
       
        // Wheels (Category 104)
        parts.add(new Part(10, 104, "17-inch Enkei RPF1", 1200.00, "enkei_rpf1.png"));
        parts.add(new Part(11, 104, "18-inch Volk Racing TE37", 3200.00, "volk_te37.png"));
        parts.add(new Part(12, 104, "19-inch Work Meister S1", 3800.00, "work_meister.png"));
        parts.add(new Part(24, 104, "15-inch RS Watanabe 8-Spoke", 1100.00, "watanabe.png"));
        parts.add(new Part(25, 104, "18-inch BBS LM Wheels", 3600.00, "bbs_lm.png"));
        parts.add(new Part(26, 104, "19-inch Advan Racing GT", 3900.00, "advan_gt.png"));
    }

    public List<Part> getAllParts() {
        return parts;
    }

    public Part getPartById(int partId) {
        for (Part p : parts) {
            if (p.getPartId() == partId) {
                return p;
            }
        }
        return null;
    }
}

/*
 Stores all available individual upgrade parts across all categories, along with their prices and image references.
 Holds items like spoilers, V6/V8 engines, custom paint jobs, and wheels.
getAllParts: Returns every upgraded part in the system.
getPartID: finds and returns a specific part by its unique ID so its price can be added to the total cost.
*/
