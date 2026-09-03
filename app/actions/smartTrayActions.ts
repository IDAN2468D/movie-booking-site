"use server";

import { SmartTrayResponseSchema, SmartTrayResponse } from "@/lib/validations/smartTray";
import { FOOD_ITEMS } from "@/lib/constants";

export interface SmartTrayItemData {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  tag?: string;
}

const GENRE_MAP: Record<string, { hebrew: string; itemIds: number[]; defaultExplanation: string }> = {
  action: {
    hebrew: "אקשן ומתח",
    itemIds: [1, 2, 3],
    defaultExplanation: "שילוב עוצמתי של פופקורן קריספי, נאצ'וס ספייסי לוהט ומשקה מוגז מרענן לקצב פעימות הלב של הסרט.",
  },
  "sci-fi": {
    hebrew: "מדע בדיוני",
    itemIds: [1, 3, 9],
    defaultExplanation: "מגש עתידני עם שילוב טעמים מחושמל, סודה קראפט מרעננת וברד קרחוני לשיוט בין כוכבים.",
  },
  animation: {
    hebrew: "אנימציה ומשפחה",
    itemIds: [7, 8, 9],
    defaultExplanation: "חגיגת מתיקות קולנועית עם פופקורן קרמל זהוב, סוכריות גומי צבעוניות וברד תות קפוא.",
  },
  comedy: {
    hebrew: "קומדיה",
    itemIds: [1, 7, 3],
    defaultExplanation: "מיקס בידור מושלם המשלב מתוק ומלוח – מנשנשים וצוחקים לאורך כל ההקרנה.",
  },
  drama: {
    hebrew: "דרמה",
    itemIds: [1, 6, 4],
    defaultExplanation: "נשנוש גורמה אנין לצפייה עמוקה – פופקורן פרימיום לצד אייס לאטה קטיפתי ודונאט איכותי.",
  },
};

export async function getSmartTrayRecommendationAction(movieGenre: string): Promise<{ success: boolean; data?: SmartTrayResponse; error?: string }> {
  try {
    const isAction = movieGenre.toLowerCase().includes("action") || movieGenre.toLowerCase().includes("sci-fi");
    const mockResponse: SmartTrayResponse = {
      comboName: isAction ? "חבילת אקשן VIP ומנצנצים" : "חבילת קולנוע קלאסית זוגית",
      items: [
        { id: "item-1", name: "פופקורן חמאה ענק (XXL)", category: "popcorn", price: 34, recommendedGenre: movieGenre, calories: 550 },
        { id: "item-2", name: "קולה זירו צוננת (1 ליטר)", category: "drink", price: 22, recommendedGenre: movieGenre },
        { id: "item-3", name: "נאצ'וס פריך + ממרח גואקמולה", category: "snack", price: 28, recommendedGenre: movieGenre },
      ],
      totalPrice: 84,
      estimatedDeliveryMin: 5,
    };

    const validated = SmartTrayResponseSchema.parse(mockResponse);
    return { success: true, data: validated };
  } catch (error) {
    console.error("getSmartTrayRecommendationAction error:", error);
    return { success: false, error: "שגיאה בטעינת המלצות המזנון" };
  }
}

export async function getSmartTrayRecommendations(
  movieTitle: string,
  movieGenre: string
): Promise<{ success: boolean; data?: { items: SmartTrayItemData[]; explanation: string; totalPrice: number; genreHebrew: string }; error?: string }> {
  try {
    const genreLower = (movieGenre || "action").toLowerCase();
    const matchedKey = Object.keys(GENRE_MAP).find(k => genreLower.includes(k)) || "action";
    const config = GENRE_MAP[matchedKey];

    const items = config.itemIds
      .map(id => FOOD_ITEMS.find(f => f.id === id))
      .filter((f): f is typeof FOOD_ITEMS[0] => Boolean(f))
      .map(f => ({
        id: f.id,
        name: f.name,
        category: f.category,
        price: f.price,
        image: f.image,
        tag: f.tag,
      }));

    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
    const explanation = `מגש שנאצר במיוחד עבור "${movieTitle}" – ${config.defaultExplanation}`;

    return {
      success: true,
      data: {
        items,
        explanation,
        totalPrice,
        genreHebrew: config.hebrew,
      },
    };
  } catch (err: unknown) {
    console.error("getSmartTrayRecommendations error:", err);
    return { success: false, error: "שגיאה באצירת המגש החכם" };
  }
}
