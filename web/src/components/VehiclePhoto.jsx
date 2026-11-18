import { useState } from 'react'

export default function VehiclePhoto({ vehicle, className = '', eager = false, children }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const failed = !vehicle.photo || failedSrc === vehicle.photo

  return (
    <div className={`vehicle-photo ${className}`.trim()}>
      {!failed && (
        <img
          src={vehicle.photo}
          alt={`${vehicle.name} — ${vehicle.type}`}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable="false"
          onError={() => setFailedSrc(vehicle.photo)}
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
