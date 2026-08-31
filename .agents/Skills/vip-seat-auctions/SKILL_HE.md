---
name: vip-seat-auctions
description: >-
  Dynamic real-time last-minute VIP seat auctions with bid countdowns and MongoDB change streams. Use when user asks for "michraz moshavim", "vip auction", "bidding", "moshav acharon", or last-minute VIP screening auctions. Provides gavel strike sound effects, bid countdown timers, and HMAC verification. Do NOT use for standard fixed ticket booking (use cinedna-feature-suite instead).
license: MIT
---

# מכרזי מושבי VIP והצעות מחיר בזמן אמת

מדריך ארכיטקטורה ומימוש למכרזים חיים של מושבי VIP ברגע האחרון עם טיימרים חכמים, סינתוז מכת פטיש אקוסטית ונעילה אופטימית עבור CinePulse.

## הוראות ביצוע

### שלב 1: מחזור חיי המכרז וטיימר
ניהול מצבי מכרז: `upcoming` -> `active` -> `closing` (מתחת ל-60 שניות) -> `settled`.
הצעה המוגשת ב-30 השניות האחרונות מאריכה את המכרז אוטומטית ב-30 שניות נוספות (הגנה מפני צליפות רגע אחרון).

### שלב 2: סינתוז מכת פטיש ב-Web Audio API
השמעת מכת פטיש אקוסטית חדה בקבלת הצעה חדשה:
- צליל טרנזיאנט מהיר 120Hz + תהודת עץ בתדר 2400Hz.

### שלב 3: סכמות Zod ואבטחת נתונים
אימות קפיצת מחיר מינימלית (לפחות ₪10+ מעל ההצעה הגבוהה ביותר) ואימות משתמש עם NextAuth.

## דוגמאות שימוש

### דוגמה 1: הגשת הצעה למושב VIP
המשתמש אומר: "הגש הצעה של ₪85 על מושב VIP D4"
פעולות:
1. בדיקת ההצעה המובילה הנוכחית (₪75).
2. אימות עמידה במדרגת המחיר (₪10+).
3. עדכון יומן המכרז והשמעת צליל פטיש מרחבי.
תוצאה: ההצעה נרשמה בהצלחה והטיימר התעדכן.

## משאבים מצורפים

### סקריפטים
- `scripts/auction_bid_calculator.py` - חישוב מדרגות מחיר וחלונות הארכת זמן. הפעלה: `python scripts/auction_bid_calculator.py --help`

### מסמכי ייחוס
- `references/auction-bid-lifecycle.md` - מפרט מצבי מכרז וכללי הגנה.
