import { z } from 'zod';

export const SightlineMatrixSchema = z.object({
  seatId: z.string().min(1),
  rowOffset: z.number().min(1).max(50),
  colOffset: z.number().min(1).max(50),
  pitchAngle: z.number().min(-45).max(45),
  yawAngle: z.number().min(-45).max(45),
});

export const ViewportConfigSchema = z.object({
  focalLength: z.number(),
  blurIntensity: z.number(),
  chromaticScale: z.number(),
});

export type SightlineMatrix = z.infer<typeof SightlineMatrixSchema>;
export type ViewportConfig = z.infer<typeof ViewportConfigSchema>;
