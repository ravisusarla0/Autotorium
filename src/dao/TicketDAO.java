package dao;

import model.BuildTicket;
import java.util.ArrayList;
import java.util.List;

public class TicketDAO {
    private final List<BuildTicket> tickets = new ArrayList<>();
    private int nextTicketId = 1001;

    public int getNextTicketId() {
        return nextTicketId++;
    }

    public void saveTicket(BuildTicket ticket) {
        tickets.add(ticket);
    }

    public List<BuildTicket> getAllTickets() {
        return tickets;
    }
}
