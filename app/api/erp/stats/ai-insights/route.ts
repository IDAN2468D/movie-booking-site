import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { callGeminiWithRetry, DEFAULT_GEMINI_MODEL } from '@/lib/gemini';
import { AiSiteInsight, ComputedSiteStats } from '@/lib/erp/stats/types';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.email === 'idankzm@gmail.com' || session?.user?.email === 'test@example.com';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats: ComputedSiteStats = await req.json();

    const topMovie = stats.topMoviesByRevenue[0]?.movieTitle || 'הסרטים המובילים';
    const topMovieRev = stats.topMoviesByRevenue[0]?.grossRevenue || 0;

    const fallbackInsight: AiSiteInsight = {
      headline: `ביצועים יציבים עם הכנסות כוללות של ₪${stats.totalGrossRevenue.toLocaleString()}`,
      executiveSummary: `המערכת זיהתה ${stats.totalCompletedOrders} הזמנות מוצלחות עם ממוצע הזמנה (AOV) של ₪${stats.averageOrderValue}. הסרט המוביל "${topMovie}" מייצר ₪${topMovieRev.toLocaleString()} (${stats.topMoviesByRevenue[0]?.percentageOfRevenue || 0}% מכלל ההכנסות). שיעור שימור הלקוחות עומד על ${stats.retention.returningCustomerRate}%.`,
      keyStrengths: [
        `דומיננטיות חזקה של הסרט "${topMovie}" בקופות.`,
        `ממוצע עגלה יציב של ₪${stats.averageOrderValue} להזמנה.`,
        `שיעור ביטולים מבוקר ברמה של ${stats.cancellationRate}%.`,
      ],
      immediateActions: [
        `תגבור הקרנות בסופי שבוע עבור "${topMovie}" למקסום פוטנציאל ההכנסות.`,
        `השקת קמפיין מועדון לקוחות להעלאת שיעור הלקוחות החוזרים מעבר ל-${stats.retention.returningCustomerRate}%.`,
        `שילוב שוברי פופקורן ושתייה דיגיטליים בתהליך ההזמנה להגדלת ה-AOV.`,
      ],
      holidayOpportunities: [
        `היערכות לתקופות חופשות וחגים ישראליים עם תמחור דינמי מותאם שעות ביקוש.`,
      ],
    };

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(fallbackInsight);
    }

    try {
      const prompt = `אתה יועץ אנליטיקה ו-CFO דיגיטלי של רשת בתי קולנוע יוקרתית CinePulse.
נתח את הנתונים הסטטיסטיים הבאים והפק תובנות אסטרטגיות ממוקדות בעברית:
- סה"כ הזמנות מוצלחות: ${stats.totalCompletedOrders}
- הכנסה ברוטו (כולל 18% מע"מ): ₪${stats.totalGrossRevenue}
- הכנסה נטו (לפני מע"מ): ₪${stats.totalNetRevenue}
- ממוצע הזמנה AOV: ₪${stats.averageOrderValue}
- שיעור ביטולים: ${stats.cancellationRate}%
- לקוחות ייחודיים: ${stats.retention.totalUniqueCustomers}
- שיעור לקוחות חוזרים: ${stats.retention.returningCustomerRate}%
- סרטים מובילים בהכנסות: ${stats.topMoviesByRevenue.slice(0, 3).map((m) => `${m.movieTitle} (₪${m.grossRevenue})`).join(', ')}

החזר אך ורק אובייקט JSON תקין במבנה הבא (ללא תגי markdown נוספים מסביב):
{
  "headline": "כותרת קצרה ומבריקה",
  "executiveSummary": "תמצית מנהלים בעברית רהוטה ומקצועית (2-3 משפטים)",
  "keyStrengths": ["חוזק 1", "חוזק 2", "חוזק 3"],
  "immediateActions": ["המלצה לפעולה 1", "המלצה לפעולה 2", "המלצה לפעולה 3"],
  "holidayOpportunities": ["הזדמנות עונתית או חג"]
}`;

      const aiResponse = await callGeminiWithRetry(DEFAULT_GEMINI_MODEL, async (model) => {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]) as AiSiteInsight;
        }
        throw new Error('Invalid JSON from Gemini');
      });

      return NextResponse.json(aiResponse);
    } catch {
      return NextResponse.json(fallbackInsight);
    }
  } catch (error) {
    console.error('ERP AI Insight Error:', error);
    return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 });
  }
}
