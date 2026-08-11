---
name: loading-animation-generator
description: Generate and customize modern CSS, SVG, and React loading animations, spinners, and orbiting dot loaders. Use when creating animated UI loaders, converting loader designs or videos to code, or implementing high-performance web loading screens.
---

# Loading Animation Generator

A specialized skill for designing, generating, and optimizing smooth, modern web loading animations using CSS keyframes, SVG, React, and Tailwind CSS.

## When to Use

- Creating custom CSS or SVG loading spinners, bouncing/orbiting dots, or progress indicators.
- Converting a video, GIF, or image design of a loading animation into clean HTML/CSS/React code.
- Implementing Google-style 4-color dot loading animations (`#4285F4`, `#34A853`, `#FBBC05`, `#EA4335`).
- Optimizing web animation performance using GPU-accelerated CSS properties (`transform`, `opacity`).

## Workflow Steps

### 1. Identify Animation Parameters
- **Type**: Orbiting dots, pulse, spinner, progress bar, skeleton, bouncing dots.
- **Color Palette**: Brand colors (e.g., Google 4-color palette: Blue `#4285F4`, Green `#34A853`, Yellow `#FBBC05`, Red `#EA4335`).
- **Timing & Easing**: Duration (e.g., 1.5s - 2.5s), easing (`cubic-bezier`, `ease-in-out`), iteration (`infinite`).
- **Framework Target**: Pure HTML/CSS, React (Next.js), Tailwind CSS, or React Native.

### 2. Core Implementation Guidelines
- **GPU Acceleration**: Animate strictly using `transform` (scale, rotate, translate) and `opacity`. Avoid animating `top`, `left`, `width`, `height`, or `margin` to prevent layout reflows.
- **Accessibility**: Include `role="status"`, `aria-label="Loading..."`, and respect `prefers-reduced-motion`.
- **Responsive & Centered**: Use Flexbox, Grid, or CSS absolute centering (`top: 50%`, `left: 50%`, `transform: translate(-50%, -50%)`).

### 3. Examples & Reference
See `references/google-dots-loader.md` for complete HTML, CSS, and React implementations of the Google dots loader animation.

## Best Practices & Gotchas

- **Avoid Reflows**: Do not animate layout properties.
- **Sub-pixel rendering**: Use `will-change: transform;` on heavily animated elements.
- **Clean SVG**: Keep SVG markup clean with proper viewBox and fill attributes.
