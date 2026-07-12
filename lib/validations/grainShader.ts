import { z } from 'zod';

export const GrainShaderConfigSchema = z.object({
  genre: z.string().min(1),
  grainDensity: z.number().min(0).max(1),
  particleSize: z.number().min(0.5).max(4),
  speedCoefficient: z.number().min(0).max(2),
});

export const ShaderFrameResultSchema = z.object({
  fpsLocked: z.boolean(),
  frameTime: z.number(),
  bufferAcknowledge: z.boolean(),
});

export type GrainShaderConfig = z.infer<typeof GrainShaderConfigSchema>;
export type ShaderFrameResult = z.infer<typeof ShaderFrameResultSchema>;
