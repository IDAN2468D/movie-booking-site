"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { NeuralDiscovery } from "@/lib/models/NeuralDiscovery";
import { neuralSchema } from "@/lib/validations/neuralDiscover";
import { z } from "zod";

type NeuralQueryInput = z.infer<typeof neuralSchema>;

export async function getNeuralMovies(userId: string, input: NeuralQueryInput) {
  try {
    const validated = neuralSchema.safeParse(input);

    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    await connectToDatabase();

    // Log the interaction atomically
    const queryTerm = validated.data.searchQuery || validated.data.mood || "unknown";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateOps: any = {
      $inc: { totalSearches: 1 },
      $addToSet: { queries: queryTerm }
    };
    
    if (validated.data.mood) updateOps.$set = { lastMood: validated.data.mood };
    if (validated.data.sensoryFocus) updateOps.$addToSet.queries = { $each: [queryTerm, validated.data.sensoryFocus] };

    await NeuralDiscovery.findOneAndUpdate(
      { userId },
      updateOps,
      { upsert: true, new: true }
    );

    // Generate mock results to showcase the filtering weights
    const tensionWeight = (validated.data.tension || 50) / 100;
    const paceWeight = (validated.data.pace || 50) / 100;
    const directorBonus = validated.data.directorMode ? 5 : 0;
    const sensoryBonus = validated.data.sensoryFocus ? 3 : 0;
    
    // Dosage mapping
    let collectionSuffix = "";
    if (validated.data.dosage === "Deep Dive") collectionSuffix = " (גרסת במאי מורחבת)";
    else if (validated.data.dosage === "Micro-Dose") collectionSuffix = " (קצר וקולע)";
    
    const results = [
      { 
        id: "neural-1", 
        title: validated.data.directorMode === "כריסטופר נולאן" ? "התחלה (Inception)" : "אופק האירועים", 
        match: Math.min(100, Math.max(50, Math.round(95 * tensionWeight)) + directorBonus + sensoryBonus), 
        collection: "מסעות קוסמיים" + collectionSuffix, 
        image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=600&auto=format&fit=crop" 
      },
      { 
        id: "neural-2", 
        title: validated.data.directorMode === "דני וילנב" ? "חולית 2" : "בלייד ראנר 2049", 
        match: Math.min(100, Math.max(50, Math.round(88 * paceWeight)) + directorBonus + sensoryBonus), 
        collection: "תעלומות אפלות בעיר" + collectionSuffix, 
        image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600&auto=format&fit=crop" 
      },
      { 
        id: "neural-3", 
        title: validated.data.directorMode === "קוונטין טרנטינו" ? "ספרות זולה" : "בין כוכבים", 
        match: Math.min(100, 92 + directorBonus + sensoryBonus), 
        collection: "מסעות קוסמיים" + collectionSuffix, 
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600&auto=format&fit=crop" 
      },
    ];

    return { success: true, data: results };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Neural Discovery Error:", error);
    return { success: false, error: "שגיאת מערכת נוירונית, אנא נסה מאוחר יותר." };
  }
}
