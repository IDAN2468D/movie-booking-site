---
name: ai-curated-cinesnacks
description: >-
  AI movie vibe matching for popcorn combos, concession pairings, and luxury cinema dining. Use when user asks for "hazmanat popcorn", "miznon", "concession combo", "ochel bakolnoa", or food recommendations matched to movie genres. Provides calorie estimates, dietary tags, and smart snack bundles. Do NOT use for seat selection or booking tickets (use cinedna-feature-suite instead).
license: MIT
---

# מזנון קולנועי מותאם אישית ב-AI

מדריך ארכיטקטורה ומימוש של התאמת מוצרי מזנון, פופקורן גורמה ומשקאות לפי ז'אנר הסרט ומצב הרוח של הצופה עבור CinePulse.

## הוראות ביצוע

### שלב 1: ניתוח ז'אנר ומצב רוח
זיהוי ז'אנר הסרט, רמת האינטנסיביות ומשך ההקרנה להתאמת חבילת המזנון:
- אקשן / מד״ב: פופקורן מתובל חריף, נאצ'וס, משקאות אנרגיה מוגזים.
- דרמה / רומנטיקה: פופקורן כמהין, יין בוטיק ושוקולד איכותי.
- משפחה / אנימציה: פופקורן קרמל מתוק, סוכריות גומי וברד פירות.

### שלב 2: סכמות Zod ומחירים
אימות כל הזמנות המזנון בסכמות Zod קפדניות עם מחירים בשקלים (`₪`) כולל 18% מע״מ.

### שלב 3: ממשק מגש חכם Liquid Glass 4.0 Pro
הצגת המוצרים בכרטיסיות תלת-ממד, חישוב סך הכל בזמן אמת והוספה מהירה להזמנה.

## דוגמאות שימוש

### דוגמה 1: התאמת נשנושים לסרט מדע בדיוני
המשתמש שואל: "איזה נשנוש מתאים לחולית 2?"
פעולות:
1. זיהוי ז'אנר: מד״ב אפי (אורך 166 דק').
2. המלצה על קומבו פופקורן מתובל + משקה קר גדול.
3. חישוב הנחת מארז (15%-).
תוצאה: כרטיסיית המלצה חכמה להוספה בלחיצה אחת לסל.

## משאבים מצורפים

### סקריפטים
- `scripts/concession_calculator.py` - מחשבון הנחות קומבו וקלוריות. הפעלה: `python scripts/concession_calculator.py --help`

### מסמכי ייחוס
- `references/concession-pairing-matrix.md` - טבלת התאמות מלאה בין ז'אנר למוצרי מזנון.
