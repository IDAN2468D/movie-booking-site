"use server";

import {
  FetchCommentaryQuerySchema,
  CommentaryTrack,
  CommentaryPersona,
} from "@/lib/schemas/directorsCut.schema";
import { getMovieDetails } from "@/lib/tmdb";

const PERSONA_METADATA: Record<
  CommentaryPersona,
  { titleHebrew: string; narrator: string; desc: string }
> = {
  director: {
    titleHebrew: "חזון הבמאי ותפיסת סצנות",
    narrator: "קול הבמאי הראשי (AI Audio Engine)",
    desc: "ניתוח עומק של ההחלטות הדרמטיות, בימוי השחקנים ומטאפורות נסתרות.",
  },
  cinematographer: {
    titleHebrew: "סודות הצילום והתאורה האנמורפית",
    narrator: "מנהל הצילום והתאורה (DP Voice)",
    desc: "הסברים על בחירת עדשות, תנועות מצלמה, זוויות צילום ופלטת צבעים.",
  },
  critic: {
    titleHebrew: "ניתוח ביקורתי ומשמעויות פסיכולוגיות",
    narrator: "חוקר ומבקר קולנוע בכיר",
    desc: "פירוק המבנה הנרטיבי, ארכיטיפים קלאסיים והשוואה ליצירות מופת.",
  },
  easter_egg_hunter: {
    titleHebrew: "צייד ה-Easter Eggs והרמזים המטרימים",
    narrator: "מומחה פרטי יקום קולנועי",
    desc: "חשיפת רמזים סודיים ברקע, קריצות לסרטי עבר ומוטיבים נסתרים בפריימים.",
  },
};

function buildSegments(movieTitle: string, persona: CommentaryPersona) {
  if (persona === "cinematographer") {
    return [
      {
        id: "seg-c1",
        timestampSec: 15,
        sceneName: "שוט הפתיחה המרחבי",
        headline: "שימוש בעדשת 35mm אנמורפית לתחושת בדידות",
        commentaryText: `בסרט ${movieTitle}, בחרנו לפתוח בעדשה רחבה במיוחד כדי להדגיש את המרחק הרגשי של הדמות הראשית מהסביבה.`,
        triviaTag: "Cinematography 65mm",
        acousticFocus: "spatial" as const,
      },
      {
        id: "seg-c2",
        timestampSec: 75,
        sceneName: "העימות בחדר המראות",
        headline: "תאורת Low-Key וניגודיות צבעים קרים",
        commentaryText: "הניגוד בין כחול עמוק לזהב חם מדגיש את הקונפליקט הפנימי של הגיבור ברגע ההכרעה.",
        triviaTag: "Color Grading",
        acousticFocus: "orchestral" as const,
      },
    ];
  }

  if (persona === "easter_egg_hunter") {
    return [
      {
        id: "seg-e1",
        timestampSec: 30,
        sceneName: "המפגש הראשון בלובי",
        headline: "רמז מטריג לסוף המערכה השלישית בציור הרקע",
        commentaryText: "שימו לב לתמונה התלויה משמאל לדלת - היא מסמלת את הסוף המפתיע עוד לפני שהתחיל!",
        triviaTag: "Secret Easter Egg",
        acousticFocus: "spatial" as const,
      },
      {
        id: "seg-e2",
        timestampSec: 90,
        sceneName: "שיחת הטלפון המסתורית",
        headline: "המספר שעל המסך הוא מחווה לסרט הקלאסי",
        commentaryText: "המספר המופיע על הצג מכיל קריצה ישירה ליצירת המופת המקורית משנות ה-80.",
        triviaTag: "Hidden Homage",
        acousticFocus: "dialogue" as const,
      },
    ];
  }

  return [
    {
      id: "seg-d1",
      timestampSec: 10,
      sceneName: "אקספוזיציה והיכרות",
      headline: "כתיבת הדמות והעוגן הרגשי הראשוני",
      commentaryText: `כשיצרנו את ${movieTitle}, המטרה הייתה לגרום לצופה להרגיש את כובד המשקל כבר מהנשימה הראשונה.`,
      triviaTag: "Director's Vision",
      acousticFocus: "sub_bass" as const,
    },
    {
      id: "seg-d2",
      timestampSec: 60,
      sceneName: "נקודת המפנה והשיא הדרמטי",
      headline: "אימפרוביזציה של השחקנים שנכנסה לגרסה הסופית",
      commentaryText: "השתיקה המתוחה בסצנה הזו לא הייתה בתסריט המקורי - השחקנים יצרו אותה ספונטנית בטייק הרביעי.",
      triviaTag: "Behind the Scenes",
      acousticFocus: "dialogue" as const,
    },
  ];
}

export async function fetchDirectorsCutCommentary(
  input: unknown
): Promise<{ success: boolean; data?: CommentaryTrack; error?: string }> {
  try {
    const parsed = FetchCommentaryQuerySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "שאילתה לא תקינה לרצועת פרשנות" };
    }

    const { movieId, persona } = parsed.data;
    let movieTitle = "סרט נבחר";

    const numericId = parseInt(movieId, 10);
    if (!isNaN(numericId) && numericId > 0) {
      try {
        const details = await getMovieDetails(numericId);
        if (details?.title) movieTitle = details.title;
      } catch {
        // use fallback
      }
    }

    const meta = PERSONA_METADATA[persona] || PERSONA_METADATA.director;
    const segments = buildSegments(movieTitle, persona);

    return {
      success: true,
      data: {
        id: `track-${movieId}-${persona}`,
        movieId,
        movieTitle,
        persona,
        personaTitleHebrew: meta.titleHebrew,
        narratorName: meta.narrator,
        description: meta.desc,
        segments,
      },
    };
  } catch {
    return { success: false, error: "שגיאה ביצירת ערוץ פרשנות במאי" };
  }
}
