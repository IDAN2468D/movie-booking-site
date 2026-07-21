import { NextResponse } from "next/server";
import { callGeminiWithRetry } from "@/lib/gemini";
import { NewsCuratorOutputSchema } from "@/lib/schemas/newsCurator";

interface UnifiedResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  model?: string;
}

interface NewsCache {
  data: any;
  timestamp: number;
}

let newsCache: NewsCache = { data: null, timestamp: 0 };
const CACHE_TTL = 2 * 60 * 60 * 1000; // הגדלנו לשעתיים כדי למנוע קריאות מיותרות לחלוטין

// פונקציה לייצור חותמת זמן דינמית חיה בעברית לפי שעון ישראל
function getLiveHebrewTimestamp(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Jerusalem',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return `עודכן לאחרונה ב-${new Intl.DateTimeFormat('he-IL', options).format(now)}`;
}

export async function GET() {
  try {
    const now = Date.now();
    // אם יש קאש תקף (פחות משעתיים), נחזיר אותו מיד בלי לפנות ל-Gemini בכלל
    if (newsCache.data && (now - newsCache.timestamp < CACHE_TTL)) {
      return NextResponse.json({
        success: true,
        data: {
          ...newsCache.data,
          lastUpdated: getLiveHebrewTimestamp()
        },
        source: 'cache',
        model: 'cache'
      });
    }

    // Fetch live RSS feed to provide context (RAG)
    let liveNewsContext = "";
    try {
      const rssRes = await fetch("https://screenrant.com/feed/movie-news/", { next: { revalidate: 3600 } });
      const rssText = await rssRes.text();
      
      const items = rssText.match(/<item>([\s\S]*?)<\/item>/g) || [];
      const topItems = items.slice(0, 15);
      
      const parsedItems = topItems.map(item => {
        const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
        const descMatch = item.match(/<description>([\s\S]*?)<\/description>/);
        return {
          title: titleMatch ? titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '',
          description: descMatch ? descMatch[1].replace(/<!\[CDATA\[|\]\]>|<[^>]+>/g, '').trim().substring(0, 300) : ''
        };
      });

      liveNewsContext = parsedItems.map((item, i) => `[${i+1}] ${item.title}\n${item.description}`).join('\n\n');
    } catch (err) {
      console.warn("Failed to fetch live RSS feed for context", err);
    }

    const tmtbSystemNews = `
    [1] TMTB Launches Liquid Glass 4.0: Experience the new neural discovery interface with acoustic haptics, sentiment analysis orbs, and a completely revamped futuristic dark mode.
    [2] TMTB VIP Rewards Updated: Unlock exclusive movie premieres and digital collectibles by using the Temporal Vault and completing streak rituals.
    `;

    const prompt = `
    אתה עוזר בינה מלאכותית מומחה לחדשות קולנוע עולמיות ותעשיית הסרטים של אפליקציית TMTB.
    לפניך אסופה של מקבצי חדשות קולנוע אמיתיות ועדכניות מהיום (באנגלית), ולצידן עדכוני מערכת פנימיים של TMTB:
    
    --- חדשות קולנוע בעולם ---
    ${liveNewsContext}

    --- עדכוני מערכת TMTB ---
    ${tmtbSystemNews}

    בחר מתוך המידע לעיל 6 עד 8 מהחדשות המרתקות ביותר. **חובה עליך לכלול לפחות עדכון TMTB אחד או שניים בלקט!**
    תרגם וסכם אותן לעברית קולחת. אל תמציא חדשות שלא מופיעות בטקסט שסיפקתי לך. 
    עבור חדשות של TMTB, שים ב-source את השם "TMTB Official" או "מערכת TMTB" ותן לזה סנטימנט exciting.
    חובה לכתוב את כל התשובה בשפה העברית בלבד.
    החזר את התשובה אך ורק כאובייקט JSON תקני (ללא מעטפות markdown), מבנה ה-JSON חייב להיות בדיוק כך:
    {
        "news": [
          {
            "id": "unique-string-id",
            "title": "כותרת החדשה",
            "summary": "תיקציר קצר בן משפט עד שניים",
            "source": "שם המקור",
            "date": "היום",
            "sentiment": "one of: exciting, dramatic, rumor, neutral",
            "tags": ["תגית1", "תגית2"]
          }
        ],
        "lastUpdated": ""
    }
    `;

    const modelNames = ["gemini-3.5-flash-lite"];
    let text = '';
    let modelUsed = '';

    try {
      const result = await callGeminiWithRetry(modelNames, async (model) => {
        const res = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          // הוסר לגמרי googleSearchRetrieval כדי למנוע את חסימות ה-429 של גוגל - משתמשים בגישת RAG מבוססת RSS
        });
        return { text: res.response.text(), modelUsed: model.model };
      });
      text = result.text;
      modelUsed = result.modelUsed;
    } catch (geminiError: any) {
      console.warn("Gemini failed after retries, using graceful fallback:", geminiError);

      if (newsCache.data) {
        return NextResponse.json({
          success: true,
          data: {
            ...newsCache.data,
            lastUpdated: getLiveHebrewTimestamp()
          },
          source: 'stale-cache',
          model: 'fallback-cache'
        });
      }

      text = JSON.stringify({
        news: [
          {
            id: "fallback-news-1",
            title: "עדכוני קולנוע חמים בדרך",
            summary: "אנו חווים עומס זמני בפניות לשרת ה-AI. המערכת תציג את החדשות המלאות מיד.",
            source: "MovieBook AI",
            date: "היום",
            sentiment: "neutral",
            tags: ["מערכת", "עדכון"]
          }
        ],
        lastUpdated: ""
      });
      modelUsed = "fallback-static";
    }

    let jsonStr = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    // Clean markdown and common LLM JSON syntax errors (trailing commas, control chars)
    jsonStr = jsonStr
      .replace(/```json|```/g, '')
      .replace(/,\s*([}\]])/g, '$1')
      .trim();

    const staticFallbackData = {
      news: [
        {
          id: "fallback-news-1",
          title: "עדכוני קולנוע חמים בדרך",
          summary: "אנו חווים עומס זמני בפניות לשרת ה-AI. המערכת תציג את החדשות המלאות מיד.",
          source: "MovieBook AI",
          date: "היום",
          sentiment: "neutral" as const,
          tags: ["מערכת", "עדכון"]
        }
      ],
      lastUpdated: getLiveHebrewTimestamp()
    };

    let rawData: any;
    try {
      rawData = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.warn("News Curator LLM returned malformed JSON, attempting sanitized recovery:", parseErr);
      try {
        // Remove raw newlines inside quotes if any
        const sanitized = jsonStr.replace(/(?<=:\s*"[^"]*)\n(?=[^"]*")/g, "\\n");
        rawData = JSON.parse(sanitized);
      } catch {
        console.error("Failed to parse News Curator JSON, falling back to static news data");
        rawData = staticFallbackData;
      }
    }

    rawData.lastUpdated = getLiveHebrewTimestamp();

    const outParseResult = NewsCuratorOutputSchema.safeParse(rawData);
    if (!outParseResult.success) {
      // Fallback to static news data if schema validation fails
      const fallbackResult: UnifiedResult = {
        success: true,
        data: staticFallbackData,
        model: "fallback-static-schema"
      };
      return NextResponse.json(fallbackResult);
    }

    const successResult: UnifiedResult = {
      success: true,
      data: outParseResult.data,
      model: modelUsed
    };

    newsCache = {
      data: outParseResult.data,
      timestamp: Date.now()
    };

    return NextResponse.json(successResult);

  } catch (err: any) {
    console.error("AI News Curator Error:", err);
    const errorResult: UnifiedResult = {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
    return NextResponse.json(errorResult, { status: 500 });
  }
}