package dao;

import model.Part;
import java.util.ArrayList;
import java.util.List;

public class PartDAO {
    private List<Part> parts = new ArrayList<>();

    public PartDAO() {
        // Performance (Category 101)
        parts.add(new Part(1, 101, "V6 Turbo Engine Upgrade", 3500.00, "v6_turbo.png"));
        parts.add(new Part(2, 101, "V8 Dual-Turbo Engine Upgrade", 6000.00, "v8_turbo.png"));
        parts.add(new Part(3, 101, "Electric Dual-Motor Pack", 5000.00, "ev_pack.png"));

        // Exterior (Category 102)
        parts.add(new Part(4, 102, "Carbon Fiber Spoiler", 800.00, "spoiler.png"));
        parts.add(new Part(5, 102, "Matte Black Paint Finish", 1200.00, "matte_black.png"));

        // Interior (Category 103)
        parts.add(new Part(6, 103, "Premium Leather Seats", 1500.00, "leather.png"));
        parts.add(new Part(7, 103, "Bose Surround Sound System", 1100.00, "bose.png"));

        // Wheels (Category 104)
        parts.add(new Part(8, 104, "18-inch Alloy Wheels", 900.00, "alloy18.png"));
        parts.add(new Part(9, 104, "20-inch Forged Performance Rim", 1800.00, "forged20.png"));
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
