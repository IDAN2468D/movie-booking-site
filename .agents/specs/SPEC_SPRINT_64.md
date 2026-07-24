# 📐 Technical Specification Blueprint (SPEC) — Sprint 64

> **Status:** Draft  
> **Version:** 9.0 SDD  
> **Target Feature:** Real-Time Cinema Crowd Heatmap & Vibe Radar  
> **Associated PRD:** `PRD_SPRINT_64.md`  

---

## 🏛️ 1. Architecture Overview & File Boundaries

### 📏 200 LOC Ceiling Constraint
Every single file created or modified under this specification MUST strictly obey the **200 lines of code** ceiling.

### 📂 File Structure Plan
```text
src/components/booking/
├── CrowdHeatmapContainer.tsx    # Parent Container (Max 150 LOC)
├── CrowdHeatmapView.tsx         # Liquid Glass 4.0 View (Max 150 LOC)
└── useCrowdHeatmapState.ts      # Custom Zustand State Slice (Max 120 LOC)
src/lib/
├── validations/crowd-heatmap.schema.ts   # Zod Validation Schemas (Max 80 LOC)
└── actions/crowd-heatmap.actions.ts      # Server Actions (Max 120 LOC)
```

---

## 🛡️ 2. Data Boundary Contracts & Zod Schemas

```typescript
import { z } from 'zod';

export const CrowdZoneSchema = z.object({
  zoneId: z.string(),
  densityScore: z.number().min(0).max(1),
  vibeLabel: z.string(),
  acousticClarityDb: z.number(),
  seatCoords: z.array(z.object({ x: z.number(), y: z.number() })),
});

export const CrowdHeatmapQuerySchema = z.object({
  showtimeId: z.string().min(1),
  auditoriumId: z.string().min(1),
});

export type CrowdZone = z.infer<typeof CrowdZoneSchema>;
export type CrowdHeatmapQuery = z.infer<typeof CrowdHeatmapQuerySchema>;
```

---

## 🔌 3. Server Actions & Unified Result Pattern

All operational handlers MUST return the deterministic contract:
```typescript
export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

---

## 🎨 4. State Management (Zustand Slices)

```typescript
export interface CrowdHeatmapState {
  activeZoneId: string | null;
  heatmapOpacity: number;
  hoveredSeatCoord: { x: number; y: number } | null;
  setActiveZone: (zoneId: string | null) => void;
  setHoveredSeat: (coord: { x: number; y: number } | null) => void;
}
```

---

## 🔒 5. Security & Guardrails
- **Zero Runtime MCP Dependency:** Built strictly with native Next.js Server Actions and Web APIs.
- **Zero MongoDB Client Exposure:** Connection strings reside strictly in server-side `.env`.
- **Input Sanitization:** All incoming dynamic payloads validated against `CrowdHeatmapQuerySchema`.

---

## 🔊 6. Acoustic & Visual Hardware Profiles
- **Web Audio API:** `PannerNode` spatial coordinate placement based on seat `(x,y)` matrix + synthesized 40Hz sub-bass drop on zone activation.
- **GPU Motion Profile:** CSS `transform-gpu`, `will-change: transform`, physics springs via Framer Motion.
