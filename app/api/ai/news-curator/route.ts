import { NextResponse } from "next/server";
import { callGeminiWithRetry } from "@/lib/gemini";
import { NewsCuratorOutputSchema } from "@/lib/schemas/newsCurator";

const CACHE_TTL = 2 * 60 * 60 * 1000;
let newsCache: { data: any; timestamp: number } = { data: null, timestamp: 0 };

const CINEMA_IMAGES = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518676599602-2170e3d7597c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
];

function getLiveHebrewTimestamp(): string {
  const now = new Date();
  return `עודכן לאחרונה ב-${new Intl.DateTimeFormat('he-IL', {
    timeZone: 'Asia/Jerusalem', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(now)}`;
}

export async function GET() {
  try {
    const staticFallbackData = {
      news: [
        {
          id: "news-fb-1",
          title: "מנוע ה-Neural Discovery של TMTB משיק גרסה 4.0",
          summary: "חוויית חיפוש רגשית חדשה המשלבת בועות תחושה, גלי קול 40Hz ועיצוב Liquid Glass עתידני.",
          source: "TMTB Official",
          date: "היום",
          imageUrl: CINEMA_IMAGES[0],
          sentiment: "exciting" as const,
          tags: ["TMTB", "חדשנות", "Liquid Glass"]
        },
        {
          id: "news-fb-2",
          title: "שוברי הקופות הגדולים של 2026 נחשפים בטריילר עולמי",
          summary: "אולפני הוליווד מכריזים על גל סרטי מדע בדיוני ודרמות מתח תקציביות ענקיות.",
          source: "Variety",
          date: "היום",
          imageUrl: CINEMA_IMAGES[1],
          sentiment: "dramatic" as const,
          tags: ["הוליווד", "טריילרים", "קולנוע"]
        },
        {
          id: "news-fb-3",
          title: "מועדון ה-VIP Pulse מעניק כרטיסים במתנה לחברים פעילים",
          summary: "משתמשים שהשלימו את אתגר ה-Streak השבועי זוכים בשוברי VIP להקרנות בכורה.",
          source: "TMTB Official",
          date: "היום",
          imageUrl: CINEMA_IMAGES[2],
          sentiment: "exciting" as const,
          tags: ["VIP", "הטבות", "TMTB"]
        },
        {
          id: "news-fb-4",
          title: "שמועות חמות: הבמאי המוביל מפתח סרט הולו-גרפי חדש",
          summary: "דיווחים בלעדיים על הפקת ענק שתוקרן באולמות IMAX בלבד תוך שימוש בסאונד מבוסס תדרים.",
          source: "Hollywood Reporter",
          date: "אתמול",
          imageUrl: CINEMA_IMAGES[3],
          sentiment: "rumor" as const,
          tags: ["שמועות", "IMAX", "סרטים"]
        },
        {
          id: "news-fb-5",
          title: "מערכת פיצול התשלומים הרב-מטבעית הושקה ב-TMTB",
          summary: "כעת ניתן לשלב תשלום בשקלים, קריפטו BTC ונקודות VIP בהזמנה אחת.",
          source: "TMTB Official",
          date: "היום",
          imageUrl: CINEMA_IMAGES[4],
          sentiment: "exciting" as const,
          tags: ["פיצול תשלום", "Multi-Currency"]
        },
        {
          id: "news-fb-6",
          title: "פסטיבל הקולנוע הבינלאומי מכריז על רשימת הזוכים",
          summary: "סרט הדרמה העצמאי זכה בפרס הזהב של השופטים לאחר הקרנה מרהיבה.",
          source: "CineNews",
          date: "היום",
          imageUrl: CINEMA_IMAGES[5],
          sentiment: "neutral" as const,
          tags: ["פסטיבל", "פרסים"]
        }
      ],
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
      const rawItems = (rssText.match(/<item>([\s\S]*?)<\/item>/g) || []).slice(0, 20);
      
      liveParsedItems = rawItems.map(item => {
        const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() || '';
        const description = item.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>|<[^>]+>/g, '').trim().substring(0, 250) || '';
        const imageUrl = item.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1]
          || item.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1]
          || item.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1]
          || item.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1]
          || '';
        return { title, description, imageUrl };
      });
    } catch (err) {
      console.warn("Failed to fetch RSS context", err);
    }

    const liveNewsContext = liveParsedItems.map((item, i) => 
      `[${i+1}] ${item.title}\nתיאור: ${item.description}\nתמונה אמיתית: ${item.imageUrl || 'אין'}`
    ).join('\n\n');

    const tmtbNews = `
    [1] TMTB Liquid Glass 4.0: Dynamic emotion bubbles and acoustic 40Hz sub-bass engine. Image: ${CINEMA_IMAGES[0]}
    [2] Multi-Currency Split Payments: Combine ILS, BTC Crypto, and VIP Pulse points seamlessly. Image: ${CINEMA_IMAGES[4]}
    [3] Temporal Vault & VIP Rewards: Complete streaks to earn exclusive premiere tickets. Image: ${CINEMA_IMAGES[2]}
    [4] Spatial Seat Preview: 3D IMAX perspective visualizer with dynamic acoustic pan balance. Image: ${CINEMA_IMAGES[3]}
    `;

    const prompt = `
    אתה כתב ומפקח חדשות קולנוע ראשי באפליקציית TMTB.
    לפניך עדכוני קולנוע עולמיים אמיתיים מהיום מהפיד, ולצדם עדכוני TMTB:
    --- עולם הקולנוע (כולל קישור תמונה מקורי לכל כתבה) ---
    ${liveNewsContext}

    --- עדכוני TMTB ---
    ${tmtbNews}

    צור לקט מקיף של 10 עד 14 כתבות ועדכונים מרתקים בעברית בלבד!
    חובה לכלול לפחות 2-3 עדכוני TMTB רשמיים.
    לכל כתבה, העתק במדויק בשדה "imageUrl" את כתובת התמונה האמיתית מתוך "תמונה אמיתית: ..." שסופקה לך בטקסט!
    החזר JSON בלבד במבנה מדויק:
    {
      "news": [
        {
          "id": "id-1",
          "title": "כותרת בעברית",
          "summary": "סיכום בעברית",
          "source": "מקור",
          "date": "היום",
          "imageUrl": "הכתובת המדויקת של התמונה האמיתית",
          "sentiment": "exciting",
          "tags": ["תגית"]
        }
      ],
      "lastUpdated": ""
    }
    `;

    let text = '';
    let modelUsed = 'gemini-3.5-flash-lite';
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

    let jsonStr = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonStr = jsonMatch[0];
    jsonStr = jsonStr.replace(/```json|```/g, '').replace(/,\s*([}\]])/g, '$1').trim();

    let rawData: any;
    try {
      rawData = JSON.parse(jsonStr);
    } catch {
      rawData = staticFallbackData;
    }

    if (Array.isArray(rawData?.news)) {
      rawData.news = rawData.news.map((item: any, idx: number) => {
        let finalImg = item.imageUrl && item.imageUrl.startsWith('http') ? item.imageUrl : '';
        if (!finalImg || finalImg === 'אין') {
          const matchReal = liveParsedItems.find(p => p.title.toLowerCase().includes((item.title || '').substring(0, 10).toLowerCase()));
          finalImg = matchReal?.imageUrl || CINEMA_IMAGES[idx % CINEMA_IMAGES.length];
        }
        return { ...item, imageUrl: finalImg };
      });
    }

    rawData.lastUpdated = getLiveHebrewTimestamp();
    const parsed = NewsCuratorOutputSchema.safeParse(rawData);
    const finalData = parsed.success ? parsed.data : staticFallbackData;

    newsCache = { data: finalData, timestamp: Date.now() };
    return NextResponse.json({ success: true, data: finalData, model: modelUsed });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}