import { z } from 'zod';

export const SubtitleSegmentSchema = z.object({
  id: z.string().min(1),
  startTime: z.number().nonnegative(),
  endTime: z.number().positive(),
  text: z.string().min(1),
});

export const AudioTelemetrySchema = z.object({
  amplitude: z.number().min(0).max(255),
  frequencyBucket: z.array(z.number()),
  backdropGlowColor: z.string(),
});

export type SubtitleSegment = z.infer<typeof SubtitleSegmentSchema>;
export type AudioTelemetry = z.infer<typeof AudioTelemetrySchema>;

// Legacy definitions to prevent breaking SpecularSubtitles.tsx
export const SubtitleItemSchema = z.object({
  time: z.number().min(0, "Time must be a non-negative number"),
  text: z.string().min(1, "Subtitle text cannot be empty"),
});

export const SubtitleArraySchema = z.array(SubtitleItemSchema);

export type SubtitleItem = z.infer<typeof SubtitleItemSchema>;

export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function validateSubtitles(data: unknown): Result<SubtitleItem[]> {
  const result = SubtitleArraySchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", "),
    };
  }
  return {
    success: true,
    data: result.data,
  };
}
