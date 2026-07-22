"use server";

import { SmartTrayResponseSchema, SmartTrayResponse } from "@/lib/validations/smartTray";

export async function getSmartTrayRecommendationAction(movieGenre: string): Promise<{ success: boolean; data?: SmartTrayResponse; error?: string }> {
  try {
    const isAction = movieGenre.toLowerCase().includes("action") || movieGenre.toLowerCase().includes("sci-fi");

    const mockResponse: SmartTrayResponse = {
      comboName: isAction ? "חבילת אקשן VIP ומנצנצים" : "חבילת קולנוע קלאסית זוגית",
      items: [
        {
          id: "item-1",
          name: "פופקורן חמאה ענק (XXL)",
          category: "popcorn",
          price: 34,
          recommendedGenre: movieGenre,
          calories: 550,
        },
        {
          id: "item-2",
          name: "קולה זירו צוננת (1 ליטר)",
          category: "drink",
          price: 22,
          recommendedGenre: movieGenre,
        },
        {
          id: "item-3",
          name: "נאצ'וס פריך + ממרח גואקמולה",
          category: "snack",
          price: 28,
          recommendedGenre: movieGenre,
        },
      ],
      totalPrice: 84,
      estimatedDeliveryMin: 5,
    };

    const validated = SmartTrayResponseSchema.parse(mockResponse);
    return { success: true, data: validated };
  } catch (error: any) {
    console.error("getSmartTrayRecommendationAction error:", error);
    return { success: false, error: "שגיאה בטעינת המלצות המזנון" };
  }
}

export async function getSmartTrayRecommendations(movieTitle: string, movieGenre: string): Promise<{ success: boolean; data?: { items: any[], explanation: string }; error?: string }> {
  return {
    success: true,
    data: {
      items: [
        { id: "f1", name: "פופקורן ענק", image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=150" },
        { id: "f2", name: "קולה זירו", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150" },
      ],
      explanation: `מגש מותאם לסרט ${movieTitle} מגוררות טעמים מושלמים לפי ז'אנר ${movieGenre}.`,
    },
  };
}
