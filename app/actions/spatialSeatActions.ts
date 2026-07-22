"use server";

import { SpatialSeatSchema, SpatialSeatInput } from "@/lib/validations/spatialSeat";

export async function getSeatPerspectiveAction(input: SpatialSeatInput) {
  try {
    const validated = SpatialSeatSchema.parse(input);
    const { seatId, x, y, z, screenCurvature } = validated;

    // Calculate dynamic 3D field of view and acoustic pan value natively
    const distanceToScreen = Math.max(10, 100 - z);
    const fov = Math.min(110, Math.max(45, Math.round(1200 / distanceToScreen)));
    const panValue = parseFloat((x / 50).toFixed(2));
    const viewingAngle = parseFloat((Math.atan2(x, distanceToScreen) * (180 / Math.PI)).toFixed(1));

    return {
      success: true,
      data: {
        seatId,
        coordinates: { x, y, z },
        fov,
        panValue,
        screenCurvature,
        viewingAngle,
        sweetSpotRating: Math.abs(x) < 15 && z > 30 && z < 70 ? 'IMAX Optimum' : 'Standard View',
      },
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, error: error.issues?.[0]?.message || error.message };
    }
    return { success: false, error: "שגיאה בחישוב נקודת המבט האקוסטית" };
  }
}
