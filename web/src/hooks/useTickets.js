import { useCallback, useEffect, useState } from 'react'

// Single shop-floor ticket store shared by the Customer tracker and the
// Technician bay board. Both views read and write this one key, so a change in
// either view is visible in the other immediately.
const STORAGE_KEY = 'autotorium_tickets'

// Tickets written by earlier builds of the app are migrated on first read.
const LEGACY_STORAGE_KEY = 'autotorium.tickets.v1'

export const TICKET_STATUS = {
  PENDING: 'PENDING', // 1. Queued
  IN_PROGRESS: 'IN_PROGRESS', // 2. In the Bay
  COMPLETED: 'COMPLETED', // 3. Ready for Pickup
}

// Once a ticket leaves the queue the customer can no longer modify that build.
export const LOCKED_TICKET_STATUSES = [
  TICKET_STATUS.IN_PROGRESS,
  TICKET_STATUS.COMPLETED,
]

export const isLockedTicketStatus = (status) => LOCKED_TICKET_STATUSES.includes(status)

const NEXT_STATUS = {
  [TICKET_STATUS.PENDING]: TICKET_STATUS.IN_PROGRESS,
  [TICKET_STATUS.IN_PROGRESS]: TICKET_STATUS.COMPLETED,
}

function readStoredTickets() {
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
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

// The most recently submitted ticket for a build, if any.
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

  // Patch an existing ticket in place (used by the live queued-ticket sync).
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
    setTickets((prev) => prev.filter((ticket) => ticket.status !== TICKET_STATUS.COMPLETED))
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
