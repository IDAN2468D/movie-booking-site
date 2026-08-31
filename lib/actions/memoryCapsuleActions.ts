"use server";

import {
  MintShardInputSchema,
  MemoryShard,
  ShardRarity,
} from "@/lib/schemas/memoryCapsule.schema";

const globalVaultShards = new Map<string, MemoryShard>();

const DEMO_QUOTES = [
  { quote: "הזמן הוא המשאב היקר ביותר בקוסמוס.", author: "גיבור הסרט" },
  { quote: "בתוך החושך של האולם, האור האמיתי הוא הרגש.", author: "דמות ראשית" },
  { quote: "כל צעד שנעשה משנה את קו הזמן של כולם.", author: "נווט הזמן" },
  { quote: "אין גבול למה שאפשר להרגיש כשהמוזיקה והתמונה מתחברים.", author: "המלחין" },
];

function determineRarity(): { rarity: ShardRarity; value: number } {
  const rand = Math.random();
  if (rand > 0.92) return { rarity: "MYTHIC", value: 450 };
  if (rand > 0.75) return { rarity: "EPIC", value: 220 };
  if (rand > 0.45) return { rarity: "RARE", value: 110 };
  return { rarity: "COMMON", value: 45 };
}

export async function mintMemoryShard(
  input: unknown
): Promise<{ success: boolean; data?: MemoryShard; error?: string }> {
  try {
    const parsed = MintShardInputSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "נתונים לא תקינים להנפקת שבר זיכרון" };
    }

    const { movieId, movieTitle, seatLabel, hallName, userId = "user-me" } = parsed.data;
    const shardId = `shard-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const quoteObj = DEMO_QUOTES[Math.floor(Math.random() * DEMO_QUOTES.length)];
    const { rarity, value } = determineRarity();

    const shard: MemoryShard = {
      shardId,
      userId,
      movieId,
      movieTitle,
      screeningDate: new Date().toLocaleDateString("he-IL"),
      seatLabel,
      hallName,
      rarity,
      visualArtUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
      quoteText: quoteObj.quote,
      quoteAuthor: quoteObj.author,
      acousticEchoFrequency: rarity === "MYTHIC" ? 528 : rarity === "EPIC" ? 432 : 396,
      editionNumber: Math.floor(Math.random() * 25) + 1,
      totalMinted: 100,
      attributes: {
        "Acoustic Immersion": "98%",
        "Color Palette": "Cyan Neon",
        "Screening Format": "Dolby Atmos 4K",
      },
      isMinted: true,
      marketValueIls: value,
    };

    globalVaultShards.set(shardId, shard);
    return { success: true, data: shard };
  } catch {
    return { success: false, error: "שגיאה בהנפקת שבר הזיכרון" };
  }
}

export async function fetchUserMemoryVault(
  userId = "user-me"
): Promise<{ success: boolean; data?: MemoryShard[]; error?: string }> {
  try {
    const existing = Array.from(globalVaultShards.values()).filter((s) => s.userId === userId);

    if (existing.length === 0) {
      // Seed initial starter shards for vault
      const starter1: MemoryShard = {
        shardId: "shard-demo-mythic",
        userId,
        movieId: "693134",
        movieTitle: "חולית: חלק 2",
        screeningDate: "28/08/2026",
        seatLabel: "D4 (VIP SweetSpot)",
        hallName: "אולם אקוסטי ראשי 1",
        rarity: "MYTHIC",
        visualArtUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
        quoteText: "מי ששולט בתבלין שולט ביקום כולו.",
        quoteAuthor: "פול אטראידיס",
        acousticEchoFrequency: 528,
        editionNumber: 3,
        totalMinted: 50,
        attributes: {
          "Bass Resonance": "35Hz Sub",
          "Haptic Feedback": "Ultra Level 5",
          "Format": "IMAX Laser 70mm",
        },
        isMinted: true,
        marketValueIls: 550,
      };

      const starter2: MemoryShard = {
        shardId: "shard-demo-epic",
        userId,
        movieId: "1022789",
        movieTitle: "הקול בראש 2",
        screeningDate: "15/08/2026",
        seatLabel: "C5",
        hallName: "אולם 2 Dolby",
        rarity: "EPIC",
        visualArtUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
        quoteText: "אולי זה מה שקורה כשמתבגרים - מרגישים פחות שמחה.",
        quoteAuthor: "שמחה (Joy)",
        acousticEchoFrequency: 432,
        editionNumber: 12,
        totalMinted: 100,
        attributes: {
          "Emotional Resonance": "99.4%",
          "Chromatic Spectrum": "Rainbow Prism",
        },
        isMinted: true,
        marketValueIls: 240,
      };

      globalVaultShards.set(starter1.shardId, starter1);
      globalVaultShards.set(starter2.shardId, starter2);
      return { success: true, data: [starter1, starter2] };
    }

    return { success: true, data: existing };
  } catch {
    return { success: false, error: "שגיאה בשליפת שברי הזיכרון" };
  }
}
