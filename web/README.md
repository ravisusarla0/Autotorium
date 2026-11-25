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
`autotorium.saved-builds.v1` as `{ buildId, id, name, vehicleId, partIds,
totalPrice, createdAt }`. `buildId` is the build's stable unique id and is
copied onto the build's shop-floor ticket (`ticket.buildId`) when it is
submitted, so a queued ticket is updated in place instead of duplicated.
Loading a build re-validates every part against that build's chassis before
applying it.

Shop-floor work orders are persisted under `autotorium_tickets` and are shared
by the customer tracker and the technician bay board. While a build's ticket is
still `PENDING` (1. Queued), edits on the workbench update that same ticket in
place. Once a technician advances the ticket to `IN_PROGRESS` (2. In the Bay) or
`COMPLETED` (3. Ready for Pickup), the customer's configurator locks for that
build.
