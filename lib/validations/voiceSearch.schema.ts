import { z } from "zod";

export const VoiceSearchInputSchema = z.object({
  transcript: z.string().min(1, "Transcript cannot be empty"),
  selectedMood: z.string().optional(),
});

export type VoiceSearchInput = z.infer<typeof VoiceSearchInputSchema>;

export const VoiceSearchOutputSchema = z.object({
  query: z.string(),
  intent: z.string(),
  detectedMood: z.string(),
  suggestedGenres: z.array(z.string()),
  matchedMovieIds: z.array(z.number()),
  explanation: z.string(),
});

export type VoiceSearchOutput = z.infer<typeof VoiceSearchOutputSchema>;
