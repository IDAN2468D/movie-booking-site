---
name: electric-border-effect
description: >-
  Generate and integrate animated electric glowing border effects, neon CSS card borders, and SVG background/gradient border highlights for UI cards.
license: MIT
---

# אפקט גבול חשמלי וניאון לכרטיסיות UI

מדריך ארכיטקטורה ומימוש למסגרות חשמליות זוהרות, מסגרות ניאון בתלת-ממד וכרטיסיות Liquid Glass 4.0 Pro עבור פלטפורמת CinePulse.

## עקרונות מימוש מרכזיים

1. **מסכת SVG כרומטית:** שימוש ב-SVG דינמי ו-`background-origin: content-box` עם ריפוד מדויק.
2. **זוהר מדורג (Drop Shadow Aura):** יצירת הילה באמצעות `shadow-[0_0_35px_rgba(...)]`.
3. **שכבת תוכן עליונה (z-index):** תוכן הכרטיסייה מוצב מעל הגבול החשמלי למניעת טשטוש טקסטים.

## משאבים מצורפים

### סקריפטים
- `scripts/electric_border_helper.py` - מחשב גדלי SVG ו-Padding למסגרת. הפעלה: `python scripts/electric_border_helper.py --help`

### מסמכי ייחוס
- `references/electric-border-spec.md` - מפרט סגנונות CSS ומסכות SVG.
