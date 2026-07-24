import { z } from 'zod';

export const VoidEntitySchema = z.object({
  id: z.string(),
  username: z.string(),
  x: z.number(),
  y: z.number(),
  radius: z.number(),
  refractionColor: z.string(),
  isSelf: z.boolean().optional(),
});

export type VoidEntity = z.infer<typeof VoidEntitySchema>;
