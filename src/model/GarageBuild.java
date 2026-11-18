package model;

import java.util.ArrayList;
import java.util.List;

public class GarageBuild {
    private int buildId;
    private String buildName;
    private Vehicle vehicle;
    private List<Part> installedParts;
    private double totalPrice;
    private String status; // "IN_GARAGE" or "CHECKED_OUT"

    public GarageBuild(int buildId, String buildName, Vehicle vehicle, List<Part> installedParts, double totalPrice) {
        this.buildId = buildId;
        this.buildName = buildName;
        this.vehicle = vehicle;
        this.installedParts = new ArrayList<>(installedParts);
        this.totalPrice = totalPrice;
        this.status = "IN_GARAGE";
    }

    public int getBuildId() { return buildId; }
    public String getBuildName() { return buildName; }
    public Vehicle getVehicle() { return vehicle; }
    public List<Part> getInstalledParts() { return installedParts; }
    public double getTotalPrice() { return totalPrice; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Override
    public String toString() {
        return String.format("#%d | %s (%s) - $%,.2f [%d parts]",
                buildId, buildName, vehicle.getName(), totalPrice, installedParts.size());
    }
}
