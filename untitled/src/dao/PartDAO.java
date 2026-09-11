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
        parts.add(new Part(6, 102, "Voltex Carbon Fiber GT Wing", 1800.00, "voltex_wing.png"));
        parts.add(new Part(7, 102, "Midnight Purple III Paint", 4500.00, "midnight_purple.png"));

        // Interior (Category 103)
        parts.add(new Part(8, 103, "Bride Zeta III Racing Seats", 2200.00, "bride_seats.png"));
        parts.add(new Part(9, 103, "Nardi Classic Steering Wheel", 400.00, "nardi_wheel.png"));

        // Wheels (Category 104)
        parts.add(new Part(10, 104, "17-inch Enkei RPF1", 1200.00, "enkei_rpf1.png"));
        parts.add(new Part(11, 104, "18-inch Volk Racing TE37", 3200.00, "volk_te37.png"));
        parts.add(new Part(12, 104, "19-inch Work Meister S1", 3800.00, "work_meister.png"));
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
