Package model;

import java.util.ArraysList;
import java.util.List;

public class GarageBuild {
  private int buildId;
  private String buildname;
  private Vehicle vehicle;
  private double  total price;
  private String status; //" in garage or check out"

Public GarageBuild (int buildId, String buildIf, Vechile , list <part> installedparts, double totalprice) {
  this.buildId = buildId;
  this.buildName = buildName;
  ths.installedparts= new ArrayList <> (installedparts);
  this.totalprice= totalprice;
  this.status = "In_Garage";
}

  public int getBuildId() {return buildId; }
  public String geetBuildName() { return buildName;}
  public Vehicle getVehicle() { return vehicle; }
  public List<Part> getInstalledParts() { return installedParts; }
  public double getTotalPrice() { return totalPrice; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  
  @Override
  public String toString() {
    return String.format("#%d | %s (%s) - $%,.2f [%d parts]",
                         buildId, buildName, vehicle.getName(), totalPrice, installedParts.size()):
  }
}
