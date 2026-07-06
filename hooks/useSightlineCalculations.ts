import { useMemo } from 'react';
import { z } from 'zod';

// Zod schema for structural coordinate data validation
export const SightlineDataSchema = z.object({
  row: z.string().min(1).max(1),
  col: z.number().int().min(1).max(6),
  perspectiveAngle: z.number()
});

export type SightlineData = z.infer<typeof SightlineDataSchema>;

export interface SightlineResult {
  success: boolean;
  data?: {
    row: string;
    col: number;
    perspectiveAngle: number;
    pitchAngle: number;
    distance: number;
    visibilityScore: number;
  };
  error?: string;
}

/**
 * Calculates the cinematic perspective distortion metrics based on seat location.
 * @param seatId String seat identifier, e.g., "s-15"
 */
export function calculateSightline(seatId: string | null): SightlineResult {
  if (!seatId) {
    return { success: false, error: 'No seat selected' };
  }

  try {
    const seatIndex = parseInt(seatId.split('-')[1], 10);
    if (isNaN(seatIndex) || seatIndex < 0 || seatIndex >= 48) {
      return { success: false, error: `Invalid seat ID format: ${seatId}` };
    }

    // Row calculation: 8 rows (A to H), 6 columns per row
    const rowIndex = Math.floor(seatIndex / 6);
    const row = String.fromCharCode(65 + rowIndex); // A, B, C, D, E, F, G, H
    
    // Column calculation: 1 to 6
    const col = (seatIndex % 6) + 1;

    // Mathematical Viewport Perspective Rules:
    // Y represents depth distance from screen plane (closer row = smaller Y)
    const Y = 3.0 + rowIndex * 1.5;
    
    // dX represents horizontal offset from center of screen (center is 3.5)
    const dX = col - 3.5;

    // Perspective angle: theta = arctan(dX / Y) in degrees
    const perspectiveAngle = Math.atan(dX / Y) * (180 / Math.PI);

    // Pitch angle: looking up to the screen (closer rows look up more)
    // Row 0 (A) is closest, looking up at ~22 degrees. Row 7 (H) looks up at ~5 degrees.
    const pitchAngle = Math.max(5, 25 - rowIndex * 2.5);

    // Euclidean distance to screen center
    const distance = Math.sqrt(dX * dX + Y * Y);

    // Visibility score based on distance and extreme angles
    const angleRatio = Math.abs(perspectiveAngle) / 45; // normalise to 45 deg max
    const visibilityScore = Math.round(Math.max(50, 100 - (angleRatio * 20) - (rowIndex * 3)));

    // Strictly validate structural coordinate data
    const validated = SightlineDataSchema.parse({
      row,
      col,
      perspectiveAngle
    });

    return {
      success: true,
      data: {
        row: validated.row,
        col: validated.col,
        perspectiveAngle: validated.perspectiveAngle,
        pitchAngle,
        distance,
        visibilityScore
      }
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err)
    };
  }
}

/**
 * React hook wrapping the sightline calculations with useMemo.
 */
export function useSightlineCalculations(seatId: string | null): SightlineResult {
  return useMemo(() => calculateSightline(seatId), [seatId]);
}
