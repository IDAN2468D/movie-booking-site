const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "MOCK_KEY");

async function testStateControl() {
  const prompt = `
    אתה מנוע בקרה ופילטור נתונים בזמן אמת של אתר הסרטים היוקרתי MovieBook.
    התפקיד שלך הוא לקבל הודעה בשפה חופשית בעברית מהמשתמש, לנתח אותה, ולהחזיר אך ורק אובייקט JSON תקין שמייצג את פילטור הסרטים או הוספה למועדפים.
    משתמש: "תראה לי סרטי פעולה משנת 2024"

    חוקים קשיחים לערכי ה-JSON:
    1. שדה genre יכול להיות אך ורק אחד מהבאים: "הכל", "פעולה", "דרמה", "קומדיה", "מדע בדיוני", "אימה", "משפחה", "רומנטיקה".
    2. שדה year יכול להיות אך ורק אחד מהבאים: "הכל", "שנות ה-90", "שנות ה-2000", "שנות ה-2010", "2024", "2025", "2026".
    3. שדה rating יכול להיות מספר בין 0 ל-10.
    4. שדה favoriteMovie יהיה שם הסרט שהמשתמש ביקש להוסיף למועדפים, או null.
    5. שדה reply הוא משפט הסבר קצר ויוקרתי בעברית שמסביר למשתמש מה עודכן (עד 15 מילים).

    פורמט הפלט הנדרש (החזר אך ורק JSON תקין ללא הסברים אחרים):
    {
      "action": "FILTER",
      "filters": {
        "genre": "פעולה",
        "year": "2024",
        "rating": 0
      },
      "favoriteMovie": null,
      "reply": "משפט הסבר יוקרתי בעברית"
    }
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("Raw Response:", text);
    
    // Test parsing
    const jsonStr = text.replace(/```json|```/g, '').trim();
    console.log("Cleaned string:", jsonStr);
    const parsed = JSON.parse(jsonStr);
    console.log("Parsed JSON successfully:", parsed);
  } catch (error) {
    console.error("Error:", error);
  }
}

testStateControl();
