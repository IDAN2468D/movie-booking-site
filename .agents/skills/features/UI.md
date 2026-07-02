# UI.md: Liquid Glass 3.0 Design System & Aesthetics

## 1. Core Visual Theme & Tokens
- [cite_start]**Theme**: Premium futuristic dark mode with high optical depth.
- **Typography**: 
  - [cite_start]Headings: Outfit.
  - [cite_start]Body: Inter.
- **Visual Tokens**:
  - [cite_start]**Refraction (Glassmorphism)**: `backdrop-blur-3xl saturate-[200%] brightness-110`.
  - [cite_start]**Depth & Border Shadows**: `box-shadow: 0 0 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)`.

---

## 2. Zero-Reflow Animation Standards (120Hz Motion)
- [cite_start]**GPU-Accelerated Transforms**: Always use x/y transforms processed by the GPU in Framer Motion instead of layout position parameters (`left`, `top`, `margin`) for dynamic cursor following, scrolling, or fluid dynamic animations[cite: 3, 7, 44]. [cite_start]This completely eliminates browser layout reflow[cite: 3, 7].
- **SVG Scale/Translate Sync**: 
  - [cite_start]Manage vector translations inside the seat maps using Framer Motion's `style={{ x, y }}` properties instead of native `transform="translate(x, y)"` attributes[cite: 4, 8, 44].
  - [cite_start]This ensures that hover scaling interactions (`whileHover={{ scale }}`) do not override or reset spatial coordinates[cite: 5, 44].

---

## 3. Component Aesthetics & Accessibility
- [cite_start]**Occupied Seating Aesthetics**: Occupied or locked seats must never blend invisibly into the background. [cite_start]They must remain readable parts of the theater grid using a muted but visible style:
  - [cite_start]`opacity-40` 
  - [cite_start]`stroke: rgba(255, 255, 255, 0.12)` 
  - [cite_start]`fill: rgba(255, 255, 255, 0.03)` 
- [cite_start]**Cinematic Enhancements**: Implementations should default to micro-viewports, 3D skewing, and real-time glass reflections where applicable to support high-end cinematic preview features[cite: 11].