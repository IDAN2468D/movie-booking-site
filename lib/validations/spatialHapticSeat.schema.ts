import { z } from "zod";

export const SeatPerspectiveInputSchema = z.object({
  seatId: z.string().min(1, "Seat ID is required"),
  row: z.string().optional(),
  x: z.number().min(-1).max(1),
  y: z.number().min(-1).max(1),
  z: z.number().min(-1).max(1),
});

export type SeatPerspectiveInput = z.infer<typeof SeatPerspectiveInputSchema>;

export const SeatPerspectiveOutputSchema = z.object({
  seatId: z.string(),
  fov: z.number(),
  viewingAngle: z.number(),
  panValue: z.number(),
  sweetSpotRating: z.string(),
  hapticIntensity: z.number(),
  frequencyCenter: z.number(),
  distanceToScreen: z.number(),
});

export type SeatPerspectiveOutput = z.infer<typeof SeatPerspectiveOutputSchema>;
