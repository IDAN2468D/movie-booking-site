import { z } from "zod";

export const memoryShardSchema = z.object({
  shardId: z.string().min(1, "Shard ID is required"),
  userId: z.string().min(1, "User ID is required"),
  movieId: z.string().min(1, "Movie ID is required"),
  movieTitle: z.string(),
  screeningDate: z.string(),
  iconicQuote: z.string(),
  soundtrackSnippetUrl: z.string().optional(),
  hmacSignature: z.string().min(1, "HMAC signature is required"),
  rarityTier: z.enum(["common", "rare", "legendary", "mythic"]).default("rare"),
});

export type MemoryShardInput = z.infer<typeof memoryShardSchema>;
