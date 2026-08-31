---
name: post-movie-spoiler-lounge
description: >-
  Post-screening digital memory shard vault and spoiler-free discussion lounge. Use when user asks for "spoiler lounge", "homer leachar hakrana", "sikhei sratim", "diyon sratim", or afterglow discussions. Provides spoiler blur masks, verified ticket attendee badges, and quote soundwaves. Do NOT use for active live booking or seat maps (use cinedna-feature-suite instead).
license: MIT
---

# מתחם שיח ודיון מוגן ספוילרים לאחר הקרנה

מדריך ארכיטקטורה ומימוש למתחם שיח קהילתי לאחר ההקרנה, הגנת ספוילרים חכמה ואימות צופים עבור פלטפורמת CinePulse.

## הוראות ביצוע

### שלב 1: מיסוך ספוילרים ואימות כרטיסים
טשטוש הודעות המכילות תפניות עלילה ודרישת אישור ידני מהמשתמש לחשיפה:
- תג צופה מאומת לצד משתמשים שרכשו כרטיס להקרנה.
- מתג הגנת ספוילרים גלובלי.

### שלב 2: תגובות אמוג'י ומדדי תהודה
מתן אפשרות לצופים להצביע על סצנות מפתח, עוצמה רגשית והפסקול המועדף.

### שלב 3: הנפקת שברי ציטוטים קוליים
חיבור למערכת קפסולות הזיכרון (Memory Capsules) להנפקת גלי קול מציטוטים בלתי נשכחים.

## דוגמאות שימוש

### דוגמה 1: הצטרפות לדיון לאחר סרט
המשתמש מבקש: "פתח את מתחם הדיונים על חולית 2"
פעולות:
1. טעינת טרקלין Afterglow לסרט `693134`.
2. הפעלת מגן ספוילרים על ניתוחי הסוף.
3. הצגת דירוגי קהילה מאומתים.
תוצאה: מתחם דיונים בטוח מספוילרים.

## משאבים מצורפים

### סקריפטים
- `scripts/spoiler_analyzer.py` - זיהוי מילות מפתח בעייתיות וחישוב סיכון ספוילר. הפעלה: `python scripts/spoiler_analyzer.py --help`

### מסמכי ייחוס
- `references/spoiler-guard-protocol.md` - פרוטוקול סינון ספוילרים ואימות צופים.
