---
type: skill
status: active
tags: [moviebook, landing-experience, liquid-glass, nextjs15, server-actions, webflow-migration]
security_level: tier-1
version: 4.0
---

# 🎬 MOVIEBOOK CINEMATIC LANDING & "BECAUSE YOU LOVE MOVIES" HUB

This document serves as the official single source of truth (SSOT) and architectural blueprint for migrating and upgrading the high-end concept landing page from Webflow (`https://idans-wondrous-site-2218fc.webflow.io/`) into a full-stack Next.js 15 Web App engine under the theme: **"Because you love movies."**

## 🛑 1. CONTEXT DIET & AGENT BOUNDARIES
To maximize token economy and avoid processing loops, the AI Agent must strictly respect the following code boundaries:
- **Search Exclusions:** Do NOT scan or traverse `.next/`, `node_modules/`, `.obsidian/`, or `public/assets/` recursively.
- **Strict Ingestion:** Read only the files explicitly defined inside `AI_Index.md` or pass-by-reference layouts.

## ⚡ 2. ARCHITECTURAL ENGINE & DB SCHEMAS
- **Zero REST Endpoints:** All state-fetching, interaction triggers, and user interactions must run strictly through Next.js 15 Server Actions (`"use server"`).
- **Database Architecture:** Connected via Mongoose to MongoDB. Any user interaction (saving a movie, tracking watch history, liking a title) must utilize atomic operators (`$addToSet`, `$pull`).
- **HMR Overwrite Prevention:** All compilation definitions must match: `(mongoose.models.MovieHub || mongoose.model('MovieHub', MovieHubSchema))`.

## 🎨 3. LIQUID GLASS 3.0 & RTL EXPERIENCE UTILITIES
- **Color Stack & Aesthetics:** Deep cinematic obsidian backdrop (`#05070B`), ultra-premium glass containers (`backdrop-blur-xl bg-slate-900/30`), subtle ice-crystal borders (`border-white/5`), and high-end glowing neon text accents.
- **RTL Logical Properties Only:** Absolute banned layout tokens: `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`. Use logical layout parameters exclusively: `ps-`, `pe-`, `space-x-reverse`, `rtl:translate-x-0`, and directional chevron mirroring for Hebrew flow.
- **Typographic Shielding:** Hebrew content must render using font-families `Assistant` or `Rubik` with `leading-relaxed` or `leading-loose` variables to guarantee no typographic tall-character cropping occurs.

## 🛠️ 4. PLATFORM FEATURES & HERO WIDGETS (MIGRATED FROM CONCEPT)

### Feature A: The Immersive "Because you love movies" Hero Canopy
- An premium, edge-to-edge cinematic banner using lazy-loaded, optimized WebP/AVIF imagery (`6a4219aea2284eb3e0677f4a_cover-img-doubled.webp`) backed by background ambient lighting.
- Floating glass card overlaid with a personalized greetings micro-copy module that alters context dynamically based on user preferences.

### Feature B: Interactive Cinematic Reel & Watchlist Feed
- An horizontal scroll container wrapped in Tailwind custom scrollbars (`scrollbar-none`) that displays highly targeted content recommendations.
- Implements React `useOptimistic` to allow instantaneous liking, bookmarking, or quick-adding to watchlists without loading animations.

## 🛑 5. GATED INPUT VALIDATION (src/lib/validations/landing.ts)
- Any engagement vectors or dynamic lookups must run through a hard-compiled Zod validation layout.
- **Native Hebrew Error Piping:** Errors must map directly to the frontend view without middleware translation layers:
  - Unauthorized interactions: `"אנא התחבר כדי להוסיף סרטים לרשימת הצפייה שלך"`
  - Media item mismatch: `"מזהה הסרט אינו תקין או שאינו זמין באזורך"`

## 📋 6. ABSOLUTE AGENT QUALITY CHECKLIST
- [ ] 100% strict Tailwind logical utility classes used; zero standard directional offsets.
- [ ] No standalone API endpoints created (`route.ts`).
- [ ] Clean build execution verified under `npx tsc --noEmit` with zero type assertions broken.
- [ ] Image assets implement `next/image` with proper priority weights and blur placeholders.