package com.autotorium.model;

/** Shop work order created when a garage build is checked out. */
public record BuildTicket(
        long ticketId,
        GarageBuild build,
        String customerName,
        String status,
        String createdAt) {
}
