---
type: skill
status: active
tags: [moviebook, loyalty, bonuses, liquid-glass, nextjs15, server-actions]
security_level: tier-1
version: 3.5
---

# 🌐 MOVIEBOOK PREMIUM BONUSES & LOYALTY MATRIX

This document serves as the official single source of truth (SSOT) and functional blueprint for upgrading the Rewards & Bonuses page (`/vip/bonuses`) inside the MOVIEBOOK application framework.

## 🛑 1. AUTOMATIC TOKEN DIET & EXCLUDE BARRIERS
To preserve extreme context efficiency and eliminate API costs, the AI Agent must strictly obey these repository boundaries:
- **Absolute Search Bans:** Never scan or run recursive lookups inside: `.next/`, `node_modules/`, `.obsidian/`.
- **Modular Ingestion:** Only fetch context paths declared inside `AI_Index.md` instead of guessing directory structures.

## ⚡ 2. BACKEND INTEGRATION & DATABASE RIGIDITY
- **Zero REST Endpoints:** No `route.ts` handlers are permitted. Communication relies 100% on Next.js 15 Server Actions (`use server`).
- **Atomic Operations:** All points balance updates and reward coupon claims must use atomic MongoDB operators (`$inc`, `$push`) via Mongoose to mitigate concurrency race conditions.
- **Mongoose Overwrite Safety:** Export models using the `(mongoose.models.ModelName || mongoose.model(...))` standard to fully override Next.js Hot Module Replacement (HMR) compilation glitches.

## 🎨 3. LIQUID GLASS 3.0 & PREMIUM RTL UX TOKENS
- **Aesthetic Palette:** Deep obsidian background (`#05070B`), glassmorphic layers via `backdrop-blur-md bg-slate-900/40`, and thin crystal dividers (`border-white/10`).
- **Pulsing Cues:** Glowing Amber Gold (`#FFB800`) for premium tiers, VIP points indicators, and flashing flash-deals countdown metrics.
- **RTL Logical Utilities Only:** Hardcoded direction tags (like `ml-`, `pr-`, `left-`) are strictly prohibited. Utilize `ps-`, `pe-`, `space-x-reverse`, `flex-row-reverse`, and `rtl:translate-x-0` to naturally map Hebrew reading flows.
- **Typography Safeguard:** Render all text inside `Assistant`, `Rubik`, or `Heebo` with `leading-relaxed` parameters to prevent Hebrew character clipping.
- **Icon Realignment:** Explicitly mirror directional cues (arrows, chevrons, slide drawers) for correct right-to-left layout constraints.

## 🛠️ 4. CORE FEATURES TO IMPLEMENT

### Widget A: Liquid Points Progress & Tier Dashboard
- A Bento-box block rendering the user's current loyalty tier (Bronze, Silver, Gold, Liquid Elite) with a pulsing golden neon progress track.
- Uses React `useOptimistic` hooks to display instant visual tier-up micro-animations when points are synced.

### Widget B: Instant Benefit Claims (Gourmet Perks)
- Grid array of available physical/digital movie bonuses (e.g., "Premium Gourmet Popcorn Combo", "VIP Lounge Entry Coupon", "4D Haptic Synchronized Seat Voucher").
- Interactive action button triggers `claimRewardAction(rewardId)` which instantly applies an optimistic "Claimed" UI mask in 0ms, verifying balance securely on the MongoDB cluster in the background.

## 🛑 5. HERMETIC VALIDATION GATES (src/lib/validations/bonuses.ts)
- Every single interaction vector must pass through a strict Zod schema validation gate.
- **Localized Errors:** Zod messages must be hardcoded in native Hebrew strings to pipe errors directly to the RTL view without mapping translations:
  - Points overflow: `"אין לך מספיק נקודות נאמנות למימוש הטבה זו"`
  - Invalid ID: `"מזהה הטבה אינו תקין או פג תוקף"`

## 📋 6. ABSOLUTE AGENT QUALITY CHECKLIST
- [ ] No REST routes or standalone API objects constructed.
- [ ] zero TypeScript compilation errors generated under `npx tsc --noEmit`.
- [ ] All price/point layouts properly format currency symbols rightward (e.g., "150 ₪" or "₪150").
- [ ] Slow-network simulations maintain a flawless zero-latency user illusion via `useOptimistic`.