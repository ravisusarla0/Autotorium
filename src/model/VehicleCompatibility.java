package model;

public class VehicleCompatibility {
    private int vehicleId;
    private int partId;

    public VehicleCompatibility(int vehicleId, int partId) {
        this.vehicleId = vehicleId;
        this.partId = partId;
    }

    // Getters and Setters
    public int getVehicleId() { return vehicleId; }
    public void setVehicleId(int vehicleId) { this.vehicleId = vehicleId; }

    public int getPartId() { return partId; }
    public void setPartId(int partId) { this.partId = partId; }
}