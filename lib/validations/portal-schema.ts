import { z } from 'zod';

export const PortalConfigSchema = z.object({
  seatId: z.string().min(1),
  row: z.string().min(1),
  seatNumber: z.number().min(1),
  x: z.number().min(-10).max(10),
  y: z.number().min(-10).max(10),
  z: z.number().min(-10).max(10),
  fov: z.number().min(30).max(120).default(75),
  acousticSurroundGain: z.number().min(0).max(1.0).default(0.8),
  theaterModel: z.enum(['imax', 'standard', 'vip_lounge']).default('imax'),
});

export type PortalConfig = z.infer<typeof PortalConfigSchema>;

export const OrientationDataSchema = z.object({
  alpha: z.number().min(0).max(360),
  beta: z.number().min(-180).max(180),
  gamma: z.number().min(-90).max(90),
});

export type OrientationData = z.infer<typeof OrientationDataSchema>;
