import { z } from 'zod';

export const smartLightingEventSchema = z.object({
  trailerId: z.string().min(1),
  timestamp: z.number().nonnegative(),
  rgbColor: z.tuple([z.number(), z.number(), z.number()]),
  brightness: z.number().min(0).max(100),
  hapticPattern: z.array(z.number()).optional(),
});

export const crowdHeatmapSchema = z.object({
  showtimeId: z.string().min(1),
  seatReactions: z.array(z.object({
    seatId: z.string(),
    emotion: z.enum(['excited', 'scared', 'amazed', 'amused']),
    intensity: z.number().min(0).max(1),
    timestamp: z.number(),
  })),
});

export type SmartLightingEvent = z.infer<typeof smartLightingEventSchema>;
export type CrowdHeatmapPayload = z.infer<typeof crowdHeatmapSchema>;
