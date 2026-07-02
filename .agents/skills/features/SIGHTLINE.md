🚀 SIGHTLINE.md: Cinematic Specular Sightline Engine (v4.2)

An interactive perspective viewport simulation calculating and rendering the exact visual sightline from a selected seat matrix coordinate to the virtual cinema screen.

1. Core Architectural Specs
- Rendering Engine: Pure CSS 3D Transforms (`rotateX`, `rotateY`, `perspective`) combined with GPU-accelerated layers. Avoid heavy WebGL bundles to maintain a micro-bundle footprint (<12kb).
- Performance Constraint: Sightline transformations must hook into Framer Motion dynamic style variables or native GPU layers. Absolutely no layout repositioning attributes (left/top) allowed.
- State Management: Integrate with the existing Zustand store using strict selectors to query only `hoveredSeatCoordinates`. This prevents master theater grid layout re-renders.

2. Mathematical Viewport Perspective Rules
- Calculate the aspect ratio distortion based on the horizontal offset $\Delta X$ from the center of the screen row and the vertical depth distance $Y$ from the screen plane.
- Apply a dynamic transformation matrix to the live video preview container using the following angular distortion principles:
  $$\theta_{distortion} = \arctan\left(\frac{\Delta X}{Y}\right)$$
- Transform matrices must map cleanly to Tailwind CSS arbitrary values via inline GPU CSS variables (`--sightline-transform`).

3. Liquid Glass 3.0 Sightline Aesthetics
- Refractive Chromatic Aberration: The preview window must feature high optical depth using `backdrop-blur-3xl saturate-[200%] brightness-110`.
- Depth & Shadows: Outer boundaries must utilize the mandatory visual tokens: `box-shadow: 0 0 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)`.
- Ambient Backdrop Glow: Dynamically sample the current movie poster metadata to cast a matching canvas blur backdrop glow behind the viewport container.