---
name: "Master New Features"
description: "Liquid Glass 4.0 Premium Expansion guidelines."
---

# Master Architectural Specification: Liquid Glass 4.0 Premium Expansion

## 1. Global Performance & Architectural Mandates
- **Strict Zero-Reflow Standard:** All dynamic motion vectors, scaling animations, particles, and shaders must update exclusively via hardware-accelerated GPU layers (`transform-gpu`, `scale`, `rotate`, `opacity`) combined with `will-change: transform`. Modifying structural layout boundaries (`top`, `left`, `margin`, `background-position`) inside rendering loops is strictly prohibited.
- **Atomic File Size Boundaries:** No single component, utility, or layout script may exceed 200 lines of code. Extract heavy rendering loops, canvas calculations, and presentational elements into isolated sub-components.
- **State Selection Strategy:** Global Zustand state store slices must be consumed using flat, atomic, shallow-baked selectors to eliminate the risk of parent-to-child cascading re-renders.
- **Data Boundary Validation:** All dynamic payloads and configuration parameters entering Server Actions or client stores must pass strict verification through runtime Zod schemas.
- **Typography Alignment:** Structural layout headers and primary branding labels must utilize the `font-outfit` family. Input components, error matrices, and technical readouts must map to the `font-inter` family.

---

## 2. Comprehensive Feature Specifications

### Feature 1: Volumetric Film-Grain Noise Shader
- **Objective:** Layer a high-fidelity, hardware-composited analog film grain effect across cinematic media displays to emulate a real physical 35mm projector backdrop.
- **Data-Flow & Mechanics:** Runs a specialized math loop modifying alpha noise masks via a hidden HTML5 Canvas or CSS noise grid within an optimized `requestAnimationFrame` cycle. Modifies pixel noise arrays inside the GPU thread to maintain a locked 120Hz output.
- **Visual Design Tokens:** `opacity-[0.03] mix-blend-overlay pointer-events-none`.

### Feature 2: Post-Purchase Ticket Shatter Simulator
- **Objective:** Metamorphose the digital checkout receipt into an interactive, multi-polygon 3D glass ticket that shatters into a scattering matrix of refractive shards upon interaction.
- **Data-Flow & Mechanics:** Listens to purchase confirmation events in `useBookingStore`. Splits the target SVG matrix into individual coordinate arrays using Framer Motion `useMotionValue`. Tracks cursor and mobile gyroscope deltas to push/pull individual polygon shards smoothly on the GPU thread.
- **Visual Design Tokens:** `backdrop-blur-md border border-white/10 shadow-macro-depth`.

### Feature 3: Dynamic Interactive Snack Tray Canvas
- **Objective:** Upgrade the culinary ordering pipeline into a vector canvas grid where items are physically dragged and dropped into the virtual cup holders of selected seats.
- **Data-Flow & Mechanics:** Monitors drag-and-drop transformations purely over hardware-accelerated X/Y coordinates. Drop confirmations trigger atomic actions that dispatch local events to emit an ambient light pulse from the designated seat grid coordinates.

### Feature 4: Chrono-Refractive Archival Reel
- **Objective:** Convert the standard order history screen into a physical 3D rolling cinema negative filmstrip, where past bookings act as translucent glass slides that degrade visually based on aging parameters.
- **Data-Flow & Mechanics:** Tracks viewport scrolling positions using Framer Motion `useScroll`. Translates temporal distance to exponential opacity decay variables directly on GPU composition frames.

### Feature 5: Biometric Specular Intensity Map
- **Objective:** Project an intelligent volumetric heatmap overlay across the interactive seat map layout to dynamically identify peak emotional response zones based on movie genres.
- **Data-Flow & Mechanics:** Fetches live seat density and metadata structures via React 19 Server Actions. Validates properties against rigorous Zod matrices and applies high-blur, color-saturated SVG paths without blocking structural pointer events.
- **Visual Design Tokens:** `backdrop-blur-[40px] saturate-[250%] bg-neutral-950/20`.

### Feature 6: Specular Holographic Ticket Shard-Fusion
- **Objective:** Emit a cascade of dynamic glass particle vectors starting directly from a locked seat index, flying across the viewport to fuse into the main digital collectible ticket.
- **Data-Flow & Mechanics:** Fires immediately upon receipt of a `success: true` payload from the booking backend layer. Particle lifecycles are isolated inside a dedicated portal container to prevent structural reflow inside layout wrappers.

---

## 3. Layer 5 Unified AI Execution Prompt

Act as a Senior Full-Stack AI Software Engineer. Your task is to implement the experimental premium feature framework defined in MASTER_NEW_FEATURES.md into our Next.js 15, React 19, Tailwind v4, and Zustand codebase.

### Core Execution Instructions:
1. Review the existing global store schemas to safely wire transaction completions, drag-and-drop actions, and scroll listeners.
2. Construct the core modular layout fragments and individual feature sub-components, strictly enforcing the sub-200 lines boundary per file.
3. Isolate particle engines, shader animations, and coordinate systems using hardware-accelerated `transform-gpu` to preserve our pristine 120Hz performance targets.
4. Set up strict Zod runtime verification contracts inside `lib/validations/` for all newly integrated data payloads.
5. Verify structural integrity and type boundaries before final deployment via `npx tsc --noEmit`.