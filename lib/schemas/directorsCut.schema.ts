import { z } from "zod";

export const CommentaryPersonaEnum = z.enum([
  "director",
  "cinematographer",
  "critic",
  "easter_egg_hunter",
]);

export const CommentarySegmentSchema = z.object({
  id: z.string(),
  timestampSec: z.number().nonnegative(),
  sceneName: z.string(),
  headline: z.string(),
  commentaryText: z.string(),
  triviaTag: z.string().optional(),
  acousticFocus: z.enum(["spatial", "sub_bass", "dialogue", "orchestral"]).default("spatial"),
});

export const CommentaryTrackSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  movieTitle: z.string(),
  persona: CommentaryPersonaEnum,
  personaTitleHebrew: z.string(),
  narratorName: z.string(),
  description: z.string(),
  segments: z.array(CommentarySegmentSchema),
});

export const FetchCommentaryQuerySchema = z.object({
  movieId: z.string().min(1),
  persona: CommentaryPersonaEnum.default("director"),
});

export type CommentaryPersona = z.infer<typeof CommentaryPersonaEnum>;
export type CommentarySegment = z.infer<typeof CommentarySegmentSchema>;
export type CommentaryTrack = z.infer<typeof CommentaryTrackSchema>;
