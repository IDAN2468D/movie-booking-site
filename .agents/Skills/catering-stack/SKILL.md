# Specular Neural Catering Pipeline - Agent Stack Blueprint (v1.0)

## 1. PRD Layer: Core Objectives & Predictive Ordering
- **Predictive Menu Node**: Renders an immersive, blurred glass catering dashboard that dynamically surfaces recommended food, snacks, and beverage pairings.
- **Neural Mood Alignment**: Ingests the active `userMood` vector from the global store to rearrange and highlight items (e.g., comforting premium snacks for intense dramas, quick sharp energy combos for high-octane action).
- **Atomic Stock Ledger**: Leverages transactional state locks to query real-time kitchen inventory, instantly reflecting dynamic stock counts on the UI thread without layout displacement.

## 2. Spec Layer: Technical Boundaries & Contracts
- **Atomic Line Constraint**: All new sub-components, schema validations, and state nodes must remain strictly under the **200 Lines of Code (LOC)** limit.
- **Composition Laws**: Menu sweeps, cart slides, and item card highlights must be processed exclusively via hardware acceleration layers using `transform-gpu` and `will-change: transform, opacity` to safeguard a locked 120Hz frame rate.
- **Type Schema Contract**: Enforces strict payload verification for food item integrity, basket mutation payloads, and stock quantities.

### Zod Catering Inventory Validation Boundary (`lib/validations/catering.ts`)
```typescript
import { z } from 'zod';

export const CateringItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(['snack', 'beverage', 'combo', 'premium']),
  price: z.number().positive(),
  stockRemaining: z.number().nonnegative(),
});

export const CartPayloadSchema = z.object({
  showtimeId: z.string().min(1),
  items: z.array(z.object({
    itemId: z.string(),
    quantity: z.number().positive(),
  })),
});