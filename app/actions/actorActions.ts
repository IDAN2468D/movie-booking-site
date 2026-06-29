"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { Actor } from "@/lib/models/Actor";
import { getActorSchema, ACTOR_NOT_FOUND_MSG } from "@/lib/validations/actor";
import { getActorDetails, getImageUrl } from "@/lib/tmdb";
import { callGeminiWithRetry } from "@/lib/gemini";

export async function getActorProfile(actorId: string) {
  try {
    await connectToDatabase();
    const validated = getActorSchema.parse({ actorId });

    let actor = await Actor.findOne({ actorId: validated.actorId });

    if ((!actor || actor.biography === "לא סופקה ביוגרפיה עבור שחקן זה.") && validated.actorId.startsWith('tmdb-')) {
      const tmdbId = parseInt(validated.actorId.replace('tmdb-', ''), 10);
      if (!isNaN(tmdbId)) {
        const tmdbActor = await getActorDetails(tmdbId);
        if (tmdbActor) {
          const currentYear = new Date().getFullYear();
          const age = tmdbActor.birthday ? currentYear - new Date(tmdbActor.birthday).getFullYear() : 0;
          
          let translatedBio = tmdbActor.biography || "לא סופקה ביוגרפיה עבור שחקן זה.";
          
          // Generate/Translate Bio with AI
          const prompt = `You are an expert cinematic biographer. Write a rich, professional, and engaging biography in pure Hebrew for the actor ${tmdbActor.name}.
Original context: ${tmdbActor.biography || "None provided"}
Return ONLY the clean Hebrew text without markdown formatting, introductions, or titles. Make it compelling for a movie booking app.`;

          try {
            translatedBio = await callGeminiWithRetry(
              ["gemini-3.1-flash-lite"],
              async (model) => {
                const result = await model.generateContent(prompt);
                return result.response.text().trim();
              }
            );
          } catch (geminiError) {
            console.warn(`Gemini API failed for ${tmdbActor.name}. Falling back to local Ollama (gemma2:2b)...`);
            try {
              const ollamaRes = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  model: "gemma2:2b",
                  prompt: prompt,
                  stream: false
                }),
                // short timeout for local fallback
                signal: AbortSignal.timeout(10000)
              });
              
              if (ollamaRes.ok) {
                const ollamaData = await ollamaRes.json();
                if (ollamaData.response) {
                  translatedBio = ollamaData.response.replace(/\*\*/g, "").trim();
                }
              }
            } catch (ollamaError) {
              console.error("Ollama fallback also failed:", ollamaError);
            }
          }

          const newActorData = {
            actorId: validated.actorId,
            name: tmdbActor.name,
            avatarUrl: getImageUrl(tmdbActor.profile_path, 'original') || "",
            age: age || 0,
            birthPlace: tmdbActor.place_of_birth || "מידע חסר",
            biography: translatedBio,
            notableRoles: [],
            trending: tmdbActor.popularity > 50
          };

          try {
            actor = await Actor.findOneAndUpdate(
              { actorId: validated.actorId },
              { $set: newActorData },
              { upsert: true, returnDocument: 'after' }
            );
          } catch (e: any) {
            if (e.code === 11000) {
              actor = await Actor.findOne({ actorId: validated.actorId });
            }
          }
        }
      }
    }

    if (!actor) {
      return { success: false, error: ACTOR_NOT_FOUND_MSG };
    }

    return { success: true, data: JSON.parse(JSON.stringify(actor)) };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, error: error.issues?.[0]?.message || error.message };
    }
    return { success: false, error: "שגיאה במשיכת נתוני השחקן" };
  }
}

// Helper to seed a demo actor if none exists (for demo purposes)
export async function seedDemoActors() {
  await connectToDatabase();

  const demoActors = [
    {
      actorId: "actor-keanu",
      name: "קיאנו ריבס",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
      age: 59,
      birthPlace: "ביירות, לבנון",
      biography: "קיאנו צ'ארלס ריבס הוא שחקן, במאי ומוזיקאי קנדי. ידוע בזכות תפקידיו בסרטי פעולה ומדע בדיוני כגון המטריקס, ג'ון וויק, וספיד. ריבס מוכר גם בזכות פילנתרופיה ואורח חייו הצנוע. לאורך השנים הפך לאייקון תרבות ולשחקן אהוב במיוחד על הקהל העולמי.",
      notableRoles: ["ניאו (המטריקס)", "ג'ון וויק", "ג'ון קונסטנטין"],
      trending: true
    },
    {
      actorId: "actor-bale",
      name: "כריסטיאן בייל",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      age: 50,
      birthPlace: "האוורפורדווסט, ווילס",
      biography: "כריסטיאן בייל הוא שחקן קולנוע אנגלי שזכה בפרס האוסקר. ידוע ביכולתו לבצע שינויים גופניים דרסטיים עבור תפקידיו, ובגילומו של ברוס ויין/באטמן בטרילוגיית 'האביר האפל' של כריסטופר נולאן.",
      notableRoles: ["באטמן (האביר האפל)", "פטריק בייטמן (אמריקן פסיכו)"],
      trending: false
    }
  ];

  for (const actorData of demoActors) {
    try {
      await Actor.findOneAndUpdate(
        { actorId: actorData.actorId },
        { $setOnInsert: actorData },
        { upsert: true }
      );
    } catch (e: any) {
      // Ignore duplicate key errors just in case
      if (e.code !== 11000) throw e;
    }
  }

  return { success: true };
}
