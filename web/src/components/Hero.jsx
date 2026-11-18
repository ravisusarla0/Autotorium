import VehiclePhoto from './VehiclePhoto'
import { CATEGORIES, PARTS, VEHICLES, getCompatibleParts } from '../data/catalog'
import { usd } from '../lib/format'

export default function Hero({ vehicle, onStart }) {
  const compatibleCount = getCompatibleParts(vehicle.id).length

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="pulse-dot" aria-hidden="true" />
          Pit-bay studio // JDM performance
        </p>

        <h1 className="hero-title" id="hero-title">
          Built in the <span className="hero-title-accent">bay.</span>
          <br />
          Engineered for
          <br />
          the <span className="hero-title-accent">street.</span>
        </h1>

        <p className="hero-sub">
          Roll a chassis onto the lift, bolt on verified parts, and watch the build
          sheet total update in real time.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" type="button" onClick={onStart}>
            Enter the bay
            <span className="cta-arrow" aria-hidden="true">↓</span>
          </button>
          <span className="hero-note">
            {VEHICLES.length} bays · {PARTS.length} verified parts
          </span>
        </div>

        <dl className="hero-stats">
          <div>
            <dt>Bays</dt>
            <dd>{String(VEHICLES.length).padStart(2, '0')}</dd>
          </div>
          <div>
            <dt>Tool drawers</dt>
            <dd>{String(CATEGORIES.length).padStart(2, '0')}</dd>
          </div>
          <div>
            <dt>Fitment</dt>
            <dd className="is-word">Strict</dd>
          </div>
        </dl>
      </div>

      <div className="hero-visual" aria-label={`${vehicle.name} showcase`}>
        <div className="hero-visual-grid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />

        <div className="hero-hud hero-hud--top">
          <span className="hud-tag">
            <span className="pulse-dot" aria-hidden="true" />
            Lift 01 // live
          </span>
          <span className="hud-meta">{vehicle.code} · {vehicle.type}</span>
        </div>

        <div className="hero-photo">
          <VehiclePhoto vehicle={vehicle} eager />
        </div>

        <div className="hero-hud hero-hud--bottom">
          <div className="hero-hud-car">
            <span className="hud-label">On the lift</span>
            <strong>{vehicle.name}</strong>
          </div>
          <div className="hero-hud-price">
            <span className="hud-label">Sticker</span>
            <strong>{usd(vehicle.basePrice)}</strong>
            <span className="hud-sub">{compatibleCount} verified parts</span>
          </div>
        </div>

        <span className="hero-corner hero-corner--tl" aria-hidden="true" />
        <span className="hero-corner hero-corner--tr" aria-hidden="true" />
        <span className="hero-corner hero-corner--bl" aria-hidden="true" />
        <span className="hero-corner hero-corner--br" aria-hidden="true" />
      </div>
    </section>
  )
}
