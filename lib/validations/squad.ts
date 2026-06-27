import { z } from 'zod';

export const squadContributeSchema = z.object({
  squadId: z.string().min(1, 'Squad ID is required'),
  amount: z.number().int().positive('Contribution amount must be positive'),
});

export type SquadContributeInput = z.infer<typeof squadContributeSchema>;
