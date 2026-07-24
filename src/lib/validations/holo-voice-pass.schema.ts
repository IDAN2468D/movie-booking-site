import { z } from 'zod';

export const HoloVoicePassInputSchema = z.object({
  voiceTranscript: z.string().min(1),
  themeColor: z.string().min(1),
});

export const HoloPassResultSchema = z.object({
  passId: z.string(),
  title: z.string(),
  tierName: z.string(),
  hologramHue: z.number(),
  hapticPattern: z.array(z.number()),
  formattedCode: z.string(),
});

export type HoloVoicePassInput = z.infer<typeof HoloVoicePassInputSchema>;
export type HoloPassResult = z.infer<typeof HoloPassResultSchema>;
