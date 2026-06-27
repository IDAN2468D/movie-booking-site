import { z } from "zod";

export const temporalVaultSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  movieId: z.string().min(1, "Movie ID is required for 8K upscaling"),
  pointsCost: z.number().positive("Must cost positive points"),
  scheduledFor: z.date(),
  status: z.enum(["locked", "decrypting", "ready", "viewed"]).default("locked"),
  drmToken: z.string().optional(),
});

export type TemporalVaultInput = z.infer<typeof temporalVaultSchema>;
