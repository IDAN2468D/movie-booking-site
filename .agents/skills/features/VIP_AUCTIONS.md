---
type: skill
skill: VIP_Seat_Auctions
status: active
priority: 5
architecture: Next.js 15 (Server Actions) + MongoDB Atomic Updates
design_system: Liquid Glass 3.0 (RTL Native)
---

# 🎫 SKILL: VIP Seat Auctions Execution Blueprint

This specification dictates the strict logic, data validation, and visual implementation parameters for the real-time premium auction system inside the Liquid Capital dashboard (`/vip/liquid-capital`).

---

## 🛑 STRICT COMPLIANCE BOUNDARIES
* **No REST Route Handlers:** All mutations and queries must rely exclusively on Next.js 15 Server Actions.
* **Atomic Level Mutation:** Direct MongoDB operators (`$set`, `$max`, conditional queries) must be used to mitigate concurrent race conditions at the millisecond scale.
* **0-Latency Guarantee:** Frontend state must utilize React's `useOptimistic` hook to reconcile bid increments immediately on user action.

---

## 🛠️ SPECIFIC IMPLEMENTATION PIPELINES

### 1. Zod Guarded Gating (`src/lib/validations/auction.ts`)
The schema must validate all payload inputs strictly before interacting with Mongoose layer, enforcing localized Hebrew error messaging:
* `auctionId`: String, required, explicit MongoDB ObjectId pattern confirmation.
* `bidAmount`: Integer, strictly positive, greater than zero.
* Hebrew mapping parameters:
  - `"מזהה מכרז לא תקין"`
  - `"סכום ההצעה חייב להיות מספר שלם וחיובי"`

### 2. Backend Server Actions (`src/lib/actions/auctions.ts`)
* `getActiveAuctions()`: Query the `seatauctions` Mongoose collection for rows where `endTimestamp > Date.now()`.
* `placeBidAction(auctionId, bidAmount)`:
  1. Validate current session user loyalty points balance.
  2. Perform an atomic update command on MongoDB using filter boundaries to check if `bidAmount > currentHighestBid`.
  3. Deduct points safely and execute `revalidatePath('/vip/liquid-capital')`.

### 3. Glassmorphic Frontend Component (`src/components/liquid-capital/SeatAuctions.tsx`)
* **Layout Structure:** Bento-grid wrapper layout containing itemized active items.
* **Liquid Glass 3.0 Aesthetic:** Heavy `backdrop-blur-md`, `bg-slate-900/40`, clean dynamic borders `border-white/10`, and pulsing champagne-gold radial gradient aura effects when a high-bid occurs.
* **RTL Logical Alignment:** - Ensure all absolute placements, spacing parameters, and animation vectors utilize native logical directions (e.g., `pe-4`, `space-x-reverse`, `rtl:left-auto`).
  - Render currency positions according to standard Hebrew convention: `₪[סכום]` with an explicit `leading-relaxed` configuration to prevent layout overflow or character clipping.

---

## 🏁 VERIFICATION CHECKLIST FOR AGENT
- [ ] Ensure `npx tsc --noEmit` yields `0` compilation errors.
- [ ] Malformed data structures to the server action must trigger validation rejection without breaking the global try/catch framework.
- [ ] UI must update instantaneously upon bid placement via optimistic states.