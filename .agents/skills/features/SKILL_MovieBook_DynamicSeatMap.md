---
type: skill
status: active
tags: [moviebook, booking-engine, seat-map, liquid-glass, nextjs15, server-actions, dynamic-ui]
security_level: tier-1
version: 4.8
---

# 🎫 MOVIEBOOK DYNAMIC GLASS SEAT MAP ENGINE

This document serves as the official single source of truth (SSOT) and logical structural blueprint for engineering the advanced, interactive 3D Holographic Seat Selection Matrix (`/booking/[showtimeId]/seats`) inside the MOVIEBOOK platform ecosystem.

## 🛑 1. CONTEXT DIET & EXCLUDE BARRIERS
To preserve extreme context token economy and stop processing recursive loops, the AI Agent must strictly obey these repository boundaries:
- **Absolute Search Bans:** Never scan or iterate lookups internally inside: `.next/`, `node_modules/`, or `.obsidian/`.
- **Modular Loadout:** Source repository configurations exclusively through paths explicit in `AI_Index.md`.

## ⚡ 2. DATA PIPELINE & CONCURRENCY ATOMICITY
- **Zero REST Endpoints:** Seat state rendering, temporary transaction locking, and final row allocations must be powered 100% via Next.js 15 Server Actions (`"use server"`).
- **Anti-Race Condition Guards:** Locking or unlocking a seat index must utilize conditional, atomic MongoDB operations (`findOneAndUpdate` with filter validation rules or `$set` positional operators) via Mongoose. This guarantees two users cannot lock the exact same seat coordinate at the same millisecond.
- **HMR Compilation Safety:** Export all model compilation entities using the strict standard pattern: `(mongoose.models.ShowtimeSeats || mongoose.model('ShowtimeSeats', ShowtimeSeatsSchema))`.

## 🎨 3. LIQUID GLASS 3.0 & NATIVE HEBREW RTL UX TOKENS
- **Aesthetic Grid Stack:** Absolute cinematic Obsidian canvas backdrop (`#05070B`). Row seats constructed as glowing glass capsules (`backdrop-blur-md bg-slate-900/40 border border-white/10`).
- **Pulsing Light Status Cues:** - Occupied seats: Dissolved or blurred opacity reduction layout (`opacity-20 pointer-events-none`).
  - Available standard seats: Soft icy cyber-teal outline shadow glow (`#00F0FF`).
  - VIP / Club Seats: Deep glowing neon amber-gold pulsing ring profile (`#FFB800`).
- **100% Strict RTL Logical Utilities:** Physical layout properties (like `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`) are strictly forbidden. Utilize logical parameter alternatives exclusively: `ps-`, `pe-`, `space-x-reverse`, `flex-row-reverse`, and `rtl:rotate-180` for row mapping vectors.
- **Typographic Shielding:** Wrap all row indicators (שורה א', שורה ב') and text vectors inside font-families `Assistant` or `Rubik` combined with `leading-relaxed` settings to prevent bounding-box character trimming.

## 🛠️ 4. PLATFORM FEATURES & INTERACTIVE WIDGETS

### Widget A: 3D Isometric Holographic Screen Canopy & Seat Grid
- A structural visual block featuring a styled theater screen mesh curving at the top, embedded with a sleek glow projection filter mimicking a real high-end 4K laser projector layout.
- The seat matrix below is wrapped inside a CSS 3D perspective wrapper (`perspective: 1000px; transform: rotateX(20deg);`) creating an high-fidelity tilted cockpit seating illusion.

### Widget B: Real-Time Multi-Seat Selector Row with useOptimistic Sync
- Handles continuous multi-seat choices seamlessly. Clicking a seat triggers a client-side React `useOptimistic` hook, changing the layout status index to "Selected" (pulsing neon teal) instantly in 0ms while spawning a server reservation request in the background.

## 🛑 5. HERMETIC VALIDATION GATES (src/lib/validations/seats.ts)
- Outbound socket payloads, seat indexes, and checkout validation arrays must run through rigid Zod input checking gates.
- **Native Hebrew Error Piping:** Errors must be hardcoded inside native Hebrew string literals to drop straight into the viewport layer without intermediary localization handlers:
  - Seat concurrency clash: `"מושב זה נתפס על ידי משתמש אחר, אנא בחר מושב חלופי"`
  - Matrix out of bounds: `"מזהה המושב או קואורדינטת השורה אינם תקינים"`

## 📋 6. ABSOLUTE AGENT QUALITY CHECKLIST
- [ ] No standalone `route.ts` API assets declared.
- [ ] 100% compliant Tailwind CSS logical attributes applied across layout structures.
- [ ] Strict mode compilation check passes cleanly under `npx tsc --noEmit` with zero broken references.
- [ ] Touch gestures and mouse-clicks reflect atomic index states without rendering micro-lag gaps.