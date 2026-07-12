import { z } from 'zod';

export const AudioConfigSchema = z.object({
  volume: z.number().min(0).max(1),
  rate: z.number().min(0.5).max(2.0),
  pitch: z.number().min(0.5).max(2.0),
  lang: z.string().default('he-IL'),
});

export const PlaybackTelemetrySchema = z.object({
  isPlaying: z.boolean(),
  muted: z.boolean(),
  audioNodeId: z.string().min(1),
});

export type AudioConfig = z.infer<typeof AudioConfigSchema>;
export type PlaybackTelemetry = z.infer<typeof PlaybackTelemetrySchema>;
