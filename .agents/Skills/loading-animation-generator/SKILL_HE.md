---
name: loading-animation-generator
description: >-
  Generate, recreate, and integrate high-performance GPU-accelerated CSS/SVG/React loading animations and accessible UI indicators. Use when creating animated UI loaders, converting loader designs or videos to code, or implementing high-performance web loading screens.
license: MIT
---

# מחולל אנימציות טעינה ואינדיקטורים 120Hz GPU

מדריך ארכיטקטורה ומימוש לאינדיקטורי טעינה קולנועיים בביצועי 120Hz GPU מלאים, ללא חסימת Thread וללא הבהובי פריסה (CLS) עבור CinePulse.

## 4 סוגי אינדיקטורים נתמכים

1. **`spinner`**: טבעת מסתובבת חלקה בעלת שובל זוהר מדורג.
2. **`orbit`**: חלקיקים נוירוניים המקיפים גרעין זוהר מרכזי.
3. **`pulse`**: פעימת הילה קולנועית להדמיית סאב-באס וחיפוש קולי.
4. **`dots`**: שלוש נקודות גליות בתזמון מדורג עבור טעינת טקסטים.

## דוגמאות שימוש

### דוגמה 1: שימוש ברכיב האחיד
```tsx
<LoadingIndicator variant="spinner" size={24} color="#FF9F0A" label="מפענח כרטיס..." />
```
