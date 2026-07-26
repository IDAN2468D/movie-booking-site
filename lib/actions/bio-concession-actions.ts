"use server";

import { BioConcessionSchema, BioConcessionInput } from "@/lib/validations/bio-concession";

export async function actionOptimizeConcessionCombo(input: BioConcessionInput) {
  try {
    const validated = BioConcessionSchema.parse(input);
    const recommendations: Record<string, { combo: string; discount: string; subBassHz: number }> = {
      Chill: { combo: "Truffle Butter Popcorn & Chamomile Soda", discount: "15%", subBassHz: 35 },
      Hyper: { combo: "Electric Jalapeño Nachos & Nitro Cold Brew", discount: "20%", subBassHz: 40 },
      Cinematic: { combo: "Classic Caramel Tub & Liquid Gold Cola", discount: "10%", subBassHz: 38 },
      Focused: { combo: "Dark Chocolate Espresso Almonds & Sparkling Water", discount: "12%", subBassHz: 36 },
      Ethereal: { combo: "Cotton Candy Cloud Shake & Space Dust Gummies", discount: "25%", subBassHz: 42 },
    };

    return {
      success: true,
      data: {
        vibe: validated.energyVibe,
        recommendation: recommendations[validated.energyVibe],
        timestamp: Date.now(),
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message || "Combo optimization failed" };
  }
}
