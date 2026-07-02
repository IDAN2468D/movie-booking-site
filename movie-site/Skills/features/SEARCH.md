# SEARCH.md - Neural Specular Search Engine Spec

## 1. Architectural Overview
The Neural Specular Search Engine transforms the standard homepage search into an immersive, hyper-fast cinematic discovery interface. It integrates instantaneous fuzzy filtering with a high-optical-depth refractive dropdown, fully adhering to Liquid Glass 3.0 performance and fluid motion standards.

## 2. Technical Stack & Core Mechanics
- **Component**: `NeuralSearch.tsx` (Atomic component, maximum 200 lines).
- **State Management**: Zustand (with strict selectors) paired with local state for immediate keystroke responsiveness.
- **Search Logic**: Client-side Instant Fuzzy Filtering for ultra-low latency, with an architecture ready to pipe into the `/discover/neural` (Neural Discovery Pipeline) for mood and biometric filtering expansion.
- **Error & Data Handling**: Follows the strict Result Pattern: `{ success: boolean; data?: any; error?: string }`.

## 3. UI & Liquid Glass 3.0 Design Tokens
- **Refraction Container**: 
  - Style: `backdrop-blur-3xl saturate-[200%] brightness-110`
  - Depth: `box-shadow: 0 0 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)`
- **Typography**: Headings use `Outfit`, body/input uses `Inter`.
- **Theme**: Premium futuristic dark mode.

## 4. Hardware-Accelerated 120Hz Motion (Zero-Reflow)
- **Rule**: Absolutely zero browser layout reflow allowed during dropdown transitions or hover states.
- **Implementation**: 
  - Use GPU-accelerated `x`/`y` transforms or `opacity` via Framer Motion.
  - NEVER animate layout positioning attributes (`left`, `top`, `margin`, `height` scaling) that trigger browser recalculations.
  - Dropdown expansion must use scale/opacity animations that operate on the GPU layer to sustain a locked 120Hz fluid refresh rate.