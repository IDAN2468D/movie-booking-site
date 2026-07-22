"use server";

export interface AfterglowTriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export async function getAfterglowTriviaAction(movieTitle: string): Promise<{ success: boolean; data?: AfterglowTriviaQuestion[]; error?: string }> {
  try {
    const questions: AfterglowTriviaQuestion[] = [
      {
        id: 1,
        question: `מהי הסצנה הדרמטית שפתחה את המערכה השלישית בסרט "${movieTitle}"?`,
        options: ["המלחמה על הגשר", "הדיאלוג בערפל", "הנחיתה על הכוכב", "המרדף הלילי"],
        correctIndex: 1,
      },
      {
        id: 2,
        question: "איזה אלמנט אקוסטי ייחודי בלט במהלך הטריילר והפסקול?",
        options: ["פעימת בס 40Hz", "כינורות סולו", "שתיקה מוחלטת", "קולות מקהלה"],
        correctIndex: 0,
      },
    ];

    return { success: true, data: questions };
  } catch (error: any) {
    console.error("getAfterglowTriviaAction error:", error);
    return { success: false, error: "שגיאה שטעינת מתחם Afterglow" };
  }
}
