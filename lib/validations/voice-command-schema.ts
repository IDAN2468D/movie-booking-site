import { z } from 'zod';

export const VoiceCommandInputSchema = z.object({
  transcript: z.string().min(1, 'Transcript cannot be empty'),
  locale: z.string().default('he-IL'),
});

export type VoiceCommandInput = z.infer<typeof VoiceCommandInputSchema>;

export const VoiceCommandActionSchema = z.object({
  action: z.enum(['navigate', 'search', 'book', 'soundtrack', 'unknown']),
  targetUrl: z.string().optional(),
  query: z.string().optional(),
  replyHebrew: z.string(),
});

export type VoiceCommandAction = z.infer<typeof VoiceCommandActionSchema>;
