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
          JDM Performance Atelier
        </p>

        <h1 className="hero-title" id="hero-title">
          Craft your{' '}
          <br />
          <span className="hero-title-accent">
            Performance<span className="hero-title-dot">.</span>
          </span>
        </h1>

        <p className="hero-sub">
          Engineered precision meets custom design. Select your chassis and configure
          compatible upgrades in real time.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" type="button" onClick={onStart}>
            Start Customizing
            <span className="cta-arrow" aria-hidden="true">↓</span>
          </button>
          <span className="hero-note">
            {VEHICLES.length} platforms · {PARTS.length} verified upgrades
          </span>
        </div>

        <dl className="hero-stats">
          <div>
            <dt>Platforms</dt>
            <dd>{String(VEHICLES.length).padStart(2, '0')}</dd>
          </div>
          <div>
            <dt>Categories</dt>
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
            Live chassis
          </span>
          <span className="hud-meta">{vehicle.code} · {vehicle.type}</span>
        </div>

        <div className="hero-photo">
          <VehiclePhoto vehicle={vehicle} eager />
        </div>

        <div className="hero-hud hero-hud--bottom">
          <div className="hero-hud-car">
            <span className="hud-label">Now configuring</span>
            <strong>{vehicle.name}</strong>
          </div>
          <div className="hero-hud-price">
            <span className="hud-label">Base</span>
            <strong>{usd(vehicle.basePrice)}</strong>
            <span className="hud-sub">{compatibleCount} compatible upgrades</span>
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
