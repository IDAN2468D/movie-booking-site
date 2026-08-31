---
name: cinedna-feature-suite
description: >-
  Architect, design, and implement next-generation cinema platform features including CineDNA Graph Explorer, Acoustic Sweet-Spot 3D Simulator, CineSquad Smart Split, Director's Cut Audio AI, and Post-Show Memory Capsules. Use when building or extending movie platform features, spec-first architecture, Web Audio spatialization, or Liquid Glass 4.0 Pro UI components.
license: MIT
---

# סוויטת הפיצ'רים CineDNA וארכיטקטורת קולנוע מהדור הבא

מדריך טכני והנחיות מימוש לחבילת הפיצ'רים הקולנועית CineDNA שנבנתה עבור Next.js 15, React 19, עיצוב Liquid Glass 4.0 Pro, מנוע Web Audio API ומסד נתונים MongoDB.

## מתי להשתמש

- כאשר מממשים או מרחיבים את חוקר הגנום הקולנועי (CineDNA Graph Explorer).
- כאשר מפתחים סימולטור שמע מרחבי תלת-ממדי (Acoustic Sweet-Spot Simulator).
- כאשר בונים חדר הזמנה קבוצתי מסונכרן בזמן אמת ופיצול תשלומים (CineSquad Smart Split & Sync).
- כאשר מטמיעים קריינות אודיו ופרשנות במאי מונעת בינה מלאכותית (Director's Cut Audio Companion).
- כאשר מנפיקים שברי זיכרון דיגיטליים אספניים לאחר הקרנה (Post-Show Memory Capsules).

## עקרונות ארכיטקטורה מרכזיים

1. **פיתוח מונחה מפרט (SDD):**
   - כל פיצ'ר מתחיל בסכמת Zod אטומה.
   - הפרדה מוחלטת בין מצב לקוח (Zustand) למוטציות שרת (Next.js Server Actions).
   - אפס חשיפה ישירה של מסד הנתונים לצד הלקוח.

2. **שפת עיצוב Liquid Glass 4.0 Pro:**
   - שימוש ב-`backdrop-blur-2xl`, מסגרות כרומטיות זוהרות ואנימציות 120Hz GPU.
   - פריסת RTL עברית טבעית (`dir="rtl"`) ומטבע שקלים (`₪`).

3. **שמע מרחבי Web Audio API:**
   - עיבוד אודיו בינאורלי תלת-ממדי באמצעות `PannerNode`, `BiquadFilterNode` ו-`GainNode`.
   - סינתוז סאב-באס 35Hz-50Hz ומשוב הפטי מסונכרן.

## פירוט רכיבים ומדריכים

- **CineDNA Graph Explorer:** עיין ב-`references/spec-cinedna-graph.md` למפרט הסכמות ומבנה הצמתים.
- **Acoustic Sweet-Spot Simulator:** עיין ב-`references/spec-acoustic-sweetspot.md` לחישובי פרופיל אקוסטי באולם.
- **CineSquad Smart Split & Sync:** עיין ב-`references/spec-cinesquad-sync.md` לאלגוריתמי סנכרון ופיצול חשבונות.
- **Director's Cut Audio Commentary:** עיין ב-`references/spec-directors-cut.md` לערוצי פרשנות מונעי Gemini.
- **Post-Show Memory Capsule:** עיין ב-`references/spec-memory-capsule.md` ללוגיקת הנפקת שברי זיכרון אספניים.

## משאבים מצורפים

### סקריפטים
- `scripts/cinedna_calculator.py` - כלי לחישוב מדדי התאמה גנטית וציון אקוסטי. הפעלה: `python scripts/cinedna_calculator.py --help`

### מסמכי ייחוס
- `references/spec-cinedna-graph.md` - מפרט סכמות Zod עבור גרף הגנום.
- `references/spec-acoustic-sweetspot.md` - מפרט צמתי Web Audio ודירוג Sweet Spot.
- `references/spec-cinesquad-sync.md` - מפרט חדרי סקוואד ופיצול תשלומים.
- `references/spec-directors-cut.md` - מפרט ערוצי פרשנות מולטימדיה.
- `references/spec-memory-capsule.md` - מפרט שברי זיכרון ורמות נדירות.
