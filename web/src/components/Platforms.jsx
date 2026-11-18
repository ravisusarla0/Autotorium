import VehiclePhoto from './VehiclePhoto'
import { VEHICLES, getCompatibleParts } from '../data/catalog'
import { usd } from '../lib/format'

export default function Platforms({ activeVehicleId, onSelect }) {
  return (
    <section className="section" id="platforms" aria-labelledby="platforms-title">
      <div className="section-head">
        <div>
          <p className="eyebrow">
            <span className="rule" aria-hidden="true" />
            01 / Platforms
          </p>
          <h2 className="section-title" id="platforms-title">Choose your chassis</h2>
        </div>
        <p className="section-desc">
          Twelve legends, one fitment engine. Every upgrade in the configurator is verified
          against the chassis you select — no universal guesswork, no incompatible parts.
        </p>
      </div>

      <div className="platform-grid">
        {VEHICLES.map((vehicle, index) => {
          const active = vehicle.id === activeVehicleId
          const compatibleCount = getCompatibleParts(vehicle.id).length

          return (
            <article
              key={vehicle.id}
              className={`platform-card${active ? ' is-active' : ''}`}
              data-vehicle-id={vehicle.id}
            >
              <div className="platform-top">
                <span className="platform-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="platform-type">{vehicle.type}</span>
              </div>

              <div className="platform-photo">
                <VehiclePhoto vehicle={vehicle} />
              </div>

              <h3 className="platform-name">{vehicle.name}</h3>

              <div className="platform-meta">
                <div>
                  <span>Base price</span>
                  <strong>{usd(vehicle.basePrice)}</strong>
                </div>
                <div>
                  <span>Fitment</span>
                  <strong>{compatibleCount} upgrades</strong>
                </div>
              </div>

              <button
                type="button"
                className={`btn platform-select ${active ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => onSelect(vehicle.id)}
                aria-pressed={active}
              >
                {active ? 'Selected ✓' : 'Select Chassis'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
