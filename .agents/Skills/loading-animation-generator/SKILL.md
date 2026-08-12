---
name: loading-animation-generator
description: Generate, recreate, and integrate high-performance GPU-accelerated CSS/SVG/React loading animations and accessible UI indicators. Use when creating animated UI loaders, converting loader designs or videos to code, or implementing high-performance web loading screens.
---

# Loading Animation Generator

Generate, design, and optimize smooth, modern web loading animations using CSS keyframes, SVG, React, TypeScript, and Tailwind CSS.

## When to Use

- Creating custom CSS or SVG loading spinners, bouncing/orbiting dots, or progress indicators.
- Converting a video, GIF, or image design of a loading animation into clean HTML/CSS/React code.
- Implementing Google-style 4-color dot loading animations (`#4285F4`, `#34A853`, `#FBBC05`, `#EA4335`).
- Optimizing web animation performance using GPU-accelerated CSS properties (`transform`, `opacity`).

## Technical Standards

1. **Performance First**:
   - Use GPU-accelerated CSS properties (`transform` and `opacity` only). Avoid animating `top`, `left`, `width`, `height`, or `margin` to prevent layout reflows.
   - Apply `will-change: transform;` and `transform: translateZ(0)` where appropriate.
   - Ensure 60/120 FPS smooth rendering without layout shifts or heavy repaints.

2. **Code Quality & Reusability**:
   - Standalone HTML/CSS and reusable React/Next.js component with TypeScript and Tailwind CSS.
   - Scalable dimensions via CSS Variables (`--loader-size`, `--anim-duration`, `--color-1`, `--color-2`).

3. **Accessibility (a11y)**:
   - Include `role="status"` and `aria-label="Loading..."`.
   - Include `@media (prefers-reduced-motion: reduce)` fallbacks (`motion-reduce:animate-none`).

## Reference Component (`LoadingIndicator.tsx`)

```tsx
<div
  role="status"
  aria-label="Loading..."
  className="relative inline-flex items-center justify-center pointer-events-none select-none"
  style={{
    width: `${pixelSize}px`,
    height: `${pixelSize}px`,
    ['--loader-size' as string]: `${pixelSize}px`,
    ['--anim-duration' as string]: `${duration}s`,
  }}
>
  {/* GPU Accelerated Orbiting & Pulsing Neon Elements */}
</div>
```
