package com.autotorium.dao;

import com.autotorium.model.Part;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Repository
public class PartDAO {

    private static final String SELECT =
            "SELECT part_id, category_id, name, price_modifier FROM part";

    private static final String SELECT_QUALIFIED =
            "SELECT part.part_id, part.category_id, part.name, part.price_modifier FROM part";

    private static final RowMapper<Part> MAPPER = (rs, rowNum) -> new Part(
            rs.getLong("part_id"),
            rs.getLong("category_id"),
            rs.getString("name"),
            rs.getDouble("price_modifier"));

    private final JdbcTemplate jdbc;

    public PartDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<Part> findAll() {
        return jdbc.query(SELECT + " ORDER BY category_id, part_id", MAPPER);
    }

    public Optional<Part> findById(long partId) {
        return jdbc.query(SELECT + " WHERE part_id = ?", MAPPER, partId).stream().findFirst();
    }

    /** Parts verified to fit the given chassis. */
    public List<Part> findCompatibleForVehicle(long vehicleId) {
        return jdbc.query(SELECT_QUALIFIED + """
                 JOIN vehicle_compatibility vc ON vc.part_id = part.part_id
                WHERE vc.vehicle_id = ?
                ORDER BY part.category_id, part.price_modifier DESC, part.part_id
                """, MAPPER, vehicleId);
    }

    /** Parts installed on a saved garage build. */
    public List<Part> findForBuild(long buildId) {
        return jdbc.query(SELECT_QUALIFIED + """
                 JOIN garage_build_part gbp ON gbp.part_id = part.part_id
                WHERE gbp.build_id = ?
                ORDER BY part.category_id, part.price_modifier DESC, part.part_id
                """, MAPPER, buildId);
    }

    public List<Part> findByIds(Collection<Long> partIds) {
        if (partIds.isEmpty()) {
            return Collections.emptyList();
        }
        String placeholders = String.join(",", Collections.nCopies(partIds.size(), "?"));
        return jdbc.query(SELECT + " WHERE part_id IN (" + placeholders + ") ORDER BY part_id",
                MAPPER, partIds.toArray());
    }
}
