---
name: add-elements
description: "Build Elements from its verified authored source using Raw WebGL2 + Canvas 2D, including the complete renderer, interactions, and required assets. Use when Codex needs to implement, port, or adapt this effect without requiring the ThreeUI package or reconstructing the visual from an approximation."
---

# Build Elements

## Description

Water, lightning, fire, condensation, and a painterly generative tree collected as one elemental family across WebGL2 and Canvas 2D.

Recreate the authored behavior from the verified source, not from screenshots or the abbreviated orchestration sample in this skill. The implementation may live directly in the target project and does not require `@designcodeio/threeui`.

## Technologies

- React variant host
- Three focused raw WebGL2 Elemental Marks panels
- Painterly Canvas 2D Generative Tree
- Existing transparent Canvas 2D Condensation renderer
- Allow-scripts-only source sandbox
- Lazy-loaded variant boundaries

## Verified source material

- `elemental-marks.html — complete water, lightning, and fire source`
- `src/shaders/elements/sources/elemental-marks.html`
- `src/shaders/elements/ElementsBackground.tsx`
- `src/shaders/elements/ElementsCollection.tsx`
- `generative-tree.html — complete authored Canvas 2D renderer`
- `src/shaders/elements/sources/generative-tree.html`
- `src/shaders/elements/GenerativeTree.tsx`
- `src/shaders/condensation/condensationRenderer.ts`
- `src/shaders/condensation/CondensationBackground.tsx`

Source revision: `SHA-256 7a6871fe99fa`

## Implementation steps

1. Open every verified source file listed above and identify the renderer, host lifecycle, styles, and assets before editing.
2. Keep ElementsCollection as the public entry point and select water, lightning, fire, condensation, or generative-tree with the variant prop.
3. Package the complete Elemental Marks HTML byte-for-byte, focus one authored panel, and apply the documented higher-resolution scale and detail refinements only in the React presentation adapter while preserving its mark paths and pointer behavior.
4. Lazy-load Condensation through its existing renderer and Generative Tree through its byte-exact Canvas 2D sandbox so each lifecycle remains independent.
5. Expose the shared speed, size, particles, opacity, and palette controls for WebGL2 marks and Generative Tree while keeping Condensation's speed, drops, and opacity controls.
6. Mount only the selected family component and preserve sandbox, visibility, reduced-motion, resize, pointer, and cleanup lifecycles.
7. Give the local component a sized, overflow-controlled parent and verify desktop, mobile, reduced-motion, and context-loss behavior.

Asset handling: This effect has no required external assets.

## Local component example

Import the copied local component rather than a package entrypoint:

```tsx
import { ElementsCollection } from "./effects/elements/ElementsCollection";
import "./effects/elements/styles.css";

export function Scene() {
  return <div className="effect-frame"><ElementsCollection /></div>;
}
```

## Core renderer pattern

This excerpt documents orchestration only. Copy the exact shader, geometry, pass, and interaction code from the verified source files.

```tsx
<ElementsCollection variant="lightning" speed={1.1} particleAmount={1.2} />
```

## Behavior contract

- Runtime: Raw WebGL2 + Canvas 2D
- Passes: 1 selected composition — up to 3 WebGL2 passes or 1 Canvas 2D pass
- Interaction: Variant selection, pointer-reactive marks and tree wind, speed, scale, particles, palette, and opacity
- Assets: Three embedded vector brand paths; no external binary assets
- **renderer** (host): Sandboxed WebGL2 or Canvas 2D
- **variants** (fixed): Water + Lightning + Fire + Condensation + Generative Tree
- **source** (fixed): Complete authored Elemental Marks + Generative Tree documents
- **assets** (embedded): Three vector mark paths; no external tree assets

## Verification

1. Compare the rendered composition, animation timing, pointer behavior, and state transitions with the source implementation.
2. Exercise resize, high-DPI, mobile/coarse-pointer, reduced-motion, tab visibility, and WebGL context-loss paths where applicable.
3. Confirm every animation frame, observer, listener, geometry, buffer, texture, framebuffer, material, and renderer is released on teardown.
4. Check the browser console and confirm the effect renders at native-or-better backing resolution.

## Guardrails

- Do not substitute a visually similar package, demo, shader, or runtime.
- Do not approximate, reconstruct, or simplify the authored GLSL, render passes, geometry, interaction state, or assets.
- Keep exact source and asset hashes under regression tests when the source project provides them.
- Adapt only the surrounding host boundary needed by the target project; keep renderer behavior intact.
