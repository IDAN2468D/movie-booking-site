# Discovery Proximity Haptic & Tension Engine - Agent Stack Blueprint (v2.0)

## 1. PRD Layer: Core Objectives & Proximity Resonance
- **Magnetic Tension Zone**: Establishes a virtual pull boundary radius ($R_{\text{pull}}$) surrounding the core neural target circle layout. As a genre bubble icon enters this zone, a proximity calculation triggers real-time physical and visual resonance feedback.
- **Hardware Mobile Haptics**: Triggers automated device-level micro-vibrations via the browser's native `navigator.vibrate([12, 20])` array protocol, increasing frequency seamlessly as the element nears the snap threshold.
- **Zero-Reflow Desktop Shake**: Synthesizes a high-fidelity visual tension vibration on desktop block items. It uses dynamic mathematical noise variations applied strictly over GPU compositing layers to prevent expensive layout paint re-calculations.

## 2. Spec Layer: Technical Boundaries & Mathematical Laws
- **Atomic Line Rule**: Every utility hook, store state modifier, and sub-layout block must remain strictly under the **200 Lines of Code (LOC)** limit.
- **Hardware Layer Isolation**: Visual shake amplitudes must rely exclusively on `transform-gpu` (using `translateX` and `translateY` random adjustments) combined with `will-change: transform` to protect 120Hz monitor operations.
- **Tension Decay Formula**: The displacement vibration amplitude ($A_{\text{shake}}$) is calculated dynamically based on current pixel distance ($d$):
  $$A_{\text{shake}}(d) = A_{\text{max}} \cdot \exp\left(-\beta \cdot \frac{d}{R_{\text{pull}}}\right)$$
  Where $A_{\text{max}}$ is the peak shake offset weight and $\beta$ represents the exponential damping coefficient.

### Zod Proximity Boundary Validation Contract (`lib/validations/hapticConfig.ts`)
```typescript
import { z } from 'zod';

export const ProximityPayloadSchema = z.object({
  currentDistance: z.number().nonnegative(),
  pullRadiusThreshold: z.number().positive(),
  isActiveDrag: z.boolean(),
});

export const HapticPatternSchema = z.object({
  vibrationSequence: z.array(z.number()),
  shakeIntensityModifier: z.number().min(0).max(5),
  isLockedToCenter: z.boolean(),
});