---
name: loading-animation-generator
description: Generate, recreate, and integrate high-performance GPU-accelerated CSS/SVG/React loading animations and accessible UI indicators.
---

# Loading Animation Generator

Generate or recreate high-performance, responsive, and aesthetically pleasing loading animations based on design specifications, video clips, or code snippets.

## Technical Standards

1. **Performance First**:
   - Use GPU-accelerated CSS properties (`transform` and `opacity` only).
   - Apply `will-change: transform;` and `transform: translateZ(0)` where appropriate.
   - Ensure 60/120 FPS smooth rendering without layout shifts or heavy repaints.

2. **Code Quality & Reusability**:
   - Standalone HTML/CSS and reusable React/Next.js component with TypeScript and Tailwind CSS.
   - Scalable dimensions via CSS Variables (`--loader-size`, `--anim-duration`, `--color-1`, `--color-2`).

3. **Accessibility (a11y)**:
   - Include `role="status"` and `aria-label="Loading"`.
   - Include `@media (prefers-reduced-motion: reduce)` fallbacks.

## Reference Component (`LoadingIndicator.tsx`)

```tsx
<div
  role="status"
  aria-label="Loading"
  className="relative inline-flex items-center justify-center pointer-events-none"
  style={{
    ['--loader-size' as string]: `${size}px`,
    ['--anim-duration' as string]: `${duration}s`,
  }}
>
  {/* GPU Accelerated Orbiting & Pulsing Neon Elements */}
</div>
```
