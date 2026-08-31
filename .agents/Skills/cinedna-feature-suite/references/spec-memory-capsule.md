# Technical Specification: Post-Show Memory Capsule & Shard Trading

## 1. Objective & Flow
Mint collectible digital memory shards post-screening featuring personalized viewing stats, visual stills, audio echoes, and community trading capabilities.

## 2. Zod Data Schema

```typescript
import { z } from "zod";

export const MemoryShardSchema = z.object({
  shardId: z.string(),
  userId: z.string(),
  movieId: z.string(),
  movieTitle: z.string(),
  screeningDate: z.date(),
  seatLabel: z.string(),
  rarity: z.enum(["COMMON", "RARE", "EPIC", "MYTHIC"]),
  visualArtUrl: z.string().url(),
  acousticEchoUrl: z.string().url().optional(),
  attributes: z.record(z.string(), z.union([z.string(), z.number()])),
});

export type MemoryShard = z.infer<typeof MemoryShardSchema>;
```
