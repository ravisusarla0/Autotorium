import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'autotorium.tickets.v1'

export const TICKET_STATUS = {
  QUEUED: 'QUEUED',
  IN_THE_BAY: 'IN_THE_BAY',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
}

// Tickets stored before the bay workflow used PENDING / IN_PROGRESS / COMPLETED.
const LEGACY_STATUS = {
  PENDING: TICKET_STATUS.QUEUED,
  IN_PROGRESS: TICKET_STATUS.IN_THE_BAY,
  COMPLETED: TICKET_STATUS.READY_FOR_PICKUP,
}

// Once a ticket leaves the queue the configurator is locked for that build.
export const LOCKED_TICKET_STATUSES = [
  TICKET_STATUS.IN_THE_BAY,
  TICKET_STATUS.READY_FOR_PICKUP,
]

export const isLockedTicketStatus = (status) => LOCKED_TICKET_STATUSES.includes(status)

const NEXT_STATUS = {
  [TICKET_STATUS.QUEUED]: TICKET_STATUS.IN_THE_BAY,
  [TICKET_STATUS.IN_THE_BAY]: TICKET_STATUS.READY_FOR_PICKUP,
}

function normalizeTicket(ticket) {
  if (!ticket || typeof ticket !== 'object') return ticket
  const status = LEGACY_STATUS[ticket.status] ?? ticket.status
  return status === ticket.status ? ticket : { ...ticket, status }
}

function readStoredTickets() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.map(normalizeTicket) : []
  } catch {
    return []
  }
}

// Ticket numbers start at 1001, mirroring TicketDAO#nextTicketId.
export function nextTicketNumber(tickets) {
  return (
    tickets.reduce((highest, ticket) => Math.max(highest, Number(ticket.id) || 0), 1000) + 1
  )
}

// The most recently submitted ticket for a saved build, if any.
export function findTicketForBuild(tickets, buildId) {
  if (!buildId) return null
  for (let index = tickets.length - 1; index >= 0; index -= 1) {
    if (tickets[index].buildId === buildId) return tickets[index]
  }
  return null
}

export default function useTickets() {
  const [tickets, setTickets] = useState(readStoredTickets)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
    } catch {
      // Storage can be unavailable (private mode / quotas). The session still works.
    }
  }, [tickets])

  const addTicket = useCallback((ticket) => {
    setTickets((prev) => [...prev, ticket])
  }, [])

  const updateTicket = useCallback((ticketId, patch) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, ...patch } : ticket)),
    )
  }, [])

  const advanceTicket = useCallback((ticketId) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId && NEXT_STATUS[ticket.status]
          ? { ...ticket, status: NEXT_STATUS[ticket.status] }
          : ticket,
      ),
    )
  }, [])

  const removeTicket = useCallback((ticketId) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId))
  }, [])

  const clearCompletedTickets = useCallback(() => {
    setTickets((prev) =>
      prev.filter((ticket) => ticket.status !== TICKET_STATUS.READY_FOR_PICKUP),
    )
  }, [])

  return {
    tickets,
    addTicket,
    updateTicket,
    advanceTicket,
    removeTicket,
    clearCompletedTickets,
  }
}
