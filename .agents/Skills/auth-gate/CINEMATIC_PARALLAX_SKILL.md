# Specular Cinematic Fixed-Gate Parallax Engine (v6.0 Ultimate Master Matrix)

## 1. Architectural Overview
This specification establishes the definitive 400vh multi-layered physical projection matrix that completely decouples the interactive foreground user interface from the layout scrolling lifecycle. The system Brand Logo, subtitle elements, and the primary `AuthGateForm` Obsidian Glass container remain perfectly fixed and stable. Concurrently, a multi-velocity cinematic backdrop matrix tracks the viewport scroll vector ($\Delta Y$) to dynamically translate the core content profiles of Next.js image assets (`image_0.png` to `image_3.png`) alongside volumetric light layers, independent exposure masks, and spatial letter streams on isolated hardware compositor layers.

## 2. Core Performance & Atomic Mandates
- **Static Foreground Isolation**: The central layout tree wrapping the branding components and the interactive form card must utilize viewport layout anchoring (`position: fixed` or `inset-0`). It must remain 100% static, ensuring zero physical element translation during browser scroll actions.
- **Event Propagation Pass-Through**: The fixed foreground viewport container must be declared with `pointer-events-none`, while the actual form card container overrides this with `pointer-events-auto`. This guarantees form inputs, clicks, and focus states remain fully interactive.
- **Zero-Reflow Content Parallax**: Animating background positions via CSS property `background-position` or standard element placement coordinates (top, left, margin) is strictly prohibited. Parallax content shifts must drive hardware layers exclusively via Framer Motion's `transform-gpu` variables (`y`, `scaleX`, `scale`, `opacity`) and `will-change: transform` to keep a locked 120Hz execution thread.
- **Atomic Structural Boundaries**: To preserve clean maintainability, individual sub-layers, ambient particles, typography matrices, and projection light cones must be encapsulated in separate modular files strictly under 200 lines of code each.

## 3. Comprehensive Parallax Image-Content Matrix
The 400vh scroll canvas tracks the scrolling offset ($\Delta Y$) to compute isolated hardware transformations across the background tiers:

| Layer Profile | Module Asset Configuration & Source Paths | Speed Factor | Content Motion & Optical Profile |
| :--- | :--- | :--- | :--- |
| **Layer 1 (Deep Base)** | `image_0.png` — Dark futuristic theater hall bokeh grid | `0.05` | Drifts infinitesimally, shifting the structural perception of the virtual movie house. |
| **Layer 1b (Projector Beam)**| `ProjectorBeamLayer.tsx` — Conical radial OKLAB glow beam | `0.09` | Skews, scales, and rotates, changing ambient lighting angles continuously. |
| **Layer 2 (Linear Flares)** | `AnamorphicFlareLayer.tsx` — Neon cyan/indigo streak vectors | `0.14` | Flare streaks stretching horizontally (`scaleX`) and brightening (`opacity`) based on scrolling velocity. |
| **Layer 2b (Film Shards)** | `FilmstripLayer.tsx` / `image_1.png` — Glass negative frames | `0.38` | Translucent glass negative matrices translating vertically beneath the fixed gate. Wrapped in `backdrop-blur-md`. |
| **Layer 3a (Typography)** | `TypographyParallaxLayer.tsx` — Hollow outlined text streams | `0.70` | Ultra-fast vertical sweep of stroked cinema parameters ("CINEMA", "PREMIUM"). Uses transparent fills. |
| **Layer 3b (Cinema Dust)** | `CinematicDustLayer.tsx` / `image_2.png` — Glowing particle motes| `0.22` | Particle background texture shifting vertically with an active, smooth horizontal noise drift. |
| **Layer 3c (Focus Laser)** | `image_3.png` — Intense white-gold projection laser beam streams| `0.55` | Glides quickly across the viewport, splitting light into hyper-chromatic screen blend profiles. |
| **Layer 4 (Stage Anchor)** | Brand Logo Module + Supporting Subtitles + `AuthGateForm` card | `0.00` | Fixed foreground layer canvas center. Absolute element immutability. |

## 4. Visual Tokens & Design Alignment
- **Anamorphic Flares Blend**: Designed using thin linear gradients (`from-transparent via-cyan-500/20 via-indigo-500/30 to-transparent`) paired with `mix-blend-mode: screen`.
- **Hollow Text Outlines**: Handled via `-webkit-text-stroke: 1px rgba(255,255,255,0.03)` with transparent fills.
- **Typography Execution**: Layout branding components and main headers utilize `font-outfit`. Tactical input fields, requirement text logs, placeholders, and error strings map to `font-inter`.