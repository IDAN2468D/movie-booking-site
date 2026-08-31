# Technical Specification: Director's Cut Audio Commentary Companion

## 1. Objective & Flow
AI-driven multimodal audio commentary companion providing behind-the-scenes insights, thematic trivia, and cinematic analysis synchronized with key scenes.

## 2. Zod Data Schema

```typescript
import { z } from "zod";

export const CommentaryTrackSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  title: z.string(),
  persona: z.enum(["director", "cinematographer", "critic", "easter_egg_hunter"]),
  segments: z.array(
    z.object({
      timestampSec: z.number().nonnegative(),
      headline: z.string(),
      commentaryText: z.string(),
      audioClipUrl: z.string().url().optional(),
      triviaTag: z.string().optional(),
    })
  ),
});

export type CommentaryTrack = z.infer<typeof CommentaryTrackSchema>;
```
