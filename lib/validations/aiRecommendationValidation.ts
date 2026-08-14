import { z } from "zod";

export const AIMoodRecommendationSchema = z.object({
  mood: z.string().min(1, "נא לבחור מצב רוח").max(100),
  customPrompt: z.string().max(300).optional(),
  preferredGenres: z.array(z.string()).optional().default([]),
  limit: z.number().int().min(1).max(12).optional().default(6),
});

export type AIMoodRecommendationInput = z.input<typeof AIMoodRecommendationSchema>;
export type AIMoodRecommendationParsed = z.infer<typeof AIMoodRecommendationSchema>;
