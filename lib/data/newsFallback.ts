import type { NewsArticle } from '@/lib/schemas/newsCurator';

export const CINEMA_IMAGES = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518676599602-2170e3d7597c?auto=format&fit=crop&w=800&q=80',
];

export const STATIC_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "news-1",
    title: "מנוע ה-Neural Discovery של CinePulse משיק גרסה 4.0",
    summary: "חוויית חיפוש רגשית חדשה המשלבת בועות תחושה, גלי קול 40Hz ועיצוב Liquid Glass עתידני.",
    source: "CinePulse Official",
    date: "היום",
    imageUrl: CINEMA_IMAGES[0],
    sentiment: "exciting",
    tags: ["CinePulse", "חדשנות", "AI"]
  },
  {
    id: "news-2",
    title: "שוברי הקופות הגדולים של 2026 נחשפים בטריילר עולמי",
    summary: "אולפני הוליווד מכריזים על גל סרטי מדע בדיוני ודרמות מתח תקציביות ענקיות עם אפקטים פורצי דרך.",
    source: "Variety",
    date: "היום",
    imageUrl: CINEMA_IMAGES[1],
    sentiment: "dramatic",
    tags: ["הוליווד", "טריילרים", "קולנוע"]
  },
  {
    id: "news-3",
    title: "מועדון ה-VIP Pulse מעניק כרטיסים במתנה לחברים פעילים",
    summary: "משתמשים שהשלימו את אתגר ה-Streak השבועי זוכים בשוברי VIP להקרנות בכורה באולמות לייזר.",
    source: "CinePulse VIP",
    date: "היום",
    imageUrl: CINEMA_IMAGES[2],
    sentiment: "exciting",
    tags: ["VIP", "הטבות", "CinePulse"]
  },
  {
    id: "news-4",
    title: "שמועות חמות: כריסטופר נולאן מפתח אפוס חלל חדש ב-70mm IMAX",
    summary: "דיווחים על פרויקט ענק שמצולם כולו במצלמות פילם 70 מ\"מ עם פסקול סימפוני תלת-ממדי.",
    source: "Hollywood Reporter",
    date: "אתמול",
    imageUrl: CINEMA_IMAGES[3],
    sentiment: "rumor",
    tags: ["נולאן", "IMAX", "סרטים"]
  },
  {
    id: "news-5",
    title: "תשלומי פיצול רב-מטבעיים חדשים הושקו ב-CinePulse",
    summary: "מעתה ניתן לשלב בקלות בין שקלים (ILS), מטבעות קריפטוגרפיים ונקודות VIP Pulse בהזמנה קבוצתית אחת.",
    source: "CinePulse Official",
    date: "היום",
    imageUrl: CINEMA_IMAGES[4],
    sentiment: "exciting",
    tags: ["CinePulse", "תשלומים", "פינטק"]
  },
  {
    id: "news-6",
    title: "פסטיבל הקולנוע הבינלאומי מכריז על רשימת הזוכים",
    summary: "סרט הדרמה העצמאי זכה בפרס דקל הזהב לאחר הקרנה מרהיבה ומחיאות כפיים סוערות של 12 דקות.",
    source: "CineNews",
    date: "היום",
    imageUrl: CINEMA_IMAGES[5],
    sentiment: "neutral",
    tags: ["פסטיבל", "פרסים"]
  },
  {
    id: "news-7",
    title: "חולית חלק 3 קיבל אור ירוק רשמי: הצילומים יחלו בשנה הבאה",
    summary: "הבמאי דני וילנב מאשר כי התסריט של 'משיח חולית' כמעט מושלם ושלב ההפקה ייפתח בקרוב.",
    source: "Deadline",
    date: "היום",
    imageUrl: CINEMA_IMAGES[6],
    sentiment: "exciting",
    tags: ["חולית", "מד״ב", "הוליווד"]
  },
  {
    id: "news-8",
    title: "אולמות הלייזר 4K IMAX מתרחבים ל-10 מתחמים נוספים בישראל",
    summary: "טכנולוגיית הקרנת לייזר כפולה עם מערכת סאונד 12 ערוצים מגיעה למתחמי הסינמה המובילים בארץ.",
    source: "כלכליסט קולנוע",
    date: "היום",
    imageUrl: CINEMA_IMAGES[7],
    sentiment: "exciting",
    tags: ["ישראל", "טכנולוגיה", "IMAX"]
  },
  {
    id: "news-9",
    title: "מנוע ה-CineDNA של CinePulse: מיפוי קשרים גנטיים בין סרטים",
    summary: "פיצ'ר חדש מאפשר לגלות קשרים נסתרים בין יצירות קולנועיות לפי סגנון צילום, מוטיבים ופסקול.",
    source: "CinePulse Labs",
    date: "היום",
    imageUrl: CINEMA_IMAGES[0],
    sentiment: "exciting",
    tags: ["CineDNA", "AI", "CinePulse"]
  },
  {
    id: "news-10",
    title: "חשיפה: גיבורי מארוול החדשים שיובילו את שלב 6 ב-MCU",
    summary: "נשיא מארוול קווין פייגי חושף את התוכניות להרחבת המולטיוורס בסרטי הנוקמים הבאים.",
    source: "Empire Magazine",
    date: "אתמול",
    imageUrl: CINEMA_IMAGES[1],
    sentiment: "dramatic",
    tags: ["מארוול", "MCU", "קומיקס"]
  },
  {
    id: "news-11",
    title: "דיוני Afterglow: טרקלין השיח מוגן הספוילרים מגיע לשיא פעילות",
    summary: "אלפי צופים מאומתים מדרגים סצנות שיא ומנפיקים קפסולות שברי זיכרון דיגיטליות לאחר הסרט.",
    source: "CinePulse Community",
    date: "היום",
    imageUrl: CINEMA_IMAGES[2],
    sentiment: "neutral",
    tags: ["קהילה", "קפסולות", "Afterglow"]
  },
  {
    id: "news-12",
    title: "פסקול השנה: הסימפוניה החדשה שסחפה מיליוני מאזינים ברשת",
    summary: "אלבום הפסקול הקולנועי שובר שיאי השמעות ב-Spotify וזוכה לשבחים מגדולי המבקרים בעולם.",
    source: "Billboard Cinema",
    date: "היום",
    imageUrl: CINEMA_IMAGES[3],
    sentiment: "exciting",
    tags: ["פסקול", "מוזיקה", "סאונד"]
  }
];
