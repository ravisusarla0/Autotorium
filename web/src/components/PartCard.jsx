import CategoryIcon from './CategoryIcon'
import { usd } from '../lib/format'

export default function PartCard({ part, categoryName, selected, onToggle }) {
  return (
    <label className={`part-card${selected ? ' is-selected' : ''}`} data-part-card={part.id}>
      <input
        type="checkbox"
        className="part-input"
        checked={selected}
        onChange={() => onToggle(part.id)}
        data-part-id={part.id}
        aria-label={`${part.name} — add ${usd(part.priceModifier)}`}
      />

      <span className="part-top">
        <span className="part-icon" aria-hidden="true">
          <CategoryIcon categoryId={part.categoryId} />
        </span>
        <span className="part-check" aria-hidden="true">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path
              d="M2.4 6.3 5 8.9 9.7 3.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>

      <span className="part-name">{part.name}</span>

      <span className="part-bottom">
        <span className="part-cat">
          <span className="part-sku">PT-{String(part.id).padStart(3, '0')}</span>
          {categoryName}
        </span>
        <span className="part-price">
          <span className="part-plus" aria-hidden="true">+</span>
          {usd(part.priceModifier)}
        </span>
      </span>
    </label>
  )
}
