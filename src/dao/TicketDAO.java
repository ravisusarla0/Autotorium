package dao;

import model.TIcketSystem;
import java.util.ArrayList;
import java.util.List;


public class TicketDOA {
  private final List <TIcketSystem> tickets = new ArrayList <> () ;
  private int nextTicketId = 1001;
  
  public int getNextTIckketId() {
    return nextTicket++;
  }

  public void saveTicket (TicketSystem ticket) {
    tickets.add(ticket);
  }

  public List<BuildTicket> getAllTickets() {
        return tickets;
    }
}

