// Shared shop-floor ticket hook.
//
// The Customer tracker and the Technician bay board must never keep separate
// ticket stores, so this module is a thin alias over the single
// `autotorium_tickets` store in useTickets.js. Import either name and both
// views stay in sync.
import useTickets, {
  TICKET_STATUS,
  LOCKED_TICKET_STATUSES,
  isLockedTicketStatus,
  findTicketForBuild,
  nextTicketNumber,
} from './useTickets'

export const useShopTickets = useTickets

export {
  TICKET_STATUS,
  LOCKED_TICKET_STATUSES,
  isLockedTicketStatus,
  findTicketForBuild,
  nextTicketNumber,
}

export default useTickets
