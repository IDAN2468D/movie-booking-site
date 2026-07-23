import { z } from 'zod';

export const SubtitleTranslationInputSchema = z.object({
  text: z.string().min(1, 'Subtitle text required'),
  targetLang: z.enum(['he', 'en', 'es', 'ja', 'fr']).default('he'),
  pitchShift: z.number().min(-12).max(12).default(0),
});

export type SubtitleTranslationInput = z.infer<typeof SubtitleTranslationInputSchema>;

export const SubtitleTranslationResultSchema = z.object({
  originalText: z.string(),
  translatedText: z.string(),
  lang: z.string(),
  pitchShiftSemitones: z.number(),
  audioFreqBoostHz: z.number(),
});

export type SubtitleTranslationResult = z.infer<typeof SubtitleTranslationResultSchema>;
