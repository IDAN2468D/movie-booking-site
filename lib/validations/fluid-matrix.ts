import { z } from "zod";

export const FluidMatrixSchema = z.object({
  cursorX: z.number().min(0).max(3840),
  cursorY: z.number().min(0).max(2160),
  viscosity: z.number().min(0.1).max(5.0),
  harmonicNote: z.string().min(1),
  particleCount: z.number().int().min(10).max(500),
});

export type FluidMatrixInput = z.infer<typeof FluidMatrixSchema>;
