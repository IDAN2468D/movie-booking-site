---
name: liquid-glass-ui
description: >-
  Liquid Glass 4.0 Pro glassmorphism styling, chromatic refraction borders, dark mode palettes, and 120Hz GPU animations. Use when user asks to design Liquid Glass UI, "zkuchit nozelet", "glassmorphism", "refraction", or create obsidian dark UI cards. Implements backdrop blur, chromatic glow, and zero-reflow transforms. Do NOT use for server-side SQL or database migrations.
license: MIT
---

# שפת עיצוב זכוכית נוזלת Liquid Glass 4.0 Pro

מדריך ארכיטקטורה ומימוש לשפת העיצוב Liquid Glass 4.0 Pro, רפרקציה כרומטית, גבולות זוהרים ואנימציות 120Hz GPU עבור CinePulse.

## עקרונות עיצוב

1. **שקיפות וטשטוש עמוק:** שילוב רקע אובסידיאן כהה (`#080A0F`) עם `backdrop-blur-3xl`.
2. **הילה כרומטית (Chromatic Glow):** הילות רדיאליות עדינות בצבעי ציאן, ענבר וסגול.
3. **ביצועי 120Hz ללא הבהובים:** שימוש ב-`transform-gpu` ואנימציות Framer Motion טהורות.

## משאבים מצורפים

### סקריפטים
- `scripts/glass_token_helper.py` - מחולל טוקנים ושילובי מחלקות Tailwind. הפעלה: `python scripts/glass_token_helper.py --help`

### מסמכי ייחוס
- `references/liquid-glass-tokens.md` - מפרט צבעים, דרגות טשטוש וצללים.
