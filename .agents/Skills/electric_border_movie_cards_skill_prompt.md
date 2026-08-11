# Electric Border Effect — Skill & Agent Prompt Bundle

---

## Part 1: SKILL.md

\---

name: electric-border-effect

description: Generate and integrate animated electric glowing border effects, neon CSS card borders, and SVG/gradient border highlights for UI cards, movie cards, and component frames.

\---

# Electric Border Effect

Generate high-performance, responsive electric glowing borders and neon animated card highlights in CSS, Tailwind CSS, and React/Next.js.

## Core Implementation Pattern (CSS)

.electric-movie-card {

  position: relative;

  background: \#090507;

  border-radius: 24px;

  overflow: hidden;

  padding: 2px;

  transition: transform 0.3s ease, box-shadow 0.3s ease;

}

.electric-movie-card::before {

  content: '';

  position: absolute;

  inset: \-50%;

  background: conic-gradient(

    from 0deg,

    transparent 0deg,

    transparent 280deg,

    \#ff4500 320deg,

    \#ff8800 340deg,

    \#ff0055 360deg

  );

  animation: rotate-electric-border 4s linear infinite;

  z-index: 0;

}

.electric-card-inner {

  position: relative;

  background: \#11090d;

  border-radius: 22px;

  z-index: 1;

  padding: 24px;

}

@keyframes rotate-electric-border {

  to {

    transform: rotate(360deg);

  }

}

## React Component Pattern

export const ElectricMovieCard \= ({ title, genreText, seats, time, badge \= 'איימקס' }) \=\> (

  \<div className="electric-movie-card w-full text-right" dir="rtl"\>

    \<div className="electric-card-inner flex flex-col gap-4"\>

      {/\* Header & Content \*/}

    \</div\>

  \</div\>

);

## Guidelines

- Ensure outer container uses `position: relative` and `overflow: hidden`.  
- Keep inner card `z-index` higher than pseudo-elements.  
- Hardware-accelerate rotation using CSS `transform`.

---

## Part 2: PROMPT.md (פרומפט להעתקה לסוכן)

# פרומפט להעתקה לסוכן: אפקט גבול חשמלי לכרטיסיות MovieBook

אמפלמנט עבורי את אפקט הגבול החשמלי המואר (Electric Border Effect) בכרטיסיות הסרטים במערכת לפי המפרט הבא:

## 1\. מבנה ה-CSS והגבול החשמלי

- **Wrapper חיצוני**: קונטיינר במיקום יחסי (`position: relative`), פינות מעוגלות (`border-radius: 24px`), `overflow: hidden` ו-padding של 2 פיקסלים.  
- **אפקט האנימציה המסתובב**: אלמנט פיקטיבי (`::before`) עם דירוג צבעים היקפי (`conic-gradient` בגווני אדום-כתום ניאון `#ff4500`, `#ff8800`, `#ff0055`) המסתובב ברצף.  
- **הילת ניאון היקפית**: הילת מראה היקפית (`box-shadow: 0 0 20px rgba(255, 69, 0, 0.35)`).

## 2\. התוכן הפנימי של כרטיסיית MovieBook

- **רקע כהה פנימי**: אלמנט פנימי בערך `z-index: 1` ורקע כהה (`#11090d`).  
- **רכיבי הכרטיסייה**:  
  1. **כותרת עליונה**: אייקון כרטיס מימין ותגית פורמט (כגון "איימקס" בכתום).  
  2. **תוכן**: שם הסרט ("סופרגירל", "ספיידרמן") בטקסט לבן מודגש ותגית התאמה אישית ("מתאים לאהבה שלך ל-פעולה, מדע בדיוני").  
  3. **זמני הקרנה**: קופסה כהה עם אייקון שעון, מספר מושבים נותרים ושעת הקרנה.  
  4. **כפתור CTA**: כפתור מנוי כהה עם מסגרת וטקסט "חינם עם מנוי ה-MovieBook שלך".

