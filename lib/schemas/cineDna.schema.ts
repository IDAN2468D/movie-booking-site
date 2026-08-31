import { z } from "zod";

export const CineDnaNodeTypeEnum = z.enum([
  "movie",
  "director",
  "composer",
  "cinematographer",
  "theme",
  "color_palette",
]);

export const CineDnaRelationshipEnum = z.enum([
  "directed_by",
  "scored_by",
  "shot_by",
  "shares_motif",
  "mood_resonance",
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
    description: z.string().optional(),
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

export type CineDnaNodeType = z.infer<typeof CineDnaNodeTypeEnum>;
export type CineDnaRelationship = z.infer<typeof CineDnaRelationshipEnum>;
export type CineDnaNode = z.infer<typeof CineDnaNodeSchema>;
export type CineDnaEdge = z.infer<typeof CineDnaEdgeSchema>;
export type CineDnaQuery = z.infer<typeof CineDnaQuerySchema>;

export type CineDnaGraphData = {
  coreMovieId: string;
  coreMovieTitle: string;
  nodes: CineDnaNode[];
  edges: CineDnaEdge[];
};
