import { z } from 'zod';

export const shardTradeSchema = z.object({
  shardId: z.string().min(1),
  sellerId: z.string().min(1),
  buyerId: z.string().min(1),
  pricePoints: z.number().int().positive(),
  hmacSignature: z.string().min(1),
});

export const collectiblePurchaseSchema = z.object({
  collectibleId: z.string().min(1),
});

export const vipPassSchema = z.object({
  userId: z.string().min(1),
  rankTier: z.enum(['silver', 'gold', 'platinum', 'quantum_vip']),
  pointsBalance: z.number().nonnegative(),
});

export type ShardTradePayload = z.infer<typeof shardTradeSchema>;
export type CollectiblePurchasePayload = z.infer<typeof collectiblePurchaseSchema>;
export type VIPPassPayload = z.infer<typeof vipPassSchema>;
