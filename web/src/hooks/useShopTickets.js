import { useState, useEffect } from "react";

// Key used to persist shop tickets across page reloads in browser localStorage
const STORAGE_KEY = "autotorium_shop_tickets_v1";

// Initial sample tickets so the shop floor board isn't empty on first load
const SEED_TICKETS = [
  {
    id: 1001,
    customerName: "Walk-In Customer",
    vehicleName: "Toyota Supra MK4",
    buildName: "Toyota Supra MK4 Custom",
    parts: [
      { name: "Spoon Sports Twin-Block Calipers", price: 2400 },
      { name: "Tomei Titanium Exhaust", price: 1200 },
      { name: "18-inch Volk Racing TE37", price: 3200 },
    ],
    totalPrice: 84800,
    status: "COMPLETED",
    createdAt: "Nov 18 · 05:06",
  },
  {
    id: 1002,
    customerName: "Johnny",
    vehicleName: "Honda NSX NA1",
    buildName: "Honda NSX NA1 Track Spec",
    parts: [
      { name: "Spoon Sports Twin-Block Calipers", price: 2400 },
      { name: "Type-R Crimson Red Alcantara", price: 2200 },
    ],
    totalPrice: 99600,
    status: "PENDING",
    createdAt: "Nov 18 · 05:43",
  },
];

export function useShopTickets() {
  // Load existing tickets from localStorage, or fall back to SEED_TICKETS
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : SEED_TICKETS;
    } catch {
      return SEED_TICKETS;
    }
  });

  // Automatically sync any ticket updates back to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (err) {
      console.error("Failed to save tickets:", err);
    }
  }, [tickets]);

  // Create a new PENDING work order when a customer checks out a build
  const submitOrder = ({ customerName, vehicleName, buildName, parts, totalPrice }) => {
    const nextId = tickets.length > 0 ? Math.max(...tickets.map((t) => t.id)) + 1 : 1001;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString([], { month: "short", day: "numeric" });

    const newTicket = {
      id: nextId,
      customerName: customerName?.trim() || "Walk-In Customer",
      vehicleName,
      buildName: buildName?.trim() || `${vehicleName} Custom`,
      parts: parts || [],
      totalPrice: totalPrice || 0,
      status: "PENDING",
      createdAt: `${dateStr} · ${timeStr}`,
    };

    setTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  // Move a ticket forward through the shop bays: PENDING -> IN_PROGRESS -> COMPLETED
  const advanceTicket = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        if (t.status === "PENDING") return { ...t, status: "IN_PROGRESS" };
        if (t.status === "IN_PROGRESS") return { ...t, status: "COMPLETED" };
        return t;
      })
    );
  };

  // Delete a ticket by ID
  const removeTicket = (ticketId) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
  };

  return { tickets, submitOrder, advanceTicket, removeTicket };
}
