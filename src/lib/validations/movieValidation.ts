import { z } from 'zod';

export const AtmosphericProfileSchema = z.enum(['rain', 'fire', 'snow', 'cyber', 'none']);
export type AtmosphericProfile = z.infer<typeof AtmosphericProfileSchema>;

export const MovieAcousticMetadataSchema = z.object({
  profile: AtmosphericProfileSchema.default('none'),
  audioUrl: z.string().optional(),
});
