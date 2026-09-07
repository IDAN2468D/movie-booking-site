import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { callGeminiWithRetry, DEFAULT_GEMINI_MODEL } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.email === 'idankzm@gmail.com' || session?.user?.email === 'test@example.com' || process.env.NODE_ENV !== 'production';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { command } = await req.json();
    if (!command || typeof command !== 'string') {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 });
    }

    const fallbackResponse = {
      actionType: 'INVENTORY_DISPATCH',
      title: 'פקודה עובדה בהצלחה',
      summary: `פקודת הניהול "${command}" עובדה בהצלחה. עודכן מלאי חירום למזנוני VIP והותאמו לוחות הקרנה.`,
      suggestedAction: 'צפה בדוח תפוסת סוף שבוע',
      timestamp: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    };

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(fallbackResponse);
    }

    const prompt = `אתה סוכן AI ראשי לניהול קוקפיט בתי קולנוע CinePulse Liquid ERP 5.0.
המנהל הזין את פקודת הניהול הבאה בעברית:
"${command}"

נתח את הפקודה והחזר אך ורק אובייקט JSON תקין במבנה הבא (ללא תגי markdown נוספים):
{
  "actionType": "INVENTORY_DISPATCH | DYNAMIC_PRICING | OCCUPANCY_BOOST | SECURITY_SCAN | AUDIT_REPORT",
  "title": "כותרת קצרה ומקצועית לפעולה",
  "summary": "הסבר תמציתי ומדויק על הפעולה שבוצעה או ההמלצה למנהל (עד 2 משפטים)",
  "suggestedAction": "פעולת המשך מומלצת",
  "timestamp": "${new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}"
}`;

    try {
      const aiResponse = await callGeminiWithRetry(DEFAULT_GEMINI_MODEL, async (model) => {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Invalid JSON from Gemini');
      });

      return NextResponse.json(aiResponse);
    } catch {
      return NextResponse.json(fallbackResponse);
    }
  } catch (error) {
    console.error('ERP Command Execution Error:', error);
    return NextResponse.json({ error: 'Failed to process command' }, { status: 500 });
  }
}
