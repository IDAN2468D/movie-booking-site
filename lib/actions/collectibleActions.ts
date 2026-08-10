"use server";

import crypto from "crypto";
import { memoryShardSchema } from "@/lib/schemas/collectible";

const SECRET = process.env.HMAC_SECRET || "cinebook_hmac_secret_v5";

export async function generateMemoryShard(userId: string, movieId: string, movieTitle: string) {
  try {
    const shardId = `shard_${Date.now()}`;
    const screeningDate = new Date().toISOString().split("T")[0];
    const dataToSign = `${shardId}:${userId}:${movieId}:${screeningDate}`;
    const hmacSignature = crypto.createHmac("sha256", SECRET).update(dataToSign).digest("hex");

    const shard = {
      shardId,
      userId,
      movieId,
      movieTitle,
      screeningDate,
      iconicQuote: "אנחנו מוגדרים על פי הבחירות שאנו עושים ברגע החשיכה.",
      soundtrackSnippetUrl: "/audio/snippets/theme.mp3",
      hmacSignature,
      rarityTier: "legendary" as const,
    };

    const validated = memoryShardSchema.parse(shard);
    return { success: true, data: validated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate memory shard";
    return { success: false, error: message };
  }
}

export async function getUserMemoryShards(userId: string) {
  try {
    return {
      success: true,
      data: [
        {
          shardId: "shard_1001",
          userId,
          movieId: "mov_interstellar",
          movieTitle: "Interstellar: Resonated",
          screeningDate: "2026-08-01",
          iconicQuote: "אהבה היא הדבר היחיד שחוצה ממדי זמן ומקום.",
          hmacSignature: "9a8b7c6d5e4f3a2b1c0d",
          rarityTier: "mythic" as const,
        },
        {
          shardId: "shard_1002",
          userId,
          movieId: "mov_dune2",
          movieTitle: "Dune: Part Two (IMAX 3D)",
          screeningDate: "2026-08-05",
          iconicQuote: "הפחד הוא הורג התודעה.",
          hmacSignature: "1a2b3c4d5e6f7a8b9c0d",
          rarityTier: "legendary" as const,
        },
      ],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to get user memory shards";
    return { success: false, error: message };
  }
}
