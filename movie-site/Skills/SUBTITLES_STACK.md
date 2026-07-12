# Dynamic Specular Subtitles Engine - Agent Stack Blueprint (v1.0)

## 1. PRD Layer: Core Objectives & Audio-Reactive Typo
- **Refractive Text Compositing**: Transforms raw subtitle strings into high-end interactive glass view blocks that physically respond to realtime playback environmental data.
- **Audio & Visual Reactive Gateway**: Utilizes the Web Audio API (`AnalyserNode`) to capture frequency frequencies and volume amplitudes, dynamically adjusting subtitle backdrop-blur and saturate properties on the fly.
- **Strict Zero-Reflow Text Layout**: Subtitle tracks animate text size scales and lighting shifts using hardware-composited matrices. Structural tracking dimensions must never resize to avoid text wrapping causing browser layout paint recalculations.

## 2. Spec Layer: Technical Boundaries & Contracts
- **Atomic Line Rule**: All components, store slices, and parsing filters must strictly remain under the **200 Lines of Code (LOC)** limit.
- **GPU Ingestion Laws**: Layout coordinates must be fixed via hardware layer composition using `transform-gpu` and `will-change: transform, backdrop-filter` to safeguard performance on 120Hz screens.
- **Dynamic Type Safety Contract**: Validates text tracks, audio nodes, and translation buffers before ingestion.

### Zod Subtitle Sync Validation Boundary (`lib/validations/subtitles.ts`)
```typescript
import { z } from 'zod';

export const SubtitleSegmentSchema = z.object({
  id: z.string().min(1),
  startTime: z.number().nonnegative(),
  endTime: z.number().positive(),
  text: z.string().min(1),
});

export const AudioTelemetrySchema = z.object({
  amplitude: z.number().min(0).max(255),
  frequencyBucket: z.array(z.number()),
  backdropGlowColor: z.string(),
});