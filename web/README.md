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
- `image_url` files from the schema are not present in the repo; the UI uses bundled
  model photography in `web/public/cars/` instead (see below).

## Vehicle photography

Each of the twelve vehicles has its own 1920px-wide photo in `web/public/cars/`,
sourced from Wikimedia Commons. Authors and licences are listed in
`web/public/cars/CREDITS.md`; the footer links to it.

`VehiclePhoto` renders the image inside a dark studio frame with a vignette and
falls back to a styled model-name placeholder if an image fails to load
(`onError`). The live summary overlays the active paint swatch tint and the
currently selected paint/wheel badges as parts are toggled.

## State

Selected parts, active chassis, category filter and saved builds live in React
state. Saved builds are persisted to `localStorage` under
`autotorium.saved-builds.v1` as `{ id, name, vehicleId, partIds, totalPrice,
createdAt }`. Loading a build re-validates every part against that build's
chassis before applying it.
