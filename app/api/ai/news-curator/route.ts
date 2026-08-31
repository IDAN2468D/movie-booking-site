import { NextResponse } from "next/server";
import { callGeminiWithRetry } from "@/lib/gemini";
import { NewsCuratorOutputSchema } from "@/lib/schemas/newsCurator";
import { CINEMA_IMAGES, STATIC_NEWS_ARTICLES } from "@/lib/data/newsFallback";

const CACHE_TTL = 2 * 60 * 60 * 1000;
let newsCache: { data: any; timestamp: number } = { data: null, timestamp: 0 };

function getLiveHebrewTimestamp(): string {
  const now = new Date();
  return `עודכן לאחרונה ב-${new Intl.DateTimeFormat('he-IL', {
    timeZone: 'Asia/Jerusalem', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(now)}`;
}

export async function GET() {
  try {
    const staticFallbackData = {
      news: STATIC_NEWS_ARTICLES,
      lastUpdated: getLiveHebrewTimestamp()
    };

    const now = Date.now();
    if (newsCache.data && (now - newsCache.timestamp < CACHE_TTL)) {
      return NextResponse.json({ success: true, data: { ...newsCache.data, lastUpdated: getLiveHebrewTimestamp() }, source: 'cache' });
    }

    let liveParsedItems: { title: string; description: string; imageUrl: string }[] = [];
    try {
      const rssRes = await fetch("https://screenrant.com/feed/movie-news/", { next: { revalidate: 3600 } });
      const rssText = await rssRes.text();
      const rawItems = (rssText.match(/<item>([\s\S]*?)<\/item>/g) || []).slice(0, 15);
      
      liveParsedItems = rawItems.map(item => {
        const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() || '';
        const description = item.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>|<[^>]+>/g, '').trim().substring(0, 250) || '';
        const imageUrl = item.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1]
          || item.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1]
          || item.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1]
          || '';
        return { title, description, imageUrl };
      });
    } catch {}

    const liveNewsContext = liveParsedItems.map((item, i) => 
      `[${i+1}] ${item.title}\nתיאור: ${item.description}\nתמונה: ${item.imageUrl || 'אין'}`
    ).join('\n\n');

    const prompt = `אתה עורך ראשי של מבזקי קולנוע וטכנולוגיית קולנוע בפלטפורמת CinePulse.
צור לקט מקיף ועשיר של 12 עד 16 כתבות ועדכוני קולנוע מרתקים בעברית בלבד (שוברי קופות, במאים, טכנולוגיית IMAX, פרסים וחדשנות ב-CinePulse).
השתמש במידע הבא:
${liveNewsContext}

חובה להחזיר JSON תקין בלבד במבנה:
{
  "news": [
    {
      "id": "id-1",
      "title": "כותרת בעברית",
      "summary": "סיכום קצר וקולע בעברית (2-3 משפטים)",
      "source": "מקור הכתבה",
      "date": "היום",
      "imageUrl": "כתובת תמונה שמתחילה ב-http",
      "sentiment": "exciting",
      "tags": ["קולנוע"]
    }
  ]
}`;

    let text = '';
    const modelUsed = 'gemini-3.5-flash-lite';
    try {
      const result = await callGeminiWithRetry([modelUsed], async (model) => {
        const res = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        });
        return res.response.text();
      });
      text = result;
    } catch {
      text = JSON.stringify(staticFallbackData);
    }

    let rawData: any = staticFallbackData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) rawData = JSON.parse(jsonMatch[0]);
    } catch {}

    if (Array.isArray(rawData?.news) && rawData.news.length > 0) {
      rawData.news = rawData.news.map((item: any, idx: number) => {
        let finalImg = item.imageUrl && item.imageUrl.startsWith('http') && !item.imageUrl.includes('undefined') ? item.imageUrl : '';
        if (!finalImg || finalImg === 'אין') {
          finalImg = CINEMA_IMAGES[idx % CINEMA_IMAGES.length];
        }
        return { ...item, imageUrl: finalImg };
      });
    } else {
      rawData = staticFallbackData;
    }

    rawData.lastUpdated = getLiveHebrewTimestamp();
    const parsed = NewsCuratorOutputSchema.safeParse(rawData);
    const finalData = parsed.success ? parsed.data : staticFallbackData;

    newsCache = { data: finalData, timestamp: Date.now() };
    return NextResponse.json({ success: true, data: finalData });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}