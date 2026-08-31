---
name: actor-biography-engine
description: >-
  Interactive actor profile, filmography timeline, AI-narrated audio biographies, and biometric fan badges. Use when user asks to explore actor profiles, "biografia shel sachkan", "filmgrafia", "kol sachkan", or inspect cast details. Provides TMDB filmography, emotion graphs, and Web Speech narration. Do NOT use for movie showtimes or ticket booking (use cinedna-feature-suite instead).
license: MIT
---

# מנוע ביוגרפיית שחקנים ופילמוגרפיה קולנועית

מדריך מקיף לבנייה והטמעה של פרופילי שחקנים אקוסטיים, פילמוגרפיית TMDB אינטראקטיבית, ניתוח רגשי של דמויות וכרטיסי מעריצים ביומטריים.

## הוראות ביצוע

### שלב 1: שליפת נתוני שחקן מ-TMDB
קבלת ביוגרפיה ורשימת סרטים מ-TMDB API:
- ביוגרפיה בסיסית: `/person/{person_id}`
- סרטים וקרדיטים: `/person/{person_id}/combined_credits`
- תמונות פרופיל: `getImageUrl(profile_path, 'h632')`

### שלב 2: יצירת קריינות AI וגרף רגשות
שימוש ב-Gemini AI (`gemini-3.5-flash-lite`) לסיכום מסלול הקריירה, תפקידים איקוניים ומנעד רגשי.
פילוח אבני הדרך הכרונולוגיות וארכיטיפ הדמות.

### שלב 3: סינתוז דיבור ושמע מרחבי
הפעלת `window.speechSynthesis` בעברית (`he-IL`) בשילוב תדרי רקע קולנועיים ב-Web Audio API:
- `SpeechSynthesisUtterance` עם קצב `0.95` וגובה צליל `1.0`.
- אקורד רקע בתדר 432Hz.

## דוגמאות שימוש

### דוגמה 1: סקירת פרופיל שחקן
המשתמש מבקש: "הצג לי את הביוגרפיה והסרטים של טימותי שאלאמה"
פעולות:
1. שליפת נתוני שחקן מ-TMDB עבור מזהה `1190668`.
2. רינדור קרוסלת פילמוגרפיה לפי שנת שחרור.
3. כפתור 1-Click להשמעת קריינות קולית חיה.
תוצאה: כרטיס שחקן בעיצוב Liquid Glass עם קריינות שמע.

## משאבים מצורפים

### סקריפטים
- `scripts/actor_bio_helper.py` - סידור ועיבוד נתוני פילמוגרפיה. הפעלה: `python scripts/actor_bio_helper.py --help`

### מסמכי ייחוס
- `references/actor-filmography-spec.md` - מפרט סכמות ורכיבי תצוגה.
- `references/actor-audio-narration.md` - הגדרות מנוע דיבור וסאונד.
