const ICONS = {
  platforms: (
    <>
      <rect x="2.5" y="2.5" width="6" height="6" rx="1.2" />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1.2" />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1.2" />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1.2" />
    </>
  ),
  configurator: (
    <>
      <path d="M3 6h7M14 6h7M3 12h3M10 12h11M3 18h11M18 18h3" />
      <circle cx="12" cy="6" r="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="16" cy="18" r="2" />
    </>
  ),
  saved: (
    <>
      <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.2L5 21V4.5a1 1 0 0 1 1-1Z" />
      <path d="M9.5 8.5h5" />
    </>
  ),
}

function NavIcon({ name }) {
  return (
    <svg
      className="nav-icon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  )
}

export default function Navbar({ savedCount, onNavigate, onOpenSaved }) {
  return (
    <header className="nav">
      <div className="nav-inner">
        <button className="brand" type="button" onClick={() => onNavigate('top')} aria-label="Autotorium home">
          <span className="brand-bolt" aria-hidden="true">⚡</span>
          <span className="brand-word">AUTOTORIUM</span>
        </button>

        <nav className="nav-links" aria-label="Primary">
          <button className="nav-link" type="button" onClick={() => onNavigate('platforms')} aria-label="Platforms">
            <NavIcon name="platforms" />
            <span className="nav-text">Platforms</span>
          </button>
          <button className="nav-link" type="button" onClick={() => onNavigate('configurator')} aria-label="Configurator">
            <NavIcon name="configurator" />
            <span className="nav-text">Configurator</span>
          </button>
          <button className="nav-link nav-link--saved" type="button" onClick={onOpenSaved} aria-label="Saved Builds">
            <NavIcon name="saved" />
            <span className="nav-text">Saved Builds</span>
            <span className={`nav-count${savedCount > 0 ? ' is-active' : ''}`} aria-hidden="true">
              {savedCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  )
}
