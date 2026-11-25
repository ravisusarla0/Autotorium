import React from "react";

// Configuration for the 3 shop floor Kanban columns and their button states
const COLUMNS = [
  {
    step: "1. Queued",
    badge: "PENDING",
    status: "PENDING",
    emptyText: "No builds waiting in the queue.",
    accentBorder: "border-blue-500/40",
    actionLabel: "Move to Bay →",
    actionClass: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25",
  },
  {
    step: "2. In the Bay",
    badge: "BUILDING",
    status: "IN_PROGRESS",
    emptyText: "Nothing on the lift right now.",
    accentBorder: "border-amber-500/40",
    actionLabel: "Mark Build Ready ✓",
    actionClass: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25",
  },
  {
    step: "3. Ready for Pickup",
    badge: "COMPLETED",
    status: "COMPLETED",
    emptyText: "No completed builds yet.",
    accentBorder: "border-emerald-500/40",
    actionLabel: null, // Final stage has no advance button
    actionClass: "",
  },
];

export default function TechnicianBoard({ tickets, onAdvanceTicket, isTechnician = true }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10 text-slate-100">
      {/* Page Header (adapts text based on Technician vs. Customer role) */}
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-2">
          {isTechnician ? "STEP 4 OF 4 — WORKSHOP WORKFLOW" : "LIVE ORDER STATUS"}
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {isTechnician ? "Shop tickets" : "Track your build"}
        </h1>
        <p className="text-slate-400 mt-1 text-sm md:text-base">
          {isTechnician
            ? "Every checked-out build becomes a work order. Advance it across the bay board as the crew works."
            : "Watch your submitted JDM build move from the queue onto the lift and into pickup."}
        </p>
      </div>

      {/* 3-Column Kanban Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {COLUMNS.map((col) => {
          // Filter tickets belonging to the current column's status
          const colTickets = tickets.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className="bg-[#111622] border border-slate-800 rounded-2xl p-5 min-h-[340px]"
            >
              {/* Column Title & Ticket Count Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-bold text-white text-base">{col.step}</h2>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                    {col.badge}
                  </span>
                </div>
                <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center">
                  {colTickets.length}
                </span>
              </div>

              {/* Render empty placeholder or list of work-order cards */}
              {colTickets.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-xl py-12 px-4 text-center text-sm text-slate-500">
                  {col.emptyText}
                </div>
              ) : (
                <div className="space-y-4">
                  {colTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`bg-[#0b0f17] border ${col.accentBorder} rounded-xl p-4 transition`}
                    >
                      {/* Ticket ID & Timestamp */}
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="font-bold tracking-wider uppercase">
                          TICKET #{ticket.id}
                        </span>
                        <span>{ticket.createdAt}</span>
                      </div>

                      {/* Customer Name, Vehicle & Custom Build Label */}
                      <h3 className="text-lg font-bold text-white leading-snug">
                        {ticket.customerName}
                      </h3>
                      <p className="text-sm text-slate-300">{ticket.vehicleName}</p>
                      <p className="text-xs italic text-slate-400 mb-3">
                        “{ticket.buildName}”
                      </p>

                      {/* Itemized Modifications Checklist */}
                      <ul className="space-y-1.5 border-t border-b border-slate-800/80 py-3 my-3 text-xs">
                        {ticket.parts.length === 0 ? (
                          <li className="text-slate-400 flex justify-between">
                            <span>• Factory OEM Spec</span>
                            <span>Included</span>
                          </li>
                        ) : (
                          ticket.parts.map((part, idx) => (
                            <li
                              key={idx}
                              className="flex items-center justify-between gap-2 text-slate-300"
                            >
                              <span className="truncate">• {part.name}</span>
                              <span className="text-slate-400 shrink-0">
                                {part.price > 0 ? `+$${part.price.toLocaleString()}` : "Included"}
                              </span>
                            </li>
                          ))
                        )}
                      </ul>

                      {/* Total Build Estimate */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-slate-400">Build estimate</span>
                        <span className="text-base font-extrabold text-white">
                          ${ticket.totalPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Show interactive bay button for Technicians, or read-only status badge for Customers */}
                      {isTechnician && col.actionLabel ? (
                        <button
                          onClick={() => onAdvanceTicket(ticket.id)}
                          className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition cursor-pointer ${col.actionClass}`}
                        >
                          {col.actionLabel}
                        </button>
                      ) : (
                        <div className="w-full py-2 px-3 rounded-full bg-emerald-950/70 border border-emerald-700/50 text-center text-xs font-semibold text-emerald-400">
                          {ticket.status === "COMPLETED"
                            ? "Completed ✓ Ready for pickup"
                            : ticket.status === "IN_PROGRESS"
                            ? "🔧 Currently on the lift"
                            : "⏳ Queued for bay"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
