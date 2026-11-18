package com.autotorium.dao;

import com.autotorium.model.PartCategory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class PartCategoryDAO {

    private static final RowMapper<PartCategory> MAPPER = (rs, rowNum) ->
            new PartCategory(rs.getLong("category_id"), rs.getString("name"));

    private final JdbcTemplate jdbc;

    public PartCategoryDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<PartCategory> findAll() {
        return jdbc.query(
                "SELECT category_id, name FROM part_category ORDER BY category_id", MAPPER);
    }

    public Optional<PartCategory> findByName(String name) {
        return jdbc.query(
                "SELECT category_id, name FROM part_category WHERE LOWER(name) = LOWER(?)",
                MAPPER, name).stream().findFirst();
    }
}
