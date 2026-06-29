---
type: skill
status: active
tags: [moviebook, cast-profile, biography, liquid-glass, nextjs15, server-actions]
security_level: tier-1
version: 5.0
---

# 🎭 MOVIEBOOK INTERACTIVE CAST BIOGRAPHY ENGINE

This document serves as the official single source of truth (SSOT) and structural blueprint for engineering the premium Actor Biography & Cast Matrix layer inside the movie details workspace (`/movies/[id]`).

## 🛑 1. CONTEXT DIET & EXCLUDE BARRIERS
To preserve severe token context efficiency and eliminate recursive scanning loops, the AI Agent must strictly obey these repository boundaries:
- **Absolute Search Bans:** Never scan or traverse internally inside: `.next/`, `node_modules/`, or `.obsidian/`.
- **Modular Ingestion:** Load only the files explicitly defined inside `AI_Index.md` instead of guessing layout paths.

## ⚡ 2. DATABASE INTEGRATION & MODEL SAFETY
- **Zero REST Endpoints:** Exposing standalone `route.ts` API paths for fetching bio details is strictly prohibited. Communication relies 100% on Next.js 15 Server Actions (`"use server"`).
- **Mongoose Reference Integration:** Cast details must be stored either as an optimized nested schema array within the existing `Movie` model or via a referenced `Actor` collection.
- **HMR Overwrite Safeguard:** Export the database architecture utilizing the hot-reload protection wrapper: `(mongoose.models.Actor || mongoose.model('Actor', ActorSchema))`.

## 🎨 3. LIQUID GLASS 3.0 & NATIVE HEBREW RTL UX TOKENS
- **Aesthetic Tone:** Deep obsidian workspace canvas (`#05070B`). The actor profile card container must leverage premium crystalline properties: `backdrop-blur-xl bg-slate-900/40 border border-white/10`.
- **Interactive Bio Drawer:** Clicking an actor triggers a full-height bottom or side slide-drawer sheet using a frosted glass look, complete with high-end glowing golden accents (`#FFB800`) for top-billed or trending star indicators.
- **100% Strict RTL Logical Utilities:** Banned physical orientation layout tags: `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`. Use logical properties exclusively: `ps-`, `pe-`, `space-x-reverse`, and `flex-row-reverse`.
- **Typographic Shielding:** Render all Hebrew profile strings in `Assistant` or `Rubik` fonts with `leading-relaxed` parameters to prevent vertical letter-clipping on long textual blocks.

## 🛠️ 4. PLATFORM FEATURES TO IMPLEMENT

### Feature A: The Liquid Cast Horizon
- An horizontal, scrollable preview bar (`scrollbar-none`) displaying round glass-rimmed avatar images of the movie's actors with their actual names and character names underneath.

### Feature B: The Frosted Glass Biography Drawer (מגירת ביוגרפיה)
- A context-driven overlay drawer that glides into view when an actor is selected. Displays:
  - Full Name (עברית) and high-quality optimized avatar.
  - Interactive micro-meta layout: Age, Place of Birth, and Notable Roles.
  - Detailed scrollable text section for their cinematic biography.
  - Feature Core: Quick links to other movies available on MOVIEBOOK featuring this specific actor.

## 🛑 5. HERMETIC VALIDATION GATES (src/lib/validations/actor.ts)
- Outbound fetch requests and profile data pipelines must pass through a strict Zod schema validation structure.
- **Localized Hebrew Error Piping:** Errors must be hardcoded as direct Hebrew string literals to avoid middleware translation lag:
  - Missing actor data: `"לא נמצא מידע ביוגרפי עבור שחקן זה"`
  - Invalid query request: `"מזהה השחקן אינו תקין או שהוסר מהמערכת"`

## 📋 6. ABSOLUTE AGENT QUALITY CHECKLIST
- [ ] 0 REST routes built; profile lookup communicates exclusively through Next.js 15 Server Actions.
- [ ] 100% pure Tailwind CSS logical utility implementation across layouts.
- [ ] TypeScript check compiles flawlessly with 0 exceptions using `npx tsc --noEmit`.
- [ ] Media loading leverages `next/image` equipped with smooth blur-up placeholders.