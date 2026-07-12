# Discovery Category Sonic Signatures - Agent Stack Blueprint (v1.0)

## 1. PRD Layer: Core Objectives & Genre Audio Synthesis
- **Dynamic Target Fusion**: Inside the Neural Discovery Catalog (`/discover/neural`), moving or snapping a category node into the active selection circle target triggers an instantaneous, genre-specific algorithmic audio characteristic sweep.
- **WebGL Audio Oscillator Maps**: Eliminates heavy external asset network fetches. The system synthesizes character frequencies using custom native browser web oscillators:
  - `Sci-Fi`: Low-to-high modular synthesizer sawtooth pitch sweep with high resonance.
  - `Horror`: High-pitch minor-second interval tension string drone cluster.
  - `Action`: Heavy dual-oscillator sub-bass frequency kick dropping from 120Hz to 30Hz.
  - `Comedy`: Clean, bright square-wave major-arpeggio staccato chime cascade.
- **Isolated Spatial Ripples**: The interaction drives glassmorphic concentric ripple expansions on the active canvas viewport using purely hardware-composited layers.

## 2. Spec Layer: Technical Boundaries & Data Contracts
- **Atomic Line Rule**: Every hook, validation gate, and store container created must adhere strictly to the **200 Lines of Code (LOC)** limit.
- **Composition Execution Law**: Target circle glows, node tracking vectors, and frequency spectrum waves must run on the GPU composition layers via `transform-gpu` and `will-change: transform, opacity`.
- **Validation Payload Schema**: Controls frequency bounds, audio context gains, and safe oscillator type parsing parameters.

### Zod Discovery Audio Validation Boundary (`lib/validations/discoveryAudio.ts`)
```typescript
import { z } from 'zod';

export const GenreAudioMetadataSchema = z.object({
  genreId: z.string().min(1),
  oscillatorType: z.enum(['sine', 'square', 'sawtooth', 'triangle']),
  baseFrequency: z.number().min(20).max(2000),
  sweepDuration: z.number().positive(),
  gainIntensity: z.number().min(0).max(1),
});

export const SelectionNodeStateSchema = z.object({
  isOverTarget: z.boolean(),
  currentFocalScale: z.number(),
  frequencyModulationLocked: z.boolean(),
});