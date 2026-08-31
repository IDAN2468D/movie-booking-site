---
name: cinedna-feature-suite
description: Architect, design, and implement next-generation cinema platform features including CineDNA Graph Explorer, Acoustic Sweet-Spot 3D Simulator, CineSquad Smart Split, Director's Cut Audio AI, and Post-Show Memory Capsules. Use when building or extending movie platform features, spec-first architecture, Web Audio spatialization, or Liquid Glass 4.0 Pro UI components.
---

# CineDNA Feature Suite & Next-Gen Cinema Architecture

Architecture, technical specifications, and implementation guidelines for next-generation cinematic features built for modern Next.js 15, React 19, Liquid Glass 4.0 Pro, Web Audio API, and MongoDB environments.

## When to Use

- When implementing or extending the CineDNA Graph Explorer for multidimensional movie relation exploration.
- When building Web Audio API 3D spatial simulation (Acoustic Sweet-Spot Simulator).
- When developing real-time collaborative group booking and split billing (CineSquad Smart Split & Sync).
- When integrating multimodal AI audio commentary and trivia engines (Director's Cut Audio Companion).
- When creating post-screening collectible memory capsules and reward shards (Post-Show Memory Capsule).

## Core Architecture Principles

1. **Specification-Driven Development (SDD):**
   - Every feature must be preceded by strict Zod schema validation boundaries.
   - Separate client state (Zustand) from immutable server mutations (Next.js Server Actions).
   - Zero direct client-side database access.

2. **Liquid Glass 4.0 Pro Design System:**
   - Use `backdrop-blur-2xl`, subtle borders (`border-cyan-500/20` or `border-amber-500/20`), and GPU accelerated transforms (`transform-gpu`).
   - Native Hebrew RTL layout (`dir="rtl"`) and ILS currency formatting (`₪`).
   - 120Hz zero-reflow animations using Framer Motion.

3. **Web Audio API Spatialization:**
   - Binaural 3D audio processing using `PannerNode`, `BiquadFilterNode`, and `GainNode`.
   - Smooth gain ramping via `linearRampToValueAtTime` to prevent audio clicks.

## Feature Overview & Reference Guides

- **CineDNA Graph Explorer:** See `references/spec-cinedna-graph.md` for complete schema, server action signatures, and canvas node layout.
- **Acoustic Sweet-Spot Simulator:** See `references/spec-acoustic-sweetspot.md` for Web Audio node graph and hall acoustic profile calculation.
- **CineSquad Smart Split & Sync:** See `references/spec-cinesquad-sync.md` for group seat synchronization and ledger split algorithms.
- **Director's Cut Audio Commentary:** See `references/spec-directors-cut.md` for Gemini multimodal commentary streaming and timestamp synchronizer.
- **Post-Show Memory Capsule:** See `references/spec-memory-capsule.md` for visual and acoustic memory shard minting and collection logic.

## Common Gotchas

- **RTL Mirroring:** Ensure directional icons and flex layouts use logical start/end properties (`ms-`, `me-`, `text-start`, `text-end`).
- **Web Audio Context Lifecycle:** Always resume `AudioContext` inside a user gesture handler (click/touch) to satisfy browser autoplay policies.
- **Zod Schema Parsing:** Use `safeParse` inside Server Actions and return structured `{ success, data, error }` responses instead of throwing unhandled exceptions.
- **Component File Size:** Keep UI component files modular and under 200 lines of code.
