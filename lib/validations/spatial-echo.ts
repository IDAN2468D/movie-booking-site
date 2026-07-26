import { z } from "zod";

export const SpatialEchoSchema = z.object({
  posX: z.number().min(-100).max(100),
  posY: z.number().min(-100).max(100),
  posZ: z.number().min(-100).max(100),
  vibeMessage: z.string().max(140),
  echoFrequency: z.number().min(100).max(8000),
});

export type SpatialEchoInput = z.infer<typeof SpatialEchoSchema>;
