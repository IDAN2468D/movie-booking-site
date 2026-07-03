# Specular Roaring Lion Celebration Gate - Specification & Standards

## 1. Architectural & Performance Standards
- **Atomic File Architecture**: The entire overlay lifecycle, video playback nodes, and glass container constraints must be contained within a single `RoaringLionCelebration.tsx` component, strictly under 200 lines.
- **Zero Layout Reflow**: The entrance animation, backdrop glass fading, and scale transformations of the video player viewport must exclusively employ Framer Motion's GPU-accelerated transforms inside `style={{ opacity, scale }}` properties. Altering structural positioning layout attributes is strictly prohibited to guarantee a locked 120Hz render rate.
- **State Selection Strategy**: The celebration gate must be triggered using a strict, shallow-baked Zustand selector bound to the successful order completion token (`isTransactionSettled`) to eliminate cascading parent-to-child layout re-renders.
- **Media and Data Integrity**: The video player configuration must run natively with fallback streams, with player volume parameters controlled smoothly via React hooks. All checkout triggers must validate against the strict Result Pattern: `{ success: boolean; data?: any; error?: string }`.

## 2. Advanced Feature Specifications
### Feature: Specular Roaring Lion Celebration Gate
- **Objective**: Projects an absolute full-screen glassmorphic viewport playing the iconic cinema roaring lion video sequence the exact millisecond a successful transaction token registers, transforming standard payment confirmation into an immersive cinematic moment.
- **Data-Flow & Mechanics**:
  - The Next.js 15 Server Action resolves a successful booking transaction.
  - The Zustand global store catches the confirmation state and updates the active selector node.
  - The celebration component acts on the state shift, instantiating a premium HTML5 video container with absolute layout placement without causing layout style invalidations.
- **Visual Design System Tokens**:
  - Container Depth: `backdrop-blur-3xl saturate-[200%] brightness-110 bg-black/40`
  - Refractive Frame: `box-shadow: 0 0 50px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.15)`
  - Typography: Outfit (Headings), Inter (Body Text).