import { z } from "zod";

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

/**
 * Validates subtitles list using Zod schemas.
 * Returns Result Pattern.
 */
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
