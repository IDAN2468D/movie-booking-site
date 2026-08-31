---
name: movie-site-stats
description: >-
  Analyzes and summarizes website statistics for a movie ordering or streaming site, surfacing key metrics like orders, popular titles, revenue, user retention, and conversion rates. Use when user asks to analyze movie site stats, "סטטיסטיקות אתר סרטים", "sstatistikot atar sratim", review orders, "הזמנות סרטים", "hazmana sratim", check site performance, or understand which movies are selling best. Accepts data from Google Analytics exports, custom CSV exports, or pasted dashboard numbers. Do NOT use for building a new movie site, processing payment transactions, or generating movie recommendations unrelated to order data.
license: MIT
---

# אנליטיקת הזמנות וסטטיסטיקות אתר סרטים

מדריך ארכיטקטורה ומימוש לניתוח ביצועים, דוחות הזמנות כרטיסים, פילוח הכנסות עם 18% מע״מ וחיזוי מגמות עבור מערכת ה-ERP של CinePulse.

## הוראות ביצוע

### שלב 1: איסוף וייבוא נתונים
תמיכה בקבצי CSV מ-Google Analytics 4, חשבונית ירוקה / iCount, או מסד הנתונים של ההזמנות.
- עמודות נדרשות: תאריך הזמנה, שם סרט, סכום בש״ח, מזהה משתמש, סטטוס הזמנה.

### שלב 2: נרמול וחישוב פיננסי
- הפחתת הזמנות שבוטלו או זוכו.
- חישוב מע״מ ישראלי (18%): `נטו = ברוטו / 1.18`.

### שלב 3: הפקת מדדי KPI ותובנות
- סך הכנסות (ברוטו ונטו).
- הסרטים הנמכרים ביותר (Top Grossing).
- אחוז שימור לקוחות (Retention Rate).
- רדאר אנומליות ודפוסי רכישה חריגים.

## דוגמאות שימוש

### דוגמה 1: ניתוח הכנסות חודשי
המשתמש מעלה קובץ הזמנות של חודש אוגוסט.
פעולות:
1. פריסת שורות והסרת עסקאות שבוטלו.
2. פילוח מע״מ ישראלי 18%.
3. זיהוי הסרט המוביל: "חולית: חלק 2" (64% מההכנסות).
תוצאה: דוח פיננסי מעוצב עם גרפי עמודות ומדדי שימור.

## משאבים מצורפים

### סקריפטים
- `scripts/movie_stats_calculator.py` - מחשב הכנסות, ממוצע להזמנה ומע״מ. הפעלה: `python scripts/movie_stats_calculator.py --help`

### מסמכי ייחוס
- `references/stats-kpi-definitions.md` - הגדרות מלאות למדדי המרת צופים ושימור.
