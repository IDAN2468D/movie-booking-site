import { z } from "zod";

export const BubbleTokenSchema = z.object({
  id: z.string(),
  type: z.enum(["genre", "runtime", "rating", "mood", "tension"]),
  value: z.union([z.string(), z.number()]),
  label: z.string()
});

export const DiscoveryQuerySchema = z.object({
  bubbles: z.array(BubbleTokenSchema).default([]),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
});

export type BubbleToken = z.infer<typeof BubbleTokenSchema>;
export type DiscoveryQuery = z.infer<typeof DiscoveryQuerySchema>;
