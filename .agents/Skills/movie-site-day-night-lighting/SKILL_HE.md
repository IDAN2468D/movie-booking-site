---
name: movie-site-day-night-lighting
description: >-
  Adds a dynamic day/night lighting theme feature to a movie booking site, switching the main screen background and UI colors based on time of day. Use when user asks to add day/night mode, time-based theme switching, "teurit yom lalayla", "shinu teurah", "mod layla", dynamic lighting, or adaptive UI colors to a movie booking homepage. Reads the GitHub repo at https://github.com/IDAN2468D/movie-booking-site and produces ready-to-integrate code for the main screen component. Do NOT use for full dark-mode toggles driven by user preference (use a manual toggle skill instead), and do NOT use for non-movie-booking projects without adapting the component paths.
license: MIT
---

# מנוע תאורה דינמית יום/לילה לפי שעות היממה

מדריך ארכיטקטורה ומימוש למנוע תאורת אווירה דינמית המשתנה בהתאם לשעון המקומי של המשתמש ב-4 רצועות יממה עבור פלטפורמת CinePulse.

## רצועות שעות יממה (שעון ישראל)

| רצועה | שעות | שם עברי | סגנון תאורה וצבעי אווירה |
| :--- | :--- | :--- | :--- |
| Dawn | 05:00 - 07:59 | שחר ובוקר מוקדם | גווני אפרסק, כתום חם וקרני שמש עדינות |
| Day | 08:00 - 17:59 | יום מלא | תאורה בוהקת, ניגודיות נקייה ואנרגיה גבוהה |
| Sunset | 18:00 - 20:59 | שקיעת זהב | גרדיאנט כתום-ארגמן וסגול עמוק |
| Night | 21:00 - 04:59 | לילה קולנועי | שחור אובסידיאן, ניאון ציאן וסגול עמוק |

## הוראות מימוש

### שלב 1: ה-Hook המרכזי `useDayNight`
בדיקת שעת המערכת כל 60 שניות ועדכון ה-Theme הפעיל ללא הבהובי מסך (FOUC).

### שלב 2: ספק התאורה הגלובלי `DayNightProvider`
הזרמת מחלקות CSS ל-`<html>` או ל-`<body>` עם משתני צבעים כרומטיים.

### שלב 3: כפתור החיווי `DayNightLightingPill`
הצגת אייקון שמש/ירח זוהר ב-TopBar המציג את השעה והמצב הפעיל בלחיצה.

## משאבים מצורפים

### סקריפטים
- `scripts/lighting_band_checker.py` - בודק שעות ומחזיר את רצועת התאורה המתאימה. הפעלה: `python scripts/lighting_band_checker.py --help`

### מסמכי ייחוס
- `references/lighting-bands-spec.md` - מפרט צבעי רקע וערכי Hex לכל רצועה.
