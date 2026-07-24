import { z } from 'zod';

export const VoiceOrderInputSchema = z.object({
  transcript: z.string().min(1),
  language: z.string().default('he-IL'),
});

export const VoiceOrderParsedOutputSchema = z.object({
  intentType: z.enum(['search_movie', 'select_seat', 'add_concession', 'checkout']),
  targetQuery: z.string(),
  confidence: z.number().min(0).max(1),
  actionResultText: z.string(),
  audioConfirmationHz: z.number(),
});

export type VoiceOrderInput = z.infer<typeof VoiceOrderInputSchema>;
export type VoiceOrderParsedOutput = z.infer<typeof VoiceOrderParsedOutputSchema>;
