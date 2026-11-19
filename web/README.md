# Autotorium Web

React + Vite front end for the Autotorium JDM configurator. It is additive: the
original JavaFX application (`src/`, `pom.xml`) is untouched.

```bash
cd web
npm install
npm run dev   # http://localhost:3000
```

## Data model

`web/src/data/catalog.js` mirrors `database_schema.sql` and the in-memory seeds
in `src/dao`:

- **Categories** — Performance (101), Exterior (102), Interior (103), Wheels (104).
- **Vehicles** — the nine seeded chassis with their exact `base_price`, plus the
  three extended chassis referenced by `src/dao/VehicleCompatibilityDAO.java`:
  Honda S2000 AP2 (#10), Nissan 350Z (#11), Lexus LFA (#12).
- **Parts** — exact `price_modifier` values from the schema.
- **Compatibility** — the universal set
  `[5, 6, 7, 18, 19, 20, 8, 9, 21, 22]` plus each chassis' engine/wheel rows.
  `getCompatibleParts(vehicleId)` is the single source of truth for the UI.

## Notes on the schema

- The trailing block in `database_schema.sql` is unterminated SQL and reuses part
  ids 20–29 and vehicle ids 10–14, so it cannot be applied as written. The
  duplicate rows were resolved in favour of the clearly-mapped part ids above.
- The S2000/350Z base prices and the prices for the extended parts 27, 28, 29 and
  34 are not defined anywhere in the repository, so reasonable values were chosen.
- Universal fitment is applied to all twelve platforms.
- `image_url` files from the schema are not present in the repo; the UI uses
  Wikimedia Commons photography referenced directly from `catalog.js` (see below).

## Vehicle photography

Every vehicle's `photo` (and `photoFallback`) is a direct 1920px thumbnail on
`https://upload.wikimedia.org/wikipedia/commons/...`, sourced from the matching
Wikimedia Commons file for that exact model. Authors and licences are listed in
`web/public/cars/CREDITS.md`; the footer links to it.

`VehiclePhoto` renders the image with `referrerPolicy="no-referrer"` inside a
dark studio frame (`object-fit: cover`) with a bottom gradient vignette. Its
`onError` chain tries the secondary Commons photo, then falls back to a styled
model-name placeholder, so a broken image icon never appears. The live summary
overlays the active paint swatch tint and the currently selected paint/wheel
badges as parts are toggled.

The older bundled files in `web/public/cars/` are no longer referenced by the
UI and remain only as an offline archive.

## State

Selected parts, active chassis, category filter and saved builds live in React
state. Saved builds are persisted to `localStorage` under
`autotorium.saved-builds.v1` as `{ id, buildId, name, vehicleId, partIds,
totalPrice, createdAt }`. Loading a build re-validates every part against that
build's chassis before applying it.

## Shop floor tickets

Tickets live in `localStorage` under `autotorium.tickets.v1` and move through
`QUEUED` → `IN_THE_BAY` → `READY_FOR_PICKUP` (older `PENDING` / `IN_PROGRESS` /
`COMPLETED` tickets are normalised on read).

A ticket stores the saved build's `buildId`, which links the two screens:

- Submitting a build that already has a `QUEUED` ticket updates that ticket
  instead of creating a second one.
- Loading a saved build whose ticket is still `QUEUED` binds the configurator to
  it: part toggles, build name, and total are written straight onto the ticket
  card as they change, and the submit button reads "Update shop floor ticket"
  with a "Synced with ticket #XXXX" badge.
- Loading a saved build whose ticket is `IN_THE_BAY` or `READY_FOR_PICKUP`
  loads it read-only — part toggles, chassis switching, saving and submitting
  are disabled behind a lock banner until the ticket leaves the board.
