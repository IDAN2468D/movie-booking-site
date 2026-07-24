import { z } from 'zod';

export const PersonaPromptSchema = z.object({
  userPrompt: z.string().min(1),
  moodTag: z.string().optional(),
});

export const PersonaResponseSchema = z.object({
  personaName: z.string(),
  dialogueText: z.string(),
  recommendedMovieTitle: z.string(),
  moodColorHex: z.string(),
  audioPitchHz: z.number(),
});

export type PersonaPrompt = z.infer<typeof PersonaPromptSchema>;
export type PersonaResponse = z.infer<typeof PersonaResponseSchema>;
