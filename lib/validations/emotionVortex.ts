import { z } from "zod";

export const ValidEmotions = [
  "Mind-Blowing",
  "Tearjerker",
  "Visceral",
  "Heartwarming",
  "Terrifying"
] as const;

export const EmotionOrbSchema = z.object({
  movieId: z.string().min(1, "Movie ID is required"),
  emotion: z.enum(ValidEmotions, { message: "Invalid emotion type" }),
});

export type EmotionOrbInput = z.infer<typeof EmotionOrbSchema>;
