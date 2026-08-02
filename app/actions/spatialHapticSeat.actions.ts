"use server";

import {
  SeatPerspectiveInputSchema,
  SeatPerspectiveOutput,
} from "@/lib/validations/spatialHapticSeat.schema";

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function calculateSpatialHapticPerspectiveAction(
  rawInput: unknown
): Promise<ActionResult<SeatPerspectiveOutput>> {
  try {
    const validated = SeatPerspectiveInputSchema.parse(rawInput);
    const { seatId, x, y, z } = validated;

    // Calculate 3D Raycasting FOV (screen viewing angle)
    const dist = Math.sqrt(x * x + y * y + (z + 1.5) * (z + 1.5));
    const distanceToScreen = Math.round(dist * 10) / 10;
    const fov = Math.min(105, Math.max(45, Math.round(90 - distanceToScreen * 12)));
    const viewingAngle = Math.round(Math.abs(x) * 42);

    // Acoustic spatial balance (-1 left, 0 center, 1 right)
    const panValue = Math.round(x * 100) / 100;

    // Evaluate Sweet-Spot Rating
    let sweetSpotRating = "Standard Seat";
    if (Math.abs(x) < 0.35 && z > -0.2 && z < 0.5) {
      sweetSpotRating = "VIP Acoustic Sweet-Spot 🌟";
    } else if (Math.abs(x) < 0.6) {
      sweetSpotRating = "Prime Cinema Zone ✨";
    }

    // Audio-Haptic parameters
    const hapticIntensity = Math.min(1, Math.max(0.2, 1 - Math.abs(x) * 0.4));
    const frequencyCenter = Math.round(40 + (1 - Math.abs(z)) * 20);

    return {
      success: true,
      data: {
        seatId,
        fov,
        viewingAngle,
        panValue,
        sweetSpotRating,
        hapticIntensity,
        frequencyCenter,
        distanceToScreen,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to calculate spatial haptic perspective",
    };
  }
}
