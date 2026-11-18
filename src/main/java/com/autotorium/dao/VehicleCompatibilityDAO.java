package com.autotorium.dao;

import com.autotorium.model.VehicleCompatibility;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class VehicleCompatibilityDAO {

    private static final RowMapper<VehicleCompatibility> MAPPER = (rs, rowNum) ->
            new VehicleCompatibility(rs.getLong("vehicle_id"), rs.getLong("part_id"));

    private final JdbcTemplate jdbc;

    public VehicleCompatibilityDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<VehicleCompatibility> findForVehicle(long vehicleId) {
        return jdbc.query(
                "SELECT vehicle_id, part_id FROM vehicle_compatibility WHERE vehicle_id = ? ORDER BY part_id",
                MAPPER, vehicleId);
    }

    public boolean exists(long vehicleId, long partId) {
        Integer count = jdbc.queryForObject("""
                SELECT COUNT(*) FROM vehicle_compatibility
                 WHERE vehicle_id = ? AND part_id = ?
                """, Integer.class, vehicleId, partId);
        return count != null && count > 0;
    }
}
