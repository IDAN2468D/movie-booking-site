---
name: neon-animated-card
description: >-
  Generate and integrate Next.js and Tailwind CSS neon animated card components with glowing borders and gradient animations. Use when creating React card components with rotating glowing borders or CSS hover glow effects in Next.js.
license: MIT
---

# כרטיסיית ניאון מונפשת ומוארת

מדריך ארכיטקטורה ומימוש לכרטיסיות ניאון זוהרות עם גבול מסתובב (`conic-gradient`) ואפקט ריחוף עבור CinePulse.

## עקרונות מימוש

1. **גבול מסתובב Conic Gradient:** סיבוב של 360 מעלות עם `conic-gradient` רב-גווני.
2. **חיתוך שוליים (Edge Clipping):** שכבה פנימית כהה המכסה את מרכז הגרדיאנט ומשאירה רק מסגרת של 2px זוהרת.
3. **אנימציית ריחוף ורפרקציה:** הגדלת קנה מידה עדינה (`scale-102`) ותוספת זוהר ב-Hover.

## משאבים מצורפים

### סקריפטים
- `scripts/neon_card_helper.py` - מחשב מהירויות סיבוב וזוהר. הפעלה: `python scripts/neon_card_helper.py --help`

### מסמכי ייחוס
- `references/neon-card-spec.md` - מפרט סגנונות Conic Gradient.
