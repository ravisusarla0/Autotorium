import BuildSummary from './BuildSummary'
import PartCard from './PartCard'
import { CATEGORIES, getCategoryById } from '../data/catalog'

const ALL = 'all'

export default function Configurator({
  vehicles,
  activeVehicle,
  compatibleParts,
  activeCategory,
  onCategoryChange,
  selectedPartIds,
  onTogglePart,
  onSelectVehicle,
  total,
  buildName,
  onBuildNameChange,
  onSave,
  onClearParts,
}) {
  const selectedSet = new Set(selectedPartIds)
  const visibleParts =
    activeCategory === ALL
      ? compatibleParts
      : compatibleParts.filter((part) => part.categoryId === activeCategory)

  const tabs = [
    { id: ALL, name: 'All', count: compatibleParts.length },
    ...CATEGORIES.map((category) => ({
      id: category.id,
      name: category.name,
      count: compatibleParts.filter((part) => part.categoryId === category.id).length,
    })),
  ]

  const activeTabName = activeCategory === ALL ? 'all categories' : getCategoryById(activeCategory)?.name

  return (
    <section className="section configurator-section" id="configurator" aria-labelledby="configurator-title">
      <div className="section-head">
        <div>
          <p className="eyebrow">
            <span className="rule" aria-hidden="true" />
            02 / Configurator
          </p>
          <h2 className="section-title" id="configurator-title">Build your spec</h2>
        </div>
        <p className="section-desc">
          Filter by category and toggle verified upgrades. Switching chassis clears anything
          that no longer fits before the total is recalculated.
        </p>
      </div>

      <div className="config-layout">
        <div className="config-panel">
          <div className="field">
            <label className="field-label" htmlFor="vehicle-select">Active chassis</label>
            <div className="select-wrap">
              <select
                id="vehicle-select"
                value={activeVehicle.id}
                onChange={(event) => onSelectVehicle(Number(event.target.value))}
              >
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} — {vehicle.type}
                  </option>
                ))}
              </select>
              <svg
                className="select-chevron"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </div>
            <p className="fitment-line">
              <span className="fitment-dot" aria-hidden="true" />
              Showing only parts verified for the {activeVehicle.name}
            </p>
          </div>

          <div className="tabs" role="tablist" aria-label="Upgrade categories">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === tab.id}
                className={`tab${activeCategory === tab.id ? ' is-active' : ''}`}
                onClick={() => onCategoryChange(tab.id)}
                data-category={tab.id}
              >
                {tab.name}
                <span className="tab-count">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="parts-head">
            <span className="parts-count">
              {visibleParts.length} {visibleParts.length === 1 ? 'upgrade' : 'upgrades'}
            </span>
            <span className="parts-context">{activeTabName}</span>
          </div>

          {visibleParts.length === 0 ? (
            <p className="parts-empty">
              No verified parts in this category for the {activeVehicle.name}. Pick another
              category or chassis.
            </p>
          ) : (
            <div className="parts-grid">
              {visibleParts.map((part) => (
                <PartCard
                  key={part.id}
                  part={part}
                  categoryName={getCategoryById(part.categoryId)?.name ?? ''}
                  selected={selectedSet.has(part.id)}
                  onToggle={onTogglePart}
                />
              ))}
            </div>
          )}
        </div>

        <BuildSummary
          vehicle={activeVehicle}
          selectedParts={selectedPartIds.map((id) => compatibleParts.find((part) => part.id === id)).filter(Boolean)}
          total={total}
          buildName={buildName}
          onBuildNameChange={onBuildNameChange}
          onSave={onSave}
          onClearParts={onClearParts}
        />
      </div>
    </section>
  )
}
