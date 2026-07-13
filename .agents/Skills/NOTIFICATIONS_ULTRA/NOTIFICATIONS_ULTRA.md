# Specular Neural Notification Pipeline - Ultra Visual Spec (v4.1)

## 1. Visual Overhaul Objective
Upgrade the notification overlay from a passive glass panel into an explosive, high-contrast cinematic viewport. The design must leverage intense volumetric lighting, deep multi-layered parallax depth, and animated kinetic boundaries to command user attention immediately upon trigger.

## 2. Ultra-Premium Design Tokens
- **Volumetric Ambient Mesh:** Instead of standard opacity, the container utilizes absolute pseudo-elements generating a multi-layered radial blur gradient (`blur-[80px]`) that simulates glowing neon gas behind the glass layer.
- **Kinetic Conic Borders:** Active/Unread alerts inject a moving, continuous chroma trail around the sub-pixel border using CSS custom properties interpolated via GPU transitions.
- **3D Parallax Perspective:** The drop-down overlay implements a structural perspective matrix (`perspective(1200px) rotateX(4deg)`) on entry, resolving into a crisp flat plane on complete idle to establish immediate spatial dominance.

## 3. Severity Aesthetics (Max Overdrive)
- `INFO`: Ice-blue cold specular shimmer (`rgba(56,189,248,0.2)`) with a continuous slow ambient breathing animation.
- `SYSTEM_ALERT`: Hyper-kinetic solar flare amber pulse (`rgba(245,158,11,0.4)`) with an immediate 5% container scale snap on load.
- `VIP_AUCTION_OUTBID`: Deep amethyst neon eruption (`rgba(168,85,247,0.5)`) bound to a high-frequency mix-blend-mode overlay (`mix-blend-overlay`), creating a dramatic shifting aurora effect.

## 4. Hardware and Code Governance
- **Zero-Reflow Absolute Rule:** All kinetic behaviors, glowing shifts, expansions, and particle trails MUST be executed via `transform: translate3d/rotate3d/scale3d` and `opacity`. Absolute ban on mutating flex-gaps, padding, or layout boundaries.
- **Micro-Component Split:** To keep files under the strict 200-line ceiling, the glow meshes and item cards must be separated into atomic sub-components.