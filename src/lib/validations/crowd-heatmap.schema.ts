import { z } from 'zod';

export const CrowdZoneSchema = z.object({
  zoneId: z.string().min(1),
  zoneName: z.string().min(1),
  densityScore: z.number().min(0).max(1),
  vibeTag: z.string(),
  acousticClarityDb: z.number(),
  seatCoords: z.array(z.object({ x: z.number(), y: z.number() })),
});

export const CrowdHeatmapQuerySchema = z.object({
  showtimeId: z.string().min(1),
  auditoriumId: z.string().min(1),
});

export type CrowdZone = z.infer<typeof CrowdZoneSchema>;
export type CrowdHeatmapQuery = z.infer<typeof CrowdHeatmapQuerySchema>;
