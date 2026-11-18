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
            01 / Vehicle bays
          </p>
          <h2 className="section-title" id="platforms-title">Choose your bay</h2>
        </div>
        <p className="section-desc">
          Twelve chassis on the shop floor. Pull one into the bay and only parts verified
          for that platform appear on the rack — no universal guesswork.
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
                <span className="platform-index">Bay {String(index + 1).padStart(2, '0')}</span>
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
                className={`btn platform-select${active ? ' is-in-bay' : ''}`}
                onClick={() => onSelect(vehicle.id)}
                aria-pressed={active}
              >
                {active ? 'In bay ✓' : 'Pull into bay →'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
