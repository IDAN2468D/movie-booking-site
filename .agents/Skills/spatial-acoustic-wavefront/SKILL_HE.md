---
name: spatial-acoustic-wavefront
description: >-
  Web Audio API 3D spatial acoustics, 35Hz-50Hz sub-bass sound synthesis, StereoPanner, and haptic vibration sync. Use when user asks for "spatial audio", "akustika 3D", "sub-bass", "haptic feedback", "shmea merchavi", or seat sound previews. Implements Binaural HRTF panners, lowpass filters, and haptic vibration. Do NOT use for concession or ticket pricing (use cinedna-feature-suite instead).
license: MIT
---

# מנוע שמע מרחבי תלת-ממדי וסאב-באס

מדריך ארכיטקטורה ומימוש של שמע מרחבי (Web Audio API), סינתוז סאב-באס 35Hz-50Hz ומשוב הפטי מסונכרן עבור פלטפורמת CinePulse.

## הוראות ביצוע

### שלב 1: אתחול AudioContext ומחווה
יש לאתחל או להחזיר לפעולה (`.resume()`) את ה-`AudioContext` תמיד מתוך אירוע לחיצה או מגע ישיר של המשתמש.

### שלב 2: ניתוב רשת הצמתים האקוסטית
חיבור צמתי האודיו בשרשרת:
- מתנד ראשי (`OscillatorNode`) -> מסנן תדרים (`BiquadFilterNode`) -> פנר מרחבי (`PannerNode` בשיטת HRTF) -> מגבר עוצמה (`GainNode`) -> יעד שמע (`Destination`).
- ערוץ מקביל של מתנד סינוס 35Hz-50Hz עבור הדמיית סאבוופר.

### שלב 3: סנכרון רטט הפטי
הפעלת `navigator.vibrate([40, 60, 80])` בשיאי באס או מעברי מושבים מרחביים במכשירים תומכים.

## דוגמאות שימוש

### דוגמה 1: הדמיית שמע למושב VIP
המשתמש מבקש: "השמע לי את הסאונד במושב VIP שורה D"
פעולות:
1. אתחול AudioContext בתדר בסיס 432Hz.
2. הגדרת מיקום פנר מרחבי (מרכז האולם).
3. סינתוז גל באס 42Hz בעוצמת 0.35.
תוצאה: צליל היקפי תלת-ממדי עמוק עם רטט הפטי קל.

## משאבים מצורפים

### סקריפטים
- `scripts/frequency_synthesizer.py` - חישוב נקודות חיתוך למסנני תדרים. הפעלה: `python scripts/frequency_synthesizer.py --help`

### מסמכי ייחוס
- `references/webaudio-node-spec.md` - מפרט טכני מלא לצמתי Web Audio.
