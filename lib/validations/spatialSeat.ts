import { z } from 'zod';

export const SpatialSeatSchema = z.object({
  seatId: z.string().min(1, 'Seat ID is required'),
  x: z.number().min(-50).max(50),
  y: z.number().min(-50).max(50),
  z: z.number().min(0).max(100),
  screenCurvature: z.number().min(0.1).max(2.0).default(0.8),
  panValue: z.number().min(-1.0).max(1.0).default(0.0),
});

export type SpatialSeatInput = z.input<typeof SpatialSeatSchema>;
export type SpatialSeatOutput = z.output<typeof SpatialSeatSchema>;

