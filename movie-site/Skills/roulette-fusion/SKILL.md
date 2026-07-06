# Specular Roulette Kinetic Shockwave Specification (v4.8)

## 1. Architectural Overview
[cite_start]This specification governs the unified integration between the Seating Roulette Engine, the 3D Prism Spatial Seat Selection, and the Specular Currency Cascade Engine[cite: 493, 494]. [cite_start]Upon atomic backend confirmation of a lucky seat selection, a synchronized spatial visual and particle chain reaction is discharged across the client viewport[cite: 403, 494].

## 2. Core Architectural Rules
- [cite_start]**Atomic Boundaries**: Code must comply with the strict Atomic File Architecture[cite: 434, 713]. [cite_start]No single component, slice, or action file may exceed 200 lines[cite: 434, 713]. [cite_start]Complex rendering states must be split into isolated micro-subcomponents[cite: 434, 714].
- [cite_start]**Zero-Reflow Performance**: All dynamic animations, particle tracks, and ripple scale waves must utilize hardware-accelerated GPU layers (`transform-gpu`, `will-change`, and Framer Motion `style={{ x, y }}`)[cite: 438, 501, 505]. [cite_start]Layout position shifts (top, left, margin) are completely prohibited to protect the 120Hz thread lock[cite: 501, 504].
- [cite_start]**State Selection**: Store values must be extracted via atomic, shallow-baked selectors to eliminate cascading parent-to-child UI reflows[cite: 436, 695, 715].

## 3. Data-Flow & Lifecycle Pipeline
1. [cite_start]**Landing & Commit**: The roulette selection cycle stops on a Zod-validated seat[cite: 403, 435]. [cite_start]`lockRouletteSeatAction` executes an atomic query to MongoDB and returns a success payload matching the project's Result Pattern[cite: 428, 437].
2. [cite_start]**Shockwave Dispatch**: The Zustand store captures the resolution state, instantly populating `winningSeatCoords: { row: number; col: number }` and incrementing `rippleTriggerId`[cite: 448].
3. [cite_start]**Concentric Ripple Wave**: The 3D Seat Grid calculates the geometric matrix distance from the winning source[cite: 447]:
   [cite_start]$$\text{Distance} = \sqrt{({\text{SeatRow} - \text{WinningRow}})^2 + ({\text{SeatCol} - \text{WinningCol}})^2}$$ [cite: 450]
   [cite_start]Adjacent seat vectors trigger a scale and chromatic neon-glow wave delayed proportionally by `distance * 0.05s`[cite: 447, 451].
4. [cite_start]**Currency Cascade Trigger**: Simultaneously, the store slice flags transaction completion, initializing the hardware-accelerated particle canvas explosion from the ceiling grid down across the immersive display container[cite: 494, 602].

## 4. Visual Design Tokens (Liquid Glass 4.0 Standard)
- [cite_start]**Overlay Container**: `backdrop-blur-[40px] saturate-[250%] bg-neutral-950/40`[cite: 438, 778, 791].
- [cite_start]**Optical Depth**: Advanced box-shadow multi-layered ambient internal reflections paired with sub-pixel chromatic borders[cite: 438, 779, 792].
- [cite_start]**Typography**: Header modules strictly map to `font-outfit`, while dense data streams utilize `font-inter`[cite: 750, 751, 793].