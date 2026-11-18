import { useState } from 'react'

// Tries the primary Wikimedia Commons photo, then a secondary Commons file,
// then falls back to the dark studio placeholder. Failure counts are keyed by
// vehicle so switching chassis starts the chain again.
export default function VehiclePhoto({ vehicle, className = '', eager = false, children }) {
  const [failure, setFailure] = useState({ vehicleId: null, count: 0 })
  const attempts = failure.vehicleId === vehicle.id ? failure.count : 0
  const sources = [vehicle.photo, vehicle.photoFallback].filter(Boolean)
  const src = sources[attempts]
  const failed = !src

  const handleError = () => {
    setFailure((previous) => ({
      vehicleId: vehicle.id,
      count: (previous.vehicleId === vehicle.id ? previous.count : 0) + 1,
    }))
  }

  return (
    <div className={`vehicle-photo ${className}`.trim()}>
      {!failed && (
        <img
          key={src}
          src={src}
          alt={`${vehicle.name} — ${vehicle.type}`}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable="false"
          referrerPolicy="no-referrer"
          onError={handleError}
          data-vehicle-photo={vehicle.id}
        />
      )}

      {failed ? (
        <div
          className="vehicle-photo-fallback"
          role="img"
          aria-label={`${vehicle.name} studio placeholder`}
          data-photo-fallback={vehicle.id}
        >
          <span className="fallback-code" aria-hidden="true">{vehicle.code}</span>
          <span className="fallback-name">{vehicle.name}</span>
          <span className="fallback-note">Studio image unavailable</span>
        </div>
      ) : (
        <span className="vehicle-photo-vignette" aria-hidden="true" />
      )}

      {children}
    </div>
  )
}
