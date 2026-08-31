---
name: hebrew-rtl-copywriting
description: >-
  Hebrew RTL text alignment, Unicode RLM formatting, Outfit/Inter typography, and localized UI copywriting standards. Use when user asks for "ivrit", "hebrew copywriting", "RTL layout", "tikun ivrit", or writing Israeli movie UI text. Enforces right-to-left alignment, ILS currency formatting, and BiDi rules. Do NOT use for non-Hebrew localization.
license: MIT
---

# מנוע עברית RTL, קופירייטינג וטיפוגרפיה קולנועית

מדריך ארכיטקטורה ומימוש לכללי קופירייטינג ויישור טבעי לימין (RTL), שימוש בתווי יוניקוד RLM (`\u200F`), פריסת BiDi תקינה ומטבע שקלים (`₪`) עבור CinePulse.

## כללי יסוד לכתיבה בעברית

1. **עטיפת HTML והטמעת RLM:** כל הודעה ותשובת סוכן נעטפת ב-`<div dir="rtl" style="text-align: right; direction: rtl;">` וכל פסקה מתחילה ב-`\u200F`.
2. **ריווח לוגי ב-Tailwind:** שימוש ב-`ms-*` ו-`me-*` במקום `ml-*` ו-`mr-*` להתאמה אוטומטית של רכיבים.
3. **מיקום סמל המטבע:** סמל השקל מופיע תמיד לפני המספר (`₪45`).

## משאבים מצורפים

### סקריפטים
- `scripts/rtl_rlm_wrapper.py` - עוטף פסקאות בתווי RLM ובלוקי HTML. הפעלה: `python scripts/rtl_rlm_wrapper.py --help`

### מסמכי ייחוס
- `references/rtl-bidi-rules.md` - חוקי BiDi ושילוב אנגלית בתוך משפטים בעברית.
