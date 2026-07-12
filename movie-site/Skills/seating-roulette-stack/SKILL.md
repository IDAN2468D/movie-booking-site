# Specular Seating Roulette Engine - Agent Stack Blueprint (v1.0)

## 1. PRD Layer: Core Objectives & Interaction
- **Gamified Seating Nodes**: Transforms the static interactive SVG seating canopy grid into a kinetic lottery roulette engine layer.
- **The "Lucky Ticket" Mechanic**: Clicking the action node triggers a rapid dynamic hardware-accelerated color ripple and flicker across available seat elements, slowing down smoothly to lock a randomized seat node or a vacant premium VIP upgrade node.
- **Concurrency & Race Mitigation**: Optimistically locks the seat state instantly on the UI thread (`useOptimistic`). Resolves concurrent millisecond collisions via atomic database criteria updates (`$set` conditional on status) to prevent transaction overlapping.

## 2. Spec Layer: Technical Boundaries & Data Contracts
- **Atomic Line Limit**: All files generated or broken down in this iteration must remain strictly below the **200 Lines of Code (LOC)** limit.
- **Composition Laws**: No layout reflow allowed. Flickers, scaling updates, and 3D tilts must happen exclusively on the GPU layer via `transform-gpu` and `will-change: transform` at a fluid 120Hz rate.
- **Type Contract Schema**: Validates dynamic seat coordinates and lot selection queries before processing state changes.

### Zod Payload Validation Boundary (`lib/validations/roulette.ts`)
```typescript
import { z } from 'zod';

export const RouletteSelectionSchema = z.object({
  showtimeId: z.string().min(1),
  userId: z.string().min(1),
  allowedTiers: z.array(z.enum(['standard', 'vip', 'premium'])),
});

export const SeatLockResultSchema = z.object({
  success: z.boolean(),
  seatId: z.string(),
  row: z.number(),
  col: z.number(),
  tier: z.string(),
  timestamp: z.number(),
});