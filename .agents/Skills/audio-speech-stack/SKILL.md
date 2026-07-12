# Specular Neural Audio & Speech Engine - Agent Stack Blueprint (v1.0)

## 1. PRD Layer: Core Objectives & Audio Synthesis Interaction
- **Neural Speech Pipeline**: Interconnects the global message state array with the browser Web Speech API (`window.speechSynthesis`), triggering clean, automated Hebrew voice narration immediately upon receiving a streaming response chunk from the assistant.
- **Cinematic SFX Feedback**: Preloads a low-frequency cinematic bass sound element node (`bass-click.mp3`), dispatching low-latency acoustic audio feedback on every button click or choice selection event across the grid without blocking the primary thread.
- **GPU-Bound Waveform Indicating**: Syncs the voice utterance hooks with a visual glassmorphic layout layer ("Agent Speaking" pulse glow wave). Animation scaling parameters must bind to hardware layers to prevent parent layout computation penalties.

## 2. Spec Layer: Technical Boundaries & Data Contracts
- **Atomic Line Constraint**: All new hooks, store modifications, and verification nodes must strictly remain below the **200 Lines of Code (LOC)** limit.
- **Composition Laws**: Interface feedback ripples and visual audio wave markers must execute exclusively on the GPU composition matrix via `transform-gpu` and `will-change: transform` to protect the 120Hz monitor target frame rate.
- **Configuration Contract Schema**: Validates input metrics for voice variables, sound balances, and narration flags.

### Zod Audio Config Validation Boundary (`lib/validations/audio.ts`)
```typescript
import { z } from 'zod';

export const AudioConfigSchema = z.object({
  volume: z.number().min(0).max(1),
  rate: z.number().min(0.5).max(2.0),
  pitch: z.number().min(0.5).max(2.0),
  lang: z.string().default('he-IL'),
});

export const PlaybackTelemetrySchema = z.object({
  isPlaying: z.boolean(),
  muted: z.boolean(),
  audioNodeId: z.string().min(1),
});