import { z } from "zod";

export const CinematicResearchInputSchema = z.object({
  movieTitle: z.string().min(1, "Movie title is required"),
});

export const CinematicResearchOutputSchema = z.object({
  trivia: z.array(z.string()).default([]),
  culturalImpact: z.string().default("No data available"),
  behindTheScenes: z.string().default("No data available"),
});

export type CinematicResearchInput = z.infer<typeof CinematicResearchInputSchema>;
export type CinematicResearchOutput = z.infer<typeof CinematicResearchOutputSchema>;
