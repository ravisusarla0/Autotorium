import { useEffect } from 'react'
import { getPartById, getVehicleById } from '../data/catalog'
import { formatDate, usd } from '../lib/format'

export default function SavedBuildsDrawer({ open, builds, onClose, onLoad, onDelete, onStart }) {
  useEffect(() => {
    if (!open) return undefined

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="drawer-layer">
      <button className="drawer-backdrop" type="button" aria-label="Close saved builds" onClick={onClose} />

      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="saved-title">
        <header className="drawer-head">
          <div>
            <p className="eyebrow eyebrow--sm">Garage log // local storage</p>
            <h2 className="drawer-title" id="saved-title">
              Saved builds <span className="drawer-count">{builds.length}</span>
            </h2>
          </div>
          <button className="icon-btn" type="button" aria-label="Close saved builds" onClick={onClose}>
            <svg
              viewBox="0 0 20 20"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </header>

        <div className="drawer-body">
          {builds.length === 0 ? (
            <div className="drawer-empty">
              <span className="empty-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="26"
                  height="26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.2L5 21V4.5a1 1 0 0 1 1-1Z" />
                  <path d="M9.5 8.5h5" />
                </svg>
              </span>
              <h3>No builds saved yet</h3>
              <p>
                Configure a chassis, add compatible upgrades, then hit “Save build to
                garage”. Your builds live in this browser — no account required.
              </p>
              <button className="btn btn-primary" type="button" onClick={onStart}>
                Start configuring
              </button>
            </div>
          ) : (
            <ul className="saved-list">
              {builds.map((build) => {
                const vehicle = getVehicleById(build.vehicleId)
                if (!vehicle) return null

                const partNames = (build.partIds ?? [])
                  .map((partId) => getPartById(partId)?.name)
                  .filter(Boolean)

                return (
                  <li className="saved-card" key={build.id} data-build-id={build.id}>
                    <div className="saved-top">
                      <div className="saved-id">
                        <h3 className="saved-name">{build.name}</h3>
                        <p className="saved-vehicle">{vehicle.name} · {vehicle.type}</p>
                      </div>
                      <strong className="saved-total">{usd(build.totalPrice)}</strong>
                    </div>

                    {partNames.length > 0 && (
                      <div className="saved-parts">
                        {partNames.slice(0, 3).map((name) => (
                          <span className="chip" key={name}>{name}</span>
                        ))}
                        {partNames.length > 3 && (
                          <span className="chip chip--more">+{partNames.length - 3} more</span>
                        )}
                      </div>
                    )}

                    <div className="saved-meta">
                      <span>{formatDate(build.createdAt)}</span>
                      <span>
                        {partNames.length} {partNames.length === 1 ? 'upgrade' : 'upgrades'}
                      </span>
                    </div>

                    <div className="saved-actions">
                      <button className="btn btn-ghost btn-sm" type="button" onClick={() => onLoad(build)}>
                        Load build
                      </button>
                      <button
                        className="icon-btn icon-btn--danger"
                        type="button"
                        aria-label={`Delete ${build.name}`}
                        onClick={() => onDelete(build)}
                      >
                        <svg
                          viewBox="0 0 20 20"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M3.5 5.5h13M8 5.5V3.8h4v1.7M5.2 5.5l.8 10.2a1 1 0 0 0 1 .9h6a1 1 0 0 0 1-.9l.8-10.2M8.2 8.5v5M11.8 8.5v5" />
                        </svg>
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <footer className="drawer-foot">
          <p>Stored locally in this browser · no account required</p>
        </footer>
      </aside>
    </div>
  )
}
