# Cinematic Specular Sightline Engine - Agent Stack Blueprint (v1.0)

## 1. PRD Layer: Core Objectives & Viewport Interaction
- **Micro-Viewport Simulation**: Renders an interactive overlay panel providing a localized 3D spatial sightline simulation from any hovered or active seat coordinate directly facing the virtual theater screen.
- **Dynamic 3D Skewing Mechanics**: Projects realtime optical depth and perspective distortion (CSS 3D perspective transforms) onto the preview layout frame, computing offsets on cursor hover without forcing root component tree updates.
- **Refractive Lens Masking**: Applies high-density optical reflection filters to simulate physical look-angles, adapting blur and brightness dynamically based on row-to-screen distance formulas.

## 2. Spec Layer: Technical Boundaries & Data Contracts
- **Atomic Line Limit**: All files generated or broken down in this iteration must remain strictly below the **200 Lines of Code (LOC)** limit.
- **Composition Laws**: Pure hardware composition layer is mandatory. Skew grids, perspective scaling, and zoom sweeps must use `transform-gpu` and `will-change: transform` to stay reflow-free at 120Hz.
- **Type Contract Schema**: Enforces boundary criteria for seat angle coordinates, pitch, yaw, and relative row calculations.

### Zod Sightline Matrix Validation Boundary (`lib/validations/sightline.ts`)
```typescript
import { z } from 'zod';

export const SightlineMatrixSchema = z.object({
  seatId: z.string().min(1),
  rowOffset: z.number().min(1).max(50),
  colOffset: z.number().min(1).max(50),
  pitchAngle: z.number().min(-45).max(45),
  yawAngle: z.number().min(-45).max(45),
});

export const ViewportConfigSchema = z.object({
  focalLength: z.number(),
  blurIntensity: z.number(),
  chromaticScale: z.number(),
});