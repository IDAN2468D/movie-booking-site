# Technical Specification: CineDNA Graph Explorer

## 1. Objective & Flow
Provide an interactive multidimensional relationship graph connecting movies by stylistic fingerprint (director, cinematographer, composer, color palette) and thematic motifs (narrative pacing, mood resonance).

## 2. Data Schema & Validation (Zod)

```typescript
import { z } from "zod";

export const CineDnaNodeTypeEnum = z.enum([
  "movie",
  "director",
  "composer",
  "cinematographer",
  "theme",
  "color_palette"
]);

export const CineDnaRelationshipEnum = z.enum([
  "directed_by",
  "scored_by",
  "shot_by",
  "shares_motif",
  "mood_resonance"
]);

export const CineDnaNodeSchema = z.object({
  id: z.string(),
  type: CineDnaNodeTypeEnum,
  label: z.string().min(1),
  metadata: z.object({
    imageUrl: z.string().url().optional(),
    intensity: z.number().min(0).max(1).default(0.5),
    colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    year: z.number().int().optional(),
  }),
});

export const CineDnaEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  relationship: CineDnaRelationshipEnum,
  weight: z.number().min(0).max(1),
});

export const CineDnaQuerySchema = z.object({
  movieId: z.string().min(1),
  depth: z.number().int().min(1).max(3).default(2),
  filters: z.array(CineDnaNodeTypeEnum).optional(),
});

export type CineDnaNode = z.infer<typeof CineDnaNodeSchema>;
export type CineDnaEdge = z.infer<typeof CineDnaEdgeSchema>;
export type CineDnaGraphData = {
  coreMovieId: string;
  nodes: CineDnaNode[];
  edges: CineDnaEdge[];
};
```

## 3. Server Action Signature

```typescript
"use server";

import { CineDnaQuerySchema, CineDnaGraphData } from "./cineDna.schema";

export async function fetchCineDnaGraph(
  input: unknown
): Promise<{ success: boolean; data?: CineDnaGraphData; error?: string }> {
  const parsed = CineDnaQuerySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid query parameters" };
  }
  // Data resolution via TMDB API + Gemini embeddings
  return {
    success: true,
    data: {
      coreMovieId: parsed.data.movieId,
      nodes: [],
      edges: [],
    },
  };
}
```

## 4. UI Component Architecture

- `CineDnaCanvas.tsx`: SVG/Canvas rendering with force-directed layout and pinch-to-zoom.
- `DnaNodeCard.tsx`: Glassmorphism card displaying node thumbnail, title, and match confidence.
- `DnaFilterControls.tsx`: Top pill filter bar toggling node categories (directors, themes, scores).
