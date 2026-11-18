package com.autotorium.dao;

import com.autotorium.model.BuildTicket;
import com.autotorium.model.GarageBuild;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class TicketDAO {

    public static final String PENDING = "PENDING";
    public static final String IN_PROGRESS = "IN_PROGRESS";
    public static final String COMPLETED = "COMPLETED";

    private static final DateTimeFormatter TIMESTAMP_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private static final String SELECT = """
            SELECT ticket_id, build_id, customer_name, status, created_at
              FROM build_ticket
            """;

    private final JdbcTemplate jdbc;
    private final GarageDAO garageDAO;

    public TicketDAO(JdbcTemplate jdbc, GarageDAO garageDAO) {
        this.jdbc = jdbc;
        this.garageDAO = garageDAO;
    }

    public long insert(long buildId, String customerName) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement("""
                    INSERT INTO build_ticket (build_id, customer_name, status)
                    VALUES (?, ?, ?)
                    """, new String[]{"ticket_id"});
            ps.setLong(1, buildId);
            ps.setString(2, customerName);
            ps.setString(3, PENDING);
            return ps;
        }, keyHolder);
        return Objects.requireNonNull(keyHolder.getKey()).longValue();
    }

    public List<BuildTicket> findAll() {
        return jdbc.query(SELECT + " ORDER BY created_at ASC, ticket_id ASC", mapper());
    }

    public Optional<BuildTicket> findById(long ticketId) {
        return jdbc.query(SELECT + " WHERE ticket_id = ?", mapper(), ticketId).stream().findFirst();
    }

    public void updateStatus(long ticketId, String status) {
        jdbc.update("UPDATE build_ticket SET status = ? WHERE ticket_id = ?", status, ticketId);
    }

    private RowMapper<BuildTicket> mapper() {
        return (rs, rowNum) -> {
            long ticketId = rs.getLong("ticket_id");
            GarageBuild build = garageDAO.findById(rs.getLong("build_id"))
                    .orElseThrow(() -> new IllegalStateException(
                            "Missing build for ticket " + ticketId));
            Timestamp created = rs.getTimestamp("created_at");
            return new BuildTicket(
                    ticketId,
                    build,
                    rs.getString("customer_name"),
                    rs.getString("status"),
                    created == null ? "" : created.toLocalDateTime().format(TIMESTAMP_FORMAT));
        };
    }
}
