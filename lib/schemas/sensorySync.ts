import { z } from "zod";

export const sensoryProfileSchema = z.object({
  seatId: z.string().min(1, "Seat ID is required"),
  movieId: z.string().min(1, "Movie ID is required"),
  hapticIntensity: z.number().min(0).max(100).default(75),
  subBassFrequency: z.number().min(20).max(120).default(45),
  ambientLightingColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#8B5CF6"),
  pulsePattern: z.enum(["soft", "rhythmic", "intense", "sub-bass-heavy"]).default("rhythmic"),
  isActive: z.boolean().default(true),
});

export type SensoryProfileInput = z.infer<typeof sensoryProfileSchema>;
