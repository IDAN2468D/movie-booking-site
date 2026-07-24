import { z } from 'zod';

export const SpatialCommentaryInputSchema = z.object({
  movieId: z.string().min(1),
  timestampSec: z.number().min(0),
  spatialPosition: z.enum(['LEFT', 'CENTER', 'RIGHT']),
});

export const CommentaryItemSchema = z.object({
  id: z.string(),
  timestampSec: z.number(),
  speakerName: z.string(),
  quote: z.string(),
  panningValue: z.number(),
  audioBoostDb: z.number(),
});

export type SpatialCommentaryInput = z.infer<typeof SpatialCommentaryInputSchema>;
export type CommentaryItem = z.infer<typeof CommentaryItemSchema>;
