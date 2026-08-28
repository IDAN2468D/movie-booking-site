import { z } from 'zod';

export const SpeakerColorMap: Record<string, string> = {
  'Speaker 1': 'from-emerald-500 to-teal-400 text-emerald-300 border-emerald-500/30',
  'Speaker 2': 'from-purple-500 to-indigo-400 text-purple-300 border-purple-500/30',
  'Speaker 3': 'from-amber-500 to-orange-400 text-amber-300 border-amber-500/30',
  'Speaker 4': 'from-cyan-500 to-blue-400 text-cyan-300 border-cyan-500/30',
  'Sound Effect': 'from-rose-500 to-pink-400 text-rose-300 border-rose-500/30',
  'Default': 'from-slate-500 to-zinc-400 text-slate-300 border-slate-500/30',
};

export const SubtitleCueSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  startTimeMs: z.number().nonnegative(),
  endTimeMs: z.number().nonnegative(),
  speaker: z.string().default('Speaker 1'),
  speakerColor: z.string().optional(),
  originalText: z.string().min(1),
  translatedText: z.string().min(1),
  confidence: z.number().min(0).max(1).default(0.95),
  isMusicOrEffect: z.boolean().default(false),
});

export const TranscribeRequestSchema = z.object({
  audioBase64: z.string().min(1, 'Audio data is required'),
  mimeType: z.string().default('audio/webm'),
  movieId: z.string().optional(),
  sceneTimestampMs: z.number().default(0),
  targetLanguage: z.string().default('he'),
  contextHint: z.string().optional(),
});

export const TranscribeResponseSchema = z.object({
  success: z.boolean(),
  cues: z.array(SubtitleCueSchema),
  detectedLanguage: z.string().default('en'),
  summary: z.string().optional(),
  timestamp: z.number(),
  error: z.string().optional(),
});

export type SubtitleCue = z.infer<typeof SubtitleCueSchema>;
export type TranscribeRequest = z.infer<typeof TranscribeRequestSchema>;
export type TranscribeResponse = z.infer<typeof TranscribeResponseSchema>;
