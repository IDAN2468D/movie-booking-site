# Volumetric Film-Grain Noise Shader - Agent Stack Blueprint (v1.0)

## 1. PRD Layer: Core Objectives & Hardware Grain Simulation
- **Dynamic Organic Texturing**: Inject an organic, hardware-accelerated volumetric film-grain overlay onto the application's obsidian surfaces to elevate cinematic immersion.
- **Genre Telemetry Modulation**: Dynamically scales the grain density, particle size, and speed metrics depending on the active movie genre metadata (e.g., heavier analog noise for Noir/Horror, micro-fine grain for Sci-Fi/Action).
- **Zero Main-Thread Overhead**: The shader simulation must bypass high-overhead JS CPU loop intervals, processing dynamic pixel interpolation strictly inside separate graphics composition threads.

## 2. Spec Layer: Technical Boundaries & Data Contracts
- **Atomic Line Constraint**: All new sub-components and store configurations must remain strictly under the **200 Lines of Code (LOC)** limit.
- **Composition Laws**: Driven exclusively via highly optimized WebGL shaders or hardware-composited looping SVG noise fragment primitives. Absolute locking to `transform-gpu` and `will-change: opacity, transform` is mandatory to secure stable 120Hz operations without rendering reflows.
- **Type Schema Contract**: Enforces boundary settings for opacity weights, resolution variables, and response matrix profiles.

### Zod Shader Metadata Validation Boundary (`lib/validations/grainShader.ts`)
```typescript
import { z } from 'zod';

export const GrainShaderConfigSchema = z.object({
  genre: z.string().min(1),
  grainDensity: z.number().min(0).max(1),
  particleSize: z.number().min(0.5).max(4),
  speedCoefficient: z.number().min(0).max(2),
});

export const ShaderFrameResultSchema = z.object({
  fpsLocked: z.boolean(),
  frameTime: z.number(),
  bufferAcknowledge: z.boolean(),
});