"use server";

import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import { DEFAULT_MEMORY_CAPSULES } from "@/lib/constants/defaultMemoryCapsules";
import { 
  MemoryCapsuleItem, 
  MemoryReflection, 
  memoryReflectionSchema, 
  memoryCapsuleItemSchema 
} from "@/lib/validations/memoryCapsule";

const HMAC_SECRET = process.env.HMAC_SECRET || "cinepulse_vault_secret_2026";

function generateHmac(id: string, title: string, date: string): string {
  return crypto.createHmac("sha256", HMAC_SECRET).update(`${id}:${title}:${date}`).digest("hex");
}

export async function getUserMemoryCapsulesAction(userId?: string) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const savedReflections = await db.collection("memory_reflections").find({
      ...(userId ? { userId } : {})
    }).toArray();

    const reflectionMap = new Map<string, MemoryReflection>();
    savedReflections.forEach((doc) => {
      reflectionMap.set(doc.capsuleId, {
        capsuleId: doc.capsuleId,
        rating: doc.rating ?? 5,
        personalNote: doc.personalNote ?? "",
        companions: doc.companions,
        favoriteScene: doc.favoriteScene,
        emotionalVibe: doc.emotionalVibe ?? "התרגשות",
      });
    });

    let bookingCapsules: MemoryCapsuleItem[] = [];
    if (userId) {
      const bookings = await db.collection("bookings").find({ userId }).sort({ createdAt: -1 }).toArray();
      bookingCapsules = bookings.map((b) => {
        const id = b._id.toString();
        const movieTitle = b.movieTitle || b.movie?.title || "סרט קולנוע";
        const dateStr = b.date || (b.createdAt ? new Date(b.createdAt).toLocaleDateString("he-IL") : "2026");
        const posterUrl = b.posterUrl || (b.movie?.poster_path ? `https://image.tmdb.org/t/p/w500${b.movie.poster_path}` : "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg");
        return {
          id: `BOOKING-${id}`,
          movieId: b.movieId || id,
          movieTitle,
          posterUrl,
          date: dateStr,
          timestamp: b.createdAt ? new Date(b.createdAt).getTime() : Date.now(),
          hall: b.hall || "אולם VIP Dolby Atmos",
          seats: b.seats || ["VIP-1"],
          genre: b.genre || "קולנוע",
          iconicQuote: b.quote || "רסיס זיכרון קולנועי חי ומנצנץ.",
          decayLevel: 0.1,
          rarityTier: "legendary" as const,
          hmacSignature: generateHmac(id, movieTitle, dateStr),
          reflection: reflectionMap.get(`BOOKING-${id}`),
          isCustom: false,
        };
      });
    }

    const enrichedDefaults = DEFAULT_MEMORY_CAPSULES.map((item) => ({
      ...item,
      reflection: reflectionMap.get(item.id) || item.reflection,
    }));

    const allCapsules = [...bookingCapsules, ...enrichedDefaults];
    return { success: true, data: allCapsules };
  } catch (error) {
    console.error("[getUserMemoryCapsulesAction]", error);
    return { success: true, data: DEFAULT_MEMORY_CAPSULES };
  }
}

export async function getUserMemoriesAction(userId?: string) {
  const res = await getUserMemoryCapsulesAction(userId);
  if (!res.success || !res.data) return { success: false, data: [] };
  const mapped = res.data.map((c) => ({
    id: c.id,
    movieTitle: c.movieTitle,
    posterUrl: c.posterUrl,
    date: c.date,
    seats: c.seats,
  }));
  return { success: true, data: mapped };
}

export async function saveMemoryReflectionAction(reflection: MemoryReflection, userId?: string) {
  try {
    const validated = memoryReflectionSchema.parse(reflection);
    const client = await clientPromise;
    const db = client.db();

    await db.collection("memory_reflections").updateOne(
      { capsuleId: validated.capsuleId, ...(userId ? { userId } : {}) },
      { 
        $set: { 
          ...validated, 
          userId: userId || "guest_user", 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    return { success: true, data: validated };
  } catch (error) {
    console.error("[saveMemoryReflectionAction]", error);
    return { success: false, error: "שגיאה בשמירת הרשמים האישיים" };
  }
}

export async function createCustomMemoryCapsuleAction(payload: Partial<MemoryCapsuleItem>, userId?: string) {
  try {
    const id = `CUSTOM-${Date.now()}`;
    const newCapsule: MemoryCapsuleItem = {
      id,
      movieId: payload.movieId || `custom-${Date.now()}`,
      movieTitle: payload.movieTitle || "זיכרון קולנועי אישי",
      posterUrl: payload.posterUrl || "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      date: payload.date || new Date().toLocaleDateString("he-IL"),
      timestamp: Date.now(),
      hall: payload.hall || "אולם VIP קולנוע",
      seats: payload.seats || ["VIP"],
      genre: payload.genre || "חוויה אישית",
      iconicQuote: payload.iconicQuote || "רגע שלא יישכח באולם הקולנוע.",
      characterName: payload.characterName || "יוצר הזיכרון",
      decayLevel: 0,
      rarityTier: (payload.rarityTier as any) || "mythic",
      hmacSignature: generateHmac(id, payload.movieTitle || "custom", payload.date || "now"),
      reflection: payload.reflection,
      isCustom: true,
    };

    const validated = memoryCapsuleItemSchema.parse(newCapsule);
    const client = await clientPromise;
    const db = client.db();

    await db.collection("custom_memory_capsules").insertOne({
      ...validated,
      userId: userId || "guest_user",
      createdAt: new Date(),
    });

    return { success: true, data: validated };
  } catch (error) {
    console.error("[createCustomMemoryCapsuleAction]", error);
    return { success: false, error: "שגיאה ביצירת קפסולת זיכרון חדשה" };
  }
}
