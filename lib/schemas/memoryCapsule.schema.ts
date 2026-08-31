import { z } from "zod";

export const ShardRarityEnum = z.enum([
  "COMMON",
  "RARE",
  "EPIC",
  "MYTHIC",
]);

export const MemoryShardSchema = z.object({
  shardId: z.string(),
  userId: z.string(),
  movieId: z.string(),
  movieTitle: z.string(),
  screeningDate: z.string(),
  seatLabel: z.string(),
  hallName: z.string(),
  rarity: ShardRarityEnum,
  visualArtUrl: z.string().url(),
  quoteText: z.string(),
  quoteAuthor: z.string(),
  acousticEchoFrequency: z.number().default(432),
  editionNumber: z.number().int().positive(),
  totalMinted: z.number().int().positive(),
  attributes: z.record(z.string(), z.union([z.string(), z.number()])),
  isMinted: z.boolean().default(true),
  marketValueIls: z.number().nonnegative(),
});

export const MintShardInputSchema = z.object({
  movieId: z.string().min(1),
  movieTitle: z.string().min(1),
  seatLabel: z.string().min(1),
  hallName: z.string().default("אולם VIP 1"),
  userId: z.string().optional(),
});

export type ShardRarity = z.infer<typeof ShardRarityEnum>;
export type MemoryShard = z.infer<typeof MemoryShardSchema>;
export type MintShardInput = z.infer<typeof MintShardInputSchema>;
