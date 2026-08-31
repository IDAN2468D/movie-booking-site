---
name: receipt-print-animation
description: >-
  Generate and integrate animated receipt printer components, receipt roll-out CSS/Framer Motion animations, torn/cut paper receipt effects, and digital cinema ticket receipts in Next.js 15, React 19, Tailwind CSS, and Framer Motion. Built according to CineBook Liquid Glass 4.0 Pro UI design standards and native Hebrew RTL. Use when building receipt print animations, movie ticket confirmation cards, billing summaries, or torn paper UI effects.
license: MIT
---

# אנימציית מדפסת קבלות תרמית 120Hz GPU וקריעת נייר

מדריך ארכיטקטורה ומימוש למדפסת קבלות דיגיטליות, גלילת נייר תרמי, אפקט קריעה משוננת וכרטיסי אישור הזמנה עבור פלטפורמת CinePulse.

## עקרונות עיצוב ומימוש

1. **חריץ מדפסת מטאלי מוזהב:** הדמיית ראש הדפסה יוקרתי בתלת-ממד (`from-amber-600 via-yellow-500 to-amber-700`).
2. **אנימציית גלילה חלקה:** יציאת נייר מלמעלה למטה בפיזיקת Framer Motion עם ביצועי 120Hz GPU.
3. **קצה משונן (Torn Paper):** אפקט חיתוך משונן מבוסס CSS Polygon `clip-path`.
4. **תוכן קבלה מלא בעברית:** כותרת סרט, אולם, שורות מושבים, פירוט מוצרים, מע״מ 18% וברקוד אימות.

## דוגמאות שימוש

### דוגמה 1: אישור הזמנה עם הדפסת קבלה
המשתמש משלים תשלום על 2 כרטיסי קולנוע ופופקורן.
פעולות:
1. הפעלת אנימציית פליטת קבלה מחריץ ההדפסה.
2. הצגת רשימת המוצרים והסך הכולל בשקלים (`₪`).
3. אפשרות הדפסה מחדש (`printKey`) או שמירה כ-PDF.

## משאבים מצורפים

### סקריפטים
- `scripts/receipt_tax_calculator.py` - פירוק סכומי מע״מ 18% וחישוב שורות קבלה. הפעלה: `python scripts/receipt_tax_calculator.py --help`

### מסמכי ייחוס
- `references/receipt-printer-spec.md` - מפרט סכמות נתוני קבלה ומאפייני אנימציה.
