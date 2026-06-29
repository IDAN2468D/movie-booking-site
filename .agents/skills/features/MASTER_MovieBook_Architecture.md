---
type: master-skill
status: active
tags: [moviebook, cinebook, nextjs15, server-actions, liquid-glass, master-blueprint]
security_level: tier-0
version: 5.5
---

# 🎬 MOVIEBOOK CENTRAL ARCHITECTURE & LIQUID GLASS MATRIX

This document is the absolute Single Source of Truth (SSOT) and master runtime specification for the entire full-stack MOVIEBOOK (CineBook) platform. Every page, interaction gate, database compile layer, and UI property must strictly adhere to this matrix.

## 🛑 1. REPOSITORY BOUNDARIES & TOKEN DIET
To achieve max processing speed and optimize context costs, the AI Agent must never traverse or scan built assets recursively:
- **Strictly Banned Directories:** `.next/`, `node_modules/`, `.obsidian/`, `public/assets/`.
- **Reference Resolution:** Load directory maps solely through the paths defined within `AI_Index.md`.

## ⚡ 2. FULL-STACK SERVER ACTIONS ENGINE (ZERO-REST)
- **Banned Implementations:** Standard API route files (`route.ts`) are 100% prohibited for application controllers. All state mutations and lookups are powered entirely by Next.js 15 Server Actions (`"use server"`).
- **Mongoose Pooling & HMR Protection:** Every data access file must verify Mongoose instance connectivity, using cached pooling. Ensure compilation overwrite safety using the exact pattern: `(mongoose.models.ModelName || mongoose.model('ModelName', Schema))`.
- **Atomic Operations Only:** Dynamic changes to user points, seat records, and wishlist matrices must be processed via atomic mongo query operators (`$set`, `$inc`, `$addToSet`, `$pull`, `$push`).

## 🎨 3. LIQUID GLASS 3.0 & NATIVE RTL LOGICAL MATRIX
- **Aesthetic Theme:** Absolute deep cinematic Obsidian canvas background (`#05070B`). Core view elements map glassmorphic surfaces using `backdrop-blur-xl bg-slate-900/30 border border-white/10`.
- **Glow & Status Signatures:** - Standard/Teal Cyber Glow: `#00F0FF` (Available paths, neural links, active connections).
  - Premium/Gold Amber Accent: `#FFB800` (VIP tiers, claimed perks, won auctions, active timers).
- **100% Pure Tailwind Logical Properties:** Physical properties (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`) are completely banned. Use logical equivalents only: `ps-`, `pe-`, `space-x-reverse`, `flex-row-reverse`, `rtl:translate-x-0`.
- **Typographic Shielding:** Render all Hebrew strings using `Assistant` or `Rubik` with `leading-relaxed` settings. Always provide vertical padding clearance (`py-1` or offset buffers) to shield tall Hebrew letters from bounding-box layout clipping.

---

## 🗺️ 4. PLATFORM CORE MODULES & PAGE BLUEPRINTS

### 🎞️ Module A: Cinematic Landing Hub (`/` / `/hub`)
- **Webflow Migration Canopy:** Edge-to-edge ambient cinematic banner layer displaying fluid image scales with floating personalized glass greeting boxes.
- **Interactive Carousel Rows:** Horizontal smooth scroll arrays (`scrollbar-none`) with pseudo shadow fade masks (`before:bg-gradient-to-e before:from-[#05070B]`) allowing users to interact with lists natively via `useOptimistic` 0ms loops.

### 🧠 Module B: Neural Discovery Engine (`/discover/neural`)
- **AI Mood & Variable Sliders:** Dynamic input grids mapping client-side state parameters for Tension (מתח) and Pace (קצב) inside frosty slider tracks.
- **Thematic Correlation Graph Node:** Visual graph structure visualizing contextual cross-linking routes between generated choices and history tables, highlighting percentage values (e.g., `"95% התאמה נוירונית"`).

### 🎫 Module C: 3D Holographic Booking Grid (`/booking/[showtimeId]/seats`)
- **Isometric Matrix View:** Structural grid mapping seat positions tilted via 3D CSS utilities (`perspective: 1000px; transform: rotateX(20deg);`) towards a projecting screen marquee.
- **Seat Status Flags:** Available rows use teal silhouettes, VIP slots invoke golden vectors, and taken seats dissolve instantly (`opacity-20 pointer-events-none`).
- **Race-Condition Shield:** Locks are evaluated over conditional `findOneAndUpdate` queries to block dual bookings on the exact same millisecond.

### 💎 Module D: VIP Premium Bonuses & Auctions (`/vip/bonuses` / `/vip/auctions`)
- **Gourmet Perk Claim Matrix:** Bento-box grid containing redeemable digital and physical perks (e.g., Premium Gourmet Popcorn Combo). Actions execute atomic deductions of loyalty balances.
- **Real-Time Points Auction Ledger:** Bidding environment where active users bid point balances over major releases using ticking down countdown clocks and real-time top-bid status re-renders.

### 🦁 Module E: Cinematic Sound Screen (Splash Screen Engine)
- **Audio Vortex Sequence:** Framer-motion driven multi-layered circular vortex activated upon interaction or auto-trigger. Hooks deep sub-bass drop acoustics layered behind stylized electronic roar effects.

---

## 🛡️ 5. HARD-COMPILED VALIDATION GATES (src/lib/validations/master.ts)
Every parameter crossing network layers must match explicit Zod shapes. All verification modules pass user-facing errors as native Hebrew string arrays to pipeline issues directly to the RTL views without lag:
- Seating conflict: `"מושב זה נתפס על ידי משתמש אחר, אנא בחר מושב חלופי"`
- Seating bound breach: `"מזהה המושב או קואורדינטת השורה אינם תקינים"`
- Discovery input mismatch: `"חיפוש חופשי חייב להכיל לפחות 2 תווים או בחירת קטגוריית מצב רוח"`
- Loyalty balance error: `"אין לך מספיק נקודות נאמנות למימוש הטבה זו"`

## 📋 6. THE MASTER AGENT COMPLIANCE CHECKLIST
- [ ] Absolutely zero standalone REST route files (`route.ts`) constructed for application control.
- [ ] 100% strict Tailwind CSS logical layout parameters used; physical directions entirely absent.
- [ ] System environment returns a completely clean `npx tsc --noEmit` pass with zero type errors.
- [ ] Long Hebrew strings are entirely protected against CSS vertical truncation or text-clipping.
- [ ] Database updates apply conditional atomic operators, ensuring full race-condition security.