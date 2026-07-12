import { z } from 'zod';

export const HapticVectorSchema = z.object({
  x: z.number(),
  y: z.number(),
  distance: z.number(),
  tension: z.number().min(0).max(1),
});

export const ProximityPayloadSchema = z.object({
  isIntersecting: z.boolean(),
  activeBubbleId: z.string().nullable(),
  vector: HapticVectorSchema.nullable(),
});

export type HapticVector = z.infer<typeof HapticVectorSchema>;
export type ProximityPayload = z.infer<typeof ProximityPayloadSchema>;
