import { z } from 'zod';

export const TrophyItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  rarity: z.string(),
  iconName: z.string(),
  unlockedAt: z.string().optional(),
  glowColor: z.string(),
});

export type TrophyItem = z.infer<typeof TrophyItemSchema>;

export const TrophyVaultStateSchema = z.object({
  totalUnlocked: z.number().min(0),
  totalTrophies: z.number().min(1),
  trophies: z.array(TrophyItemSchema),
});

export type TrophyVaultState = z.infer<typeof TrophyVaultStateSchema>;
