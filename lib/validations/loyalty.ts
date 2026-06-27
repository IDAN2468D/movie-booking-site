import { z } from "zod";

export const quantumLoyaltySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  tier: z.enum(["observer", "quantum", "singularity", "whale"]),
  points: z.number().nonnegative(),
  multiplier: z.number().min(1).max(10),
  lastActivity: z.date(),
});

export type QuantumLoyaltyInput = z.infer<typeof quantumLoyaltySchema>;
