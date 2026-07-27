import { z } from "zod";

export const KineticShaderSchema = z.object({
  distortion: z.number().min(0).max(1),
  chromaticAberration: z.number().min(0).max(1),
  refractionIndex: z.number().min(1).max(2),
  activeMovieId: z.string().min(1),
});

export type KineticShaderInput = z.infer<typeof KineticShaderSchema>;

export const SceneGraphSchema = z.object({
  movieId: z.string().min(1),
  selectedNodeId: z.string().optional(),
  depth: z.number().min(1).max(5).default(2),
});

export type SceneGraphInput = z.infer<typeof SceneGraphSchema>;

export const SeatPovSchema = z.object({
  seatId: z.string().min(1),
  row: z.string().min(1),
  fovAngle: z.number().min(30).max(120),
  tiltAngle: z.number().min(-30).max(30),
  ambientLighting: z.boolean().default(true),
});

export type SeatPovInput = z.infer<typeof SeatPovSchema>;

export const TradingCardSchema = z.object({
  cardIds: z.array(z.string()).min(1).max(3),
  action: z.enum(["inspect", "fuse", "stake"]),
  targetRarity: z.enum(["common", "rare", "legendary", "quantum"]).optional(),
});

export type TradingCardInput = z.infer<typeof TradingCardSchema>;

export const ThemeMorpherSchema = z.object({
  themeId: z.enum(["cyberpunk", "noir", "scifi", "retro", "quantum"]),
  glassBlur: z.number().min(0).max(50),
  accentGlow: z.string(),
  activeGenre: z.string().optional(),
});

export type ThemeMorpherInput = z.infer<typeof ThemeMorpherSchema>;
