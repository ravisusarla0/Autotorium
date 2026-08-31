package model;

public class Vehicle {
    private int vehicleId;
    private String name;
    private String type;
    private double basePrice;
    private String imageUrl;

    public Vehicle(int vehicleId, String name, String type, double basePrice, String imageUrl) {
        this.vehicleId = vehicleId;
        this.name = name;
        this.type = type;
        this.basePrice = basePrice;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public int getVehicleId() { return vehicleId; }
    public void setVehicleId(int vehicleId) { this.vehicleId = vehicleId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getBasePrice() { return basePrice; }
    public void setBasePrice(double basePrice) { this.basePrice = basePrice; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}