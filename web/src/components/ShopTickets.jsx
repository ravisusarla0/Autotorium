import { getPartById, getVehicleById } from '../data/catalog'
import { formatDate, usd } from '../lib/format'
import { TICKET_STATUS } from '../hooks/useTickets'

const BAYS = [
  {
    status: TICKET_STATUS.PENDING,
    title: '1. Queued',
    note: 'Pending',
    tone: 'queued',
    action: 'Roll into bay →',
  },
  {
    status: TICKET_STATUS.IN_PROGRESS,
    title: '2. In the Bay',
    note: 'Building',
    tone: 'building',
    action: 'Mark ready →',
  },
  {
    status: TICKET_STATUS.COMPLETED,
    title: '3. Ready for Pickup',
    note: 'Completed',
    tone: 'ready',
    action: null,
    clearable: true,
  },
]

function TicketCard({ ticket, bay, technicianMode, onAdvance, onRemove }) {
  const vehicle = getVehicleById(ticket.vehicleId)
  const partNames = (ticket.partIds ?? [])
    .map((partId) => getPartById(partId)?.name)
    .filter(Boolean)

  return (
    <article className={`shop-ticket shop-ticket--${bay.tone}`} data-ticket-id={ticket.id}>
      <div className="shop-ticket-top">
        <span className="shop-ticket-id">Ticket #{ticket.id}</span>
        <span className="shop-ticket-state">
          <span className={`shop-led shop-led--${bay.tone}`} aria-hidden="true" />
          {bay.note}
        </span>
      </div>

      <h4 className="shop-ticket-car">{vehicle ? vehicle.name : 'Chassis unavailable'}</h4>
      <p className="shop-ticket-build">“{ticket.buildName}”</p>

      <ul className="shop-ticket-parts">
        {partNames.length === 0 ? (
          <li className="shop-ticket-part">Stock OEM delivery — no mods</li>
        ) : (
          partNames.map((name) => (
            <li className="shop-ticket-part" key={name}>
              <span className="shop-ticket-bullet" aria-hidden="true" />
              {name}
            </li>
          ))
        )}
      </ul>

      <div className="shop-ticket-meta">
        <span>{ticket.customerName}</span>
        <span>{formatDate(ticket.createdAt)}</span>
      </div>

      <div className="shop-ticket-foot">
        <strong className="shop-ticket-total">{usd(ticket.totalPrice)}</strong>
        {technicianMode && bay.action && (
          <button
            className="btn btn-ghost btn-sm shop-advance"
            type="button"
            onClick={() => onAdvance(ticket.id)}
          >
            {bay.action}
          </button>
        )}
        {technicianMode && bay.clearable && (
          <button
            className="btn btn-ghost btn-sm shop-advance shop-clear"
            type="button"
            onClick={() => onRemove(ticket.id)}
          >
            MARK PICKED UP / CLEAR
          </button>
        )}
      </div>
    </article>
  )
}

export default function ShopTickets({
  tickets,
  technicianMode,
  onToggleTechnician,
  onAdvance,
  onRemove,
  onClearCompleted,
}) {
  return (
    <section className="section shop-section" id="shop" aria-labelledby="shop-title">
      <div className="section-head">
        <div>
          <p className="eyebrow">
            <span className="rule" aria-hidden="true" />
            03 / Shop floor
          </p>
          <h2 className="section-title" id="shop-title">Shop floor build bays</h2>
        </div>
        <div className="shop-head-side">
          <p className="section-desc">
            {technicianMode
              ? 'Technician bay board — advance each vehicle as its modifications are signed off.'
              : 'Track your submitted build from queue to pickup.'}
          </p>
          <button
            className={`shop-mode${technicianMode ? ' is-on' : ''}`}
            type="button"
            aria-pressed={technicianMode}
            onClick={onToggleTechnician}
          >
            <span className="shop-mode-led" aria-hidden="true" />
            {technicianMode ? 'Technician view: on' : 'Technician view: off'}
          </button>
        </div>
      </div>

      <div className="shop-board">
        {BAYS.map((bay) => {
          const bayTickets = tickets.filter((ticket) => ticket.status === bay.status)

          return (
            <div className={`shop-bay shop-bay--${bay.tone}`} key={bay.status} data-bay={bay.tone}>
              <div className="shop-bay-head">
                <h3 className="shop-bay-title">{bay.title}</h3>
                <div className="shop-bay-actions">
                  {technicianMode && bay.clearable && bayTickets.length > 0 && (
                    <button
                      className="btn btn-ghost btn-sm shop-advance shop-clear shop-clear--head"
                      type="button"
                      onClick={onClearCompleted}
                    >
                      CLEAR ALL
                    </button>
                  )}
                  <span className="shop-bay-count">{bayTickets.length}</span>
                </div>
              </div>

              <div className="shop-bay-list">
                {bayTickets.length === 0 ? (
                  <p className="shop-bay-empty">No vehicles in this bay</p>
                ) : (
                  bayTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      bay={bay}
                      technicianMode={technicianMode}
                      onAdvance={onAdvance}
                      onRemove={onRemove}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
