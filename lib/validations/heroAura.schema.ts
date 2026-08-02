import { z } from "zod";

export const HeroAuraInputSchema = z.object({
  movieId: z.number().or(z.string()),
  title: z.string().min(1, "Movie title is required"),
  voteAverage: z.number().min(0).max(10).optional(),
});

export type HeroAuraInput = z.infer<typeof HeroAuraInputSchema>;

export const HeroAuraOutputSchema = z.object({
  movieId: z.string(),
  title: z.string(),
  emotionalValence: z.number(), // 0 to 100
  acousticResonance: z.number(), // 0 to 100
  auraColor: z.string(),
  dominantGenre: z.string(),
  soundscapeTags: z.array(z.string()),
  resonanceRating: z.string(),
});

export type HeroAuraOutput = z.infer<typeof HeroAuraOutputSchema>;
