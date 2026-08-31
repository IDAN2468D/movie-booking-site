# Technical Specification: Acoustic Sweet-Spot 3D Simulator

## 1. Objective & Flow
Enable users to preview the exact acoustic immersion and binaural spatial profile of their chosen cinema seat before booking.

## 2. Web Audio API Node Graph

```
[Audio Source / Synth] -> [BiquadFilterNode (LowPass)] -> [PannerNode (3D HRTF)] -> [GainNode] -> [Destination]
```

## 3. Zod Data Validation

```typescript
import { z } from "zod";

export const SeatAcousticProfileSchema = z.object({
  seatId: z.string(),
  row: z.string(),
  number: z.number().int(),
  coordinates: z.object({
    x: z.number(), // -1 (far left) to 1 (far right)
    y: z.number(), // 0 (front row) to 1 (back row)
    z: z.number().default(0),
  }),
  speakerDistances: z.object({
    frontLeft: z.number(),
    frontCenter: z.number(),
    frontRight: z.number(),
    surroundLeft: z.number(),
    surroundRight: z.number(),
    subwoofer: z.number(),
  }),
  immersionScore: z.number().min(0).max(100),
  sweetSpotRating: z.enum(["EXCELLENT", "OPTIMAL", "GOOD", "SIDE_LEANING"]),
});

export type SeatAcousticProfile = z.infer<typeof SeatAcousticProfileSchema>;
```

## 4. Key Implementation Patterns

- **HRTF Panning:** Set `panner.panningModel = 'HRTF'` and `panner.distanceModel = 'inverse'`.
- **Frequency Damping:** Back-row seats get slight high-frequency roll-off via lowpass filter (`filter.frequency.setValueAtTime(14000, ctx.currentTime)`).
