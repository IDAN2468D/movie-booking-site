---
name: Seating Roulette Engine
description: Instructs the agent on how to build and maintain the gamified Specular Seating Roulette module.
---

# Specular Seating Roulette Engine (v4.2 Specification)

## 1. Architectural Overview
The Specular Seating Roulette Engine introduces a gamified, high-fidelity seating selection matrix. It allows users to initiate a pseudo-randomized "Lucky Seat" raffle directly on the interactive theater grid. The interface spins through available slots using isolated visual loops before landing on a selected seat, locking it atomically via the backend.

## 2. Core Constraints & Standards
- **Zero-Reflow Performance**: All rolling and flashing animations must utilize isolated hardware-accelerated GPU layers (`transform-gpu`, `will-change`) to maintain a locked 120Hz thread. Layout properties (top, left, margin) are strictly forbidden.
- **File Limitation**: Code must comply with the Atomic Architecture standard; no single file may exceed 200 lines. Split logic into compact micro-subcomponents.
- **Atomic Operations**: Seat locks must be handled via React 19 Server Actions wrapped in the project's Result Pattern, using atomic MongoDB primitives to eliminate race conditions.

## 3. Visual Design Tokens (Liquid Glass 4.0 Alignment)
- **Container Styling**: `backdrop-blur-[40px] saturate-[250%] bg-neutral-950/40`
- **Depth & Boundaries**: Custom sub-pixel chromatic borders combined with macro-depth shadows (`box-shadow` with internal multi-layered ambient reflections).
- **Typography**: `font-outfit` for headers, `font-inter` for technical metrics and states.

## 4. Implementation Data-Flow
1. **Trigger**: User clicks the Roulette button. Zustand dispatches an isolated shuffle state.
2. **Animation Loop**: A `requestAnimationFrame` loop increments targeted seat indices, triggering high-speed `whileHover`-style scale waves across the canvas layer.
3. **Selection & Verification**: The engine lands on a random index validated client-side via Zod schemas, then instantly issues a Server Action (`lockRouletteSeatAction`) to commit the reservation to MongoDB with an atomic `$set` query.
