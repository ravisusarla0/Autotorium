import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'autotorium.tickets.v1'

export const TICKET_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
}

const NEXT_STATUS = {
  [TICKET_STATUS.PENDING]: TICKET_STATUS.IN_PROGRESS,
  [TICKET_STATUS.IN_PROGRESS]: TICKET_STATUS.COMPLETED,
}

function readStoredTickets() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
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

  const advanceTicket = useCallback((ticketId) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId && NEXT_STATUS[ticket.status]
          ? { ...ticket, status: NEXT_STATUS[ticket.status] }
          : ticket,
      ),
    )
  }, [])

  return { tickets, addTicket, advanceTicket }
}
