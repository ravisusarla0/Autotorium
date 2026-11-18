package dao;

import model.GarageBuild;
import java.util.ArrayList;
import java.util.List;

public class GarageDAO {
    private final List<GarageBuild> garageBuilds = new ArrayList<>();
    private int nextBuildId = 1;

    public int getNextBuildId() {
        return nextBuildId++;
    }

    public void addBuild(GarageBuild build) {
        garageBuilds.add(build);
    }

    public void removeBuild(GarageBuild build) {
        garageBuilds.remove(build);
    }

    public List<GarageBuild> getActiveGarageBuilds() {
        List<GarageBuild> active = new ArrayList<>();
        for (GarageBuild b : garageBuilds) {
            if ("IN_GARAGE".equals(b.getStatus())) {
                active.add(b);
            }
        }
        return active;
    }
}
