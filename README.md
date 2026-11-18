# Autotorium

JDM customs & build management: pick a chassis, configure compatible parts, park the build in the
garage, check it out into a shop ticket and move it across the bay board.

## Stack

- Java 21 / Spring Boot 3 (Maven)
- REST API under `/api` (`src/main/java/com/autotorium/web`)
- H2 file database, schema and seed data in `src/main/resources/schema.sql` and `data.sql`
- Dependency-free SPA in `src/main/resources/static` (`index.html`, `styles.css`, `app.js`)

## Run

```bash
mvn spring-boot:run            # http://localhost:3000
```

The database defaults to `./data/autotorium`; override with `AUTOTORIUM_DB_PATH` or `PORT`.

In the Base44 sandbox the app is served by the environment compose file
(`docker-compose.base44.yml` in the environment repository), which runs the same Maven build with a
source bind mount and restarts the server when Java sources change.

## Tests

```bash
mvn test
```

`AutotoriumApiTest` covers the 12-vehicle catalogue, compatibility filtering, the
save → checkout → ticket flow, ticket transitions and garage removal.
