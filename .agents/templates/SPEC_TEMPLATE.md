# 📐 Technical Specification Blueprint (SPEC) Template — v9.0 SDD

> **Status:** Draft / Approved  
> **Version:** 9.0  
> **Target Feature:** [Feature Name]  
> **Associated PRD:** `[PRD File Reference]`  

---

## 🏛️ 1. Architecture Overview & File Boundaries

### 📏 200 LOC Ceiling Constraint
Every single file created or modified under this specification MUST strictly obey the **200 lines of code** ceiling. Logic exceeding 200 lines must be split into sub-components, custom hooks (`use*.ts`), or utility modules (`lib/*`).

### 📂 File Structure Plan
```text
components/
├── [FeatureName]/
│   ├── [FeatureName]Container.tsx    # Parent Container (Max 150 LOC)
│   ├── [FeatureName]View.tsx         # Liquid Glass View (Max 150 LOC)
│   └── use[FeatureName]State.ts      # Custom Zustand/Hook State (Max 150 LOC)
lib/
├── validations/[feature].schema.ts   # Zod Validation Schemas (Max 100 LOC)
└── actions/[feature].actions.ts      # Server Actions (Max 150 LOC)
```

---

## 🛡️ 2. Data Boundary Contracts & Zod Schemas

```typescript
import { z } from 'zod';

export const FeatureInputSchema = z.object({
  id: z.string().min(1),
  // Define strict types here
});

export type FeatureInput = z.infer<typeof FeatureInputSchema>;
```

---

## 🔌 3. Server Actions & Unified Result Pattern

All operational handlers and API routes MUST return the deterministic contract:
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
// Strict isolated slice selector usage required to prevent unnecessary re-renders
export interface FeatureState {
  isModalOpen: boolean;
  activeItem: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
}
```

---

## 🔒 5. Security & Guardrails
- **Zero Runtime MCP Dependency:** Built strictly with native Next.js Server Actions and standard APIs.
- **Zero MongoDB Client Exposure:** Connection strings reside strictly in server-side `.env`. No client-side database connections allowed.
- **Input Sanitization:** All incoming dynamic payloads validated against Zod schemas.

---

## 🔊 6. Acoustic & Visual Hardware Profiles
- **Web Audio API:** PannerNode coordinates & sub-bass resolution triggers (40Hz drop).
- **GPU Motion Profile:** CSS `transform-gpu`, `will-change: transform`, physics springs via Framer Motion.
