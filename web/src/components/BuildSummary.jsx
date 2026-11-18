import CarArt from './CarArt'
import { usd } from '../lib/format'

export default function BuildSummary({
  vehicle,
  selectedParts,
  total,
  buildName,
  onBuildNameChange,
  onSave,
  onClearParts,
}) {
  return (
    <aside className="summary" aria-labelledby="summary-title">
      <div className="summary-head">
        <div>
          <p className="eyebrow eyebrow--sm">Live build</p>
          <h3 className="summary-title" id="summary-title">Summary</h3>
        </div>
        <span className="summary-count">
          {selectedParts.length} {selectedParts.length === 1 ? 'upgrade' : 'upgrades'}
        </span>
      </div>

      <div className="summary-body">
        <div className="summary-car">
          <div className="summary-car-art">
            <CarArt type={vehicle.type} glow={false} />
          </div>
          <div className="summary-car-info">
            <span className="summary-car-type">{vehicle.type} · {vehicle.code}</span>
            <strong className="summary-car-name">{vehicle.name}</strong>
            <span className="summary-car-sub">
              {selectedParts.length > 0
                ? `${selectedParts.length} active ${selectedParts.length === 1 ? 'upgrade' : 'upgrades'}`
                : 'Stock configuration'}
            </span>
          </div>
        </div>

        <div className="receipt" aria-label="Price breakdown">
          <div className="receipt-row receipt-base">
            <span>Base price</span>
            <span className="receipt-amount">{usd(vehicle.basePrice)}</span>
          </div>

          {selectedParts.length === 0 ? (
            <p className="receipt-empty">
              No upgrades selected. Choose compatible parts on the left to start the build.
            </p>
          ) : (
            <ul className="receipt-list">
              {selectedParts.map((part) => (
                <li className="receipt-row" key={part.id}>
                  <span className="receipt-name">
                    <span className="receipt-dot" aria-hidden="true" />
                    {part.name}
                  </span>
                  <span className="receipt-amount">+ {usd(part.priceModifier)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="total">
          <div className="total-copy">
            <span className="total-label">Total build price</span>
            <span className="total-sub">USD · taxes excluded</span>
          </div>
          <strong className="total-amount" data-testid="total-price">{usd(total)}</strong>
        </div>

        <div className="save-block">
          <label className="field-label" htmlFor="build-name">
            Build name <span className="optional">optional</span>
          </label>
          <input
            id="build-name"
            className="text-input"
            type="text"
            value={buildName}
            onChange={(event) => onBuildNameChange(event.target.value)}
            placeholder={`${vehicle.name} Custom`}
            maxLength={60}
          />
          <button className="btn btn-primary save-btn" type="button" onClick={onSave}>
            <svg
              viewBox="0 0 20 20"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 3h10a1 1 0 0 1 1 1v13l-6-3.6L4 17V4a1 1 0 0 1 1-1Z" />
            </svg>
            Save Configuration
          </button>
          {selectedParts.length > 0 && (
            <button className="link-btn" type="button" onClick={onClearParts}>
              Clear all upgrades
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
