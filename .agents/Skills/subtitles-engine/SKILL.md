---
name: Subtitles Engine
description: Instructs the agent on how to build and maintain the Dynamic Specular Subtitles Engine.
---

# Dynamic Specular Subtitles Engine (SUBTITLES.md)

## 1. Core Architecture Rules
- **Atomic File Architecture:** No single file may exceed 200 lines. Isolate complex typography and refraction layers into micro-subcomponents distributed logically.
- **State Selection Strategy:** Zustand global state stores (active subtitles, audio frequencies) must be consumed strictly using atomic, shallow-baked selectors to eliminate any risk of cascading parent-to-child layout re-renders.
- **Zero-Reflow Enforcement:** All dynamic scaling, position offsets, and typography animations must utilize WebGL or GPU-accelerated x/y transforms (`style={{ x, y }}`) via Framer Motion instead of shifting layout properties like `margin` or `top/left`.

## 2. Feature Specifications
- **Objective:** Renders real-time translation subtitles wrapped inside a glassmorphic micro-container that dynamically alters its visual density, backdrop refraction, and subtle chromatic scale based on real-time audio analysis and background contrast.
- **Data-Flow & Mechanics:**
  - Connects to the active media runtime audio node via the native Web Audio API (`AnalyserNode`) to capture frequency bytes.
  - Maps frequency levels directly into GPU-accelerated custom CSS properties or Framer Motion variants (`whileHover` / continuous scale loop).
  - Evaluates rendering bounds against a runtime Zod schema to ensure data integrity before rendering text nodes.
- **Visual Design System Tokens:**
  - **Refractive Layer:** `backdrop-blur-md saturate-[160%] bg-white/5`
  - **Depth Layout:** `border border-white/10 box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4)`
  - **Typography:** `font-sans tracking-wide text-white/90 selection:bg-amber-500/30`
