package com.autotorium.model;

/** Maps a part onto a chassis it is known to fit. */
public record VehicleCompatibility(long vehicleId, long partId) {
}
