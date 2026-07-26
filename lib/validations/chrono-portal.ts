import { z } from "zod";

export const ChronoPortalSchema = z.object({
  decade: z.enum(["1920s", "1970s", "1990s", "2090s"]),
  cutoffFrequency: z.number().min(20).max(20000),
  resonanceGain: z.number().min(0).max(24),
  subBassTriggered: z.boolean(),
});

export type ChronoPortalInput = z.infer<typeof ChronoPortalSchema>;
