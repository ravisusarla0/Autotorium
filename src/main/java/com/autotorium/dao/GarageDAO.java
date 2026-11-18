package com.autotorium.dao;

import com.autotorium.model.GarageBuild;
import com.autotorium.model.Part;
import com.autotorium.model.Vehicle;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class GarageDAO {

    public static final String IN_GARAGE = "IN_GARAGE";
    public static final String CHECKED_OUT = "CHECKED_OUT";

    private static final DateTimeFormatter TIMESTAMP_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private static final String SELECT = """
            SELECT build_id, build_name, vehicle_id, total_price, status, created_at
              FROM garage_build
            """;

    private final JdbcTemplate jdbc;
    private final VehicleDAO vehicleDAO;
    private final PartDAO partDAO;

    public GarageDAO(JdbcTemplate jdbc, VehicleDAO vehicleDAO, PartDAO partDAO) {
        this.jdbc = jdbc;
        this.vehicleDAO = vehicleDAO;
        this.partDAO = partDAO;
    }

    public List<GarageBuild> findActive() {
        return jdbc.query(SELECT + " WHERE status = ? ORDER BY created_at DESC, build_id DESC",
                (rs, rowNum) -> toBuild(rs), IN_GARAGE);
    }

    public Optional<GarageBuild> findById(long buildId) {
        return jdbc.query(SELECT + " WHERE build_id = ?", (rs, rowNum) -> toBuild(rs), buildId)
                .stream().findFirst();
    }

    public long insert(String buildName, long vehicleId, double totalPrice) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement("""
                    INSERT INTO garage_build (build_name, vehicle_id, total_price, status)
                    VALUES (?, ?, ?, ?)
                    """, new String[]{"build_id"});
            ps.setString(1, buildName);
            ps.setLong(2, vehicleId);
            ps.setBigDecimal(3, BigDecimal.valueOf(totalPrice));
            ps.setString(4, IN_GARAGE);
            return ps;
        }, keyHolder);
        return Objects.requireNonNull(keyHolder.getKey()).longValue();
    }

    public void addParts(long buildId, List<Long> partIds) {
        if (partIds.isEmpty()) {
            return;
        }
        jdbc.batchUpdate("INSERT INTO garage_build_part (build_id, part_id) VALUES (?, ?)",
                partIds, partIds.size(), (ps, partId) -> {
                    ps.setLong(1, buildId);
                    ps.setLong(2, partId);
                });
    }

    public void updateStatus(long buildId, String status) {
        jdbc.update("UPDATE garage_build SET status = ? WHERE build_id = ?", status, buildId);
    }

    public void delete(long buildId) {
        jdbc.update("DELETE FROM garage_build_part WHERE build_id = ?", buildId);
        jdbc.update("DELETE FROM garage_build WHERE build_id = ?", buildId);
    }

    private GarageBuild toBuild(ResultSet rs) throws SQLException {
        long buildId = rs.getLong("build_id");
        Vehicle vehicle = vehicleDAO.findById(rs.getLong("vehicle_id"))
                .orElseThrow(() -> new IllegalStateException("Missing vehicle for build " + buildId));
        List<Part> parts = partDAO.findForBuild(buildId);
        Timestamp created = rs.getTimestamp("created_at");
        return new GarageBuild(
                buildId,
                rs.getString("build_name"),
                vehicle,
                parts,
                rs.getBigDecimal("total_price").doubleValue(),
                rs.getString("status"),
                created == null ? "" : created.toLocalDateTime().format(TIMESTAMP_FORMAT));
    }
}
