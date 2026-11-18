package com.autotorium.model;

import java.util.List;

/** A saved configuration waiting in the garage (IN_GARAGE) or already ticketed (CHECKED_OUT). */
public record GarageBuild(
        long buildId,
        String buildName,
        Vehicle vehicle,
        List<Part> parts,
        double totalPrice,
        String status,
        String createdAt) {
}
