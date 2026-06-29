---
type: skill
status: active
tags: [moviebook, neural-discovery, liquid-glass, nextjs15, server-actions, dynamic-filtering]
security_level: tier-1
version: 4.5
---

# 🧠 MOVIEBOOK NEURAL DISCOVERY & DYNAMIC SEARCH PIPELINE

This document serves as the official single source of truth (SSOT) and mathematical blueprint for engineering the advanced Neural Movie Discovery Page (`/discover/neural`) inside the MOVIEBOOK framework.

## 🛑 1. CONTEXT DIET & EXCLUDE BARRIERS
To preserve severe context economy and eliminate hallucinated runtime errors, the AI Agent must strictly obey these repository boundaries:
- **Absolute Search Bans:** Never scan or iterate internally through: `.next/`, `node_modules/`, or `.obsidian/`.
- **Modular Loadout:** Fetch configuration attributes exclusively through files registered inside `AI_Index.md`.

## ⚡ 2. DATA PIPELINE & BACKEND ATOMICITY
- **Zero REST Endpoints:** Dynamic AI filtering, state synchronization, and map queries must be powered 100% via Next.js 15 Server Actions (`"use server"`).
- **Atomic State Traversal:** Interacting with collections or history queries must leverage native MongoDB operators (`$addToSet`, `$pull`, `$inc`) via Mongoose.
- **HMR Compilation Safety:** All data layer wrappers must export using the formula: `(mongoose.models.NeuralDiscovery || mongoose.model('NeuralDiscovery', NeuralDiscoverySchema))`.

## 🎨 3. LIQUID GLASS 3.0 & NATIVE HEBREW RTL UX TOKENS
- **Aesthetic Stack:** Pure cinematic Obsidian background (`#05070B`), frost panels utilizing `backdrop-blur-xl bg-slate-900/30`, crystalline dividers (`border-white/10`), and pulsing cyber teal neon text shadows (`#00F0FF`).
- **100% Strict RTL Logical Utilities:** Banned physical orientation tokens: `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`. Use logical property replacements exclusively: `ps-`, `pe-`, `space-x-reverse`, `flex-row-reverse`, and `rtl:-translate-x-full`.
- **Typographic Shielding:** Render all Hebrew interfaces in `Assistant` or `Rubik` with `leading-relaxed` or a forced `py-1` container offset to completely shield character ascenders and descenders from bounding-box clipping.

## 🛠️ 4. PLATFORM FEATURES & ADVANCED HERO WIDGETS

### Widget A: AI Mood Engine & Variable Sliders (סינון מצב רוח ומדדים)
- Interactive grid badges mapping custom moods: Intense (אינטנסיבי ומהיר), Contemplative (מחשבתי ועתידני), Emotional (מרגש ואופטימי).
- Dual range input sliders built using a custom stylized frosted track to set micro-thresholds for Tension (מתח) and Pace (קצב) with instant state feedback.

### Widget B: Interactive Neural Relationship Graph Node (גרף קשרים נוירוני)
- Visual contextual graph dashboard showcasing thematic connectivity threads linking suggested titles to user history models.
- Interactive connection tokens mapped with proximity match indicators (e.g., "95% התאמה נוירונית") displaying dynamic correlation micro-copy.

### Widget C: Personalized Neural Playlist Row (אוספים שנוצרו עבורך)
- A dynamic vertical/horizontal Bento playlist wrapper (e.g., "מסעות קוסמיים", "תעלומות אפלות בעיר") tracking media items filtered by the underlying backend query logic.

## 🛑 5. HERMETIC VALIDATION GATES (src/lib/validations/neuralDiscover.ts)
- Outbound query matrices and slider adjustment events must pass through a strict Zod schema validation layout.
- **Native Hebrew Error Piping:** Errors must map directly into the view layout without translating steps in between:
  - Empty search input: `"חיפוש חופשי חייב להכיל לפחות 2 תווים או בחירת קטגוריית מצב רוח"`
  - Range overflow constraint: `"מדד המתח או הקצב שהוזן אינו חוקי"`

## 📋 6. ABSOLUTE AGENT QUALITY CHECKLIST
- [x] 0 REST route files constructed; everything communicates through verified Next.js 15 server mutations. ✅ 2026-06-29
- [x] 100% clean type verification pass completed using `npx tsc --noEmit`. ✅ 2026-06-29
- [x] Tailwind layout attributes completely devoid of standard directional padding, margin, or layout properties. ✅ 2026-06-29
- [x] Slider input ranges gracefully support optimized reactive visual re-renders via client-side states. ✅ 2026-06-29