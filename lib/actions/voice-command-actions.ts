'use server';

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { VoiceCommandInputSchema, VoiceCommandAction } from '../validations/voice-command-schema';

const genAI = process.env.GOOGLE_AI_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY) : null;

const ROUTE_FALLBACKS: Array<{ keywords: string[]; targetUrl: string; replyHebrew: string }> = [
  { keywords: ['בית', 'ראשי', 'חזור', 'להתחלה', 'דף הבית'], targetUrl: '/', replyHebrew: 'מעביר אותך לעמוד הבית הראשי...' },
  { keywords: ['כרטיסים', 'כרטיס', 'הזמנות', 'סרטים שלי', 'הכרטיסים שלי'], targetUrl: '/tickets', replyHebrew: 'מציג את מועדון הכרטיסים השמורים שלך...' },
  { keywords: ['מועדפים', 'לייקים', 'שמרתי', 'אהבתי'], targetUrl: '/favorites', replyHebrew: 'פותח את רשימת הסרטים המועדפים שלך...' },
  { keywords: ['פרופיל', 'אזור אישי', 'חשבון', 'הגדרות', 'הפרופיל שלי'], targetUrl: '/profile', replyHebrew: 'מעביר לאזור הפרופיל האישי...' },
  { keywords: ['פסקול', 'פסקולים', 'מוזיקה', 'שיר', 'שירים'], targetUrl: '/soundtracks', replyHebrew: 'פותח את מחולל הפסקולים הנוירוני...' },
  { keywords: ['זוגי', 'מאץ', 'מאץ\'', 'קו אופ', 'קואופ', 'דייט', 'coop'], targetUrl: '/discover/coop', replyHebrew: 'מעביר ל-Co-op Matcher הזוגי...' },
  { keywords: ['גילוי', 'רגש', 'רגשות', 'חיפוש', 'סרטים'], targetUrl: '/discovery', replyHebrew: 'מעביר למערכת הגילוי הנוירונית לפי רגשות...' },
  { keywords: ['חזון', 'אודות', 'מי אנחנו'], targetUrl: '/vision', replyHebrew: 'מעביר לעמוד החזון הקולנועי...' },
  { keywords: ['בקרוב', 'סרטים חדשים', 'עתידי'], targetUrl: '/coming-soon', replyHebrew: 'פותח את עמוד הסרטים שיעלו בקרוב...' },
  { keywords: ['vip', 'וי אי פי', 'לאונג', 'ויאיפי'], targetUrl: '/vip', replyHebrew: 'מעביר למתחם היוקרה ה-VIP...' },
  { keywords: ['מזנון', 'פופקורן', 'אוכל', 'שתיה', 'שתייה', 'קולה', 'נאצוס'], targetUrl: '/food', replyHebrew: 'פותח את תפריט המזנון והכיבוד...' },
  { keywords: ['נקודות', 'מועדון', 'תגמולים', 'rewards'], targetUrl: '/rewards', replyHebrew: 'מעביר לאזור מועדון הלקוחות והתגמולים...' },
  { keywords: ['אולם', 'אולמות', 'קולנוע', 'מתחמים', 'סניפים'], targetUrl: '/cinema', replyHebrew: 'מציג את מפת האולמות והסניפים...' },
  { keywords: ['קונסיירז', 'אסיסטנט', 'עזר', 'עוזר קולי'], targetUrl: '/concierge', replyHebrew: 'מתחבר ל-AI Voice Concierge...' },
  { keywords: ['שאזאם', 'זיהוי שיר', 'shazam'], targetUrl: '/shazam', replyHebrew: 'פותח את מנגנון זיהוי השירים הקולנועי...' },
  { keywords: ['הישגים', 'גביעים', 'כספת', 'trophy'], targetUrl: '/trophy-vault', replyHebrew: 'פותח את כספת ההישגים הנוירונית...' },
  { keywords: ['חדשות', 'עדכונים', 'כתבות'], targetUrl: '/news', replyHebrew: 'מעביר לערוץ החדשות והעדכונים...' },
  { keywords: ['סיכום', 'wrapped', 'שנתי'], targetUrl: '/wrapped', replyHebrew: 'טוען את הסיכום הקולנועי השנתי...' },
  { keywords: ['ספלינטר', 'splinter'], targetUrl: '/splinter-demo', replyHebrew: 'מעביר לדמו Splinter 3D...' },
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

    // 1. Try Gemini AI classification if available
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
                targetUrl: { type: SchemaType.STRING, description: "The route path e.g. '/', '/tickets', '/profile', etc." },
                replyHebrew: { type: SchemaType.STRING, description: "A natural short Hebrew confirmation message" }
              },
              required: ['action', 'targetUrl', 'replyHebrew']
            }
          }
        });

        const prompt = `Match the spoken Hebrew command: "${text}" to one of these routes:
        '/' (Home), '/tickets', '/favorites', '/profile', '/soundtracks', '/discover/coop', '/discovery', '/vision', '/coming-soon', '/vip', '/food', '/rewards', '/cinema', '/concierge', '/shazam', '/trophy-vault', '/news', '/wrapped', '/splinter-demo', '/showcase'.
        Return JSON object with action, targetUrl, and enthusiastic short Hebrew replyHebrew.`;

        const result = await model.generateContent(prompt);
        const json = JSON.parse(result.response.text());
        if (json && json.targetUrl && json.action === 'navigate') {
          return {
            success: true,
            data: {
              action: 'navigate',
              targetUrl: json.targetUrl,
              replyHebrew: json.replyHebrew || 'מעביר אותך לעמוד המבוקש...'
            }
          };
        }
      } catch (aiErr) {
        console.warn('Gemini Voice Command classification fallback to static map:', aiErr);
      }
    }

    // 2. Static Keyword Fallback Map
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

