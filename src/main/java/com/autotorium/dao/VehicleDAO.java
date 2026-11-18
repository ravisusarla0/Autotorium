package com.autotorium.dao;

import com.autotorium.model.Vehicle;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class VehicleDAO {

    private static final String SELECT =
            "SELECT vehicle_id, name, type, base_price, image_url FROM vehicle";

    private static final RowMapper<Vehicle> MAPPER = (rs, rowNum) -> new Vehicle(
            rs.getLong("vehicle_id"),
            rs.getString("name"),
            rs.getString("type"),
            rs.getDouble("base_price"),
            rs.getString("image_url"));

    private final JdbcTemplate jdbc;

    public VehicleDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<Vehicle> findAll() {
        return jdbc.query(SELECT + " ORDER BY vehicle_id", MAPPER);
    }

    public Optional<Vehicle> findById(long vehicleId) {
        return jdbc.query(SELECT + " WHERE vehicle_id = ?", MAPPER, vehicleId).stream().findFirst();
    }
}
