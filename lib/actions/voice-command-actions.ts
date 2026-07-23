'use server';

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { VoiceCommandInputSchema, VoiceCommandAction } from '../validations/voice-command-schema';

const genAI = process.env.GOOGLE_AI_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY) : null;

const ROUTE_FALLBACKS: Array<{ keywords: string[]; targetUrl: string; replyHebrew: string }> = [
  { keywords: ['פסקול', 'פסקולים', 'פסקול סרטים', 'פסקול סרט', 'מוזיקה של סרט', 'שירי סרטים', 'שיר סרט', 'מוזיקה', 'שיר', 'שירים'], targetUrl: '/soundtracks', replyHebrew: 'פותח את מחולל הפסקולים הנוירוני...' },
  { keywords: ['בית', 'ראשי', 'חזור', 'להתחלה', 'דף הבית', 'עמוד הבית'], targetUrl: '/', replyHebrew: 'מעביר אותך לעמוד הבית הראשי...' },
  { keywords: ['כרטיסים', 'כרטיס', 'הזמנות', 'הזמנות שלי', 'סרטים שלי', 'הכרטיסים שלי', 'כרטיסים שמורים'], targetUrl: '/tickets', replyHebrew: 'מציג את מועדון הכרטיסים השמורים שלך...' },
  { keywords: ['מועדפים', 'לייקים', 'שמרתי', 'אהבתי', 'רשימה שלי'], targetUrl: '/favorites', replyHebrew: 'פותח את רשימת הסרטים המועדפים שלך...' },
  { keywords: ['פרופיל', 'אזור אישי', 'חשבון', 'הגדרות', 'הפרופיל שלי', 'פרטים אישיים'], targetUrl: '/profile', replyHebrew: 'מעביר לאזור הפרופיל האישי...' },
  { keywords: ['זוגי', 'מאץ', 'מאץ\'', 'קו אופ', 'קואופ', 'דייט', 'coop', 'זוגות'], targetUrl: '/discover/coop', replyHebrew: 'מעביר ל-Co-op Matcher הזוגי...' },
  { keywords: ['גילוי', 'רגש', 'רגשות', 'חיפוש סרטים', 'גילוי סרטים', 'חיפוש', 'לפי רגש'], targetUrl: '/discovery', replyHebrew: 'מעביר למערכת הגילוי הנוירונית לפי רגשות...' },
  { keywords: ['חזון', 'אודות', 'מי אנחנו', 'אודות האתר'], targetUrl: '/vision', replyHebrew: 'מעביר לעמוד החזון הקולנועי...' },
  { keywords: ['בקרוב', 'סרטים חדשים', 'עתידי', 'בקרוב בקולנוע'], targetUrl: '/coming-soon', replyHebrew: 'פותח את עמוד הסרטים שיעלו בקרוב...' },
  { keywords: ['vip', 'וי אי פי', 'לאונג', 'ויאיפי', 'מתחם יוקרה'], targetUrl: '/vip', replyHebrew: 'מעביר למתחם היוקרה ה-VIP...' },
  { keywords: ['מזנון', 'פופקורן', 'אוכל', 'שתיה', 'שתייה', 'קולה', 'נאצוס', 'כיבוד'], targetUrl: '/food', replyHebrew: 'פותח את תפריט המזנון והכיבוד...' },
  { keywords: ['נקודות', 'מועדון', 'תגמולים', 'rewards', 'הטבות'], targetUrl: '/rewards', replyHebrew: 'מעביר לאזור מועדון הלקוחות והתגמולים...' },
  { keywords: ['אולם', 'אולמות', 'קולנוע', 'מתחמים', 'סניפים', 'סניף'], targetUrl: '/cinema', replyHebrew: 'מציג את מפת האולמות והסניפים...' },
  { keywords: ['קונסיירז', 'אסיסטנט', 'עזר', 'עוזר קולי', 'עוזר'], targetUrl: '/concierge', replyHebrew: 'מתחבר ל-AI Voice Concierge...' },
  { keywords: ['שאזאם', 'זיהוי שיר', 'shazam', 'זיהוי מוזיקה'], targetUrl: '/shazam', replyHebrew: 'פותח את מנגנון זיהוי השירים הקולנועי...' },
  { keywords: ['הישגים', 'גביעים', 'כספת', 'trophy', 'גביע'], targetUrl: '/trophy-vault', replyHebrew: 'פותח את כספת ההישגים הנוירונית...' },
  { keywords: ['חדשות', 'עדכונים', 'כתבות', 'חדשות קולנוע'], targetUrl: '/news', replyHebrew: 'מעביר לערוץ החדשות והעדכונים...' },
  { keywords: ['סיכום', 'wrapped', 'שנתי', 'סיכום שנה'], targetUrl: '/wrapped', replyHebrew: 'טוען את הסיכום הקולנועי השנתי...' },
  { keywords: ['ספלינטר', 'splinter', '3d demo'], targetUrl: '/splinter-demo', replyHebrew: 'מעביר לדמו Splinter 3D...' },
  { keywords: ['ראווה', 'שואוקייס', 'showcase'], targetUrl: '/showcase', replyHebrew: 'מעביר לעמוד ה-Showcase הקולנועי...' },
];

export async function processVoiceCommand(input: { transcript: string; locale?: string }): Promise<{
  success: boolean;
  data?: VoiceCommandAction;
  error?: string;
}> {
  try {
    const parsed = VoiceCommandInputSchema.parse(input);
    const text = parsed.transcript.trim().toLowerCase();

    // 1. Static Keyword Matching first for high precision
    for (const entry of ROUTE_FALLBACKS) {
      if (entry.keywords.some((kw) => text.includes(kw))) {
        return {
          success: true,
          data: {
            action: 'navigate',
            targetUrl: entry.targetUrl,
            replyHebrew: entry.replyHebrew
          }
        };
      }
    }

    // 2. Try Gemini AI classification for complex phrasing if available
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: SchemaType.OBJECT,
              properties: {
                action: { type: SchemaType.STRING, description: "Must be 'navigate', 'search', or 'unknown'" },
                targetUrl: { type: SchemaType.STRING, description: "The route path e.g. '/', '/soundtracks', '/tickets', '/profile', etc." },
                replyHebrew: { type: SchemaType.STRING, description: "A natural short Hebrew confirmation message" }
              },
              required: ['action', 'targetUrl', 'replyHebrew']
            }
          }
        });

        const prompt = `You are a Hebrew Voice Navigation AI for a cinema site.
        Spoken phrase: "${text}"
        
        Rules:
        - If phrase contains 'פסקול', 'פסקולים', 'פסקול סרטים', 'מוזיקה', 'שיר' -> targetUrl='/soundtracks', action='navigate'.
        - If phrase contains 'כרטיסים', 'הזמנות' -> targetUrl='/tickets', action='navigate'.
        - If phrase contains 'פרופיל', 'חשבון' -> targetUrl='/profile', action='navigate'.
        - Match to valid routes: '/', '/tickets', '/favorites', '/profile', '/soundtracks', '/discover/coop', '/discovery', '/vision', '/coming-soon', '/vip', '/food', '/rewards', '/cinema', '/concierge', '/shazam', '/trophy-vault', '/news', '/wrapped', '/splinter-demo', '/showcase'.
        
        Return JSON with action, targetUrl, replyHebrew.`;

        const result = await model.generateContent(prompt);
        const json = JSON.parse(result.response.text());
        if (json && json.targetUrl) {
          return {
            success: true,
            data: {
              action: json.action === 'search' ? 'search' : 'navigate',
              targetUrl: json.targetUrl,
              replyHebrew: json.replyHebrew || 'מעביר אותך לעמוד המבוקש...'
            }
          };
        }
      } catch (aiErr) {
        console.warn('Gemini Voice Command classification error:', aiErr);
      }
    }

    // 3. Fallback Search action
    return {
      success: true,
      data: {
        action: 'search',
        query: parsed.transcript,
        targetUrl: `/discovery?q=${encodeURIComponent(parsed.transcript)}`,
        replyHebrew: `מחפש סרטים ואירועים תואמים ל: "${parsed.transcript}"`
      }
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Voice command processing failure';
    return { success: false, error: msg };
  }
}


