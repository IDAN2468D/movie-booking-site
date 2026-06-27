import { z } from 'zod';

export const collectiblePurchaseSchema = z.object({
  collectibleId: z.string().min(1, 'Collectible ID is required'),
});

export type CollectiblePurchaseInput = z.infer<typeof collectiblePurchaseSchema>;
