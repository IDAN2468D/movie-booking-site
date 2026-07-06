# Specular Auth Gate Parallax Scrolling Specification (v1.0)

## 1. Architectural Overview
This specification injects a high-performance, non-blocking multi-layered Parallax Scrolling engine into the `auth-gate` layout template view. By mapping viewport scroll vectors directly to isolated GPU composition layers, we establish premium cinematographic depth without shifting DOM elements or causing layout reflows.

## 2. Core Architectural & Performance Mandates
- **Zero-Reflow Composition**: Traditional scroll listeners that read/write properties like `scrollTop` or mutate element `top`/`margin` attributes are strictly forbidden. Parallax offsets must utilize Framer Motion's `useScroll` and `useTransform` hooks, tracking exclusively via `transform-gpu` and `y` matrix properties.
- **Atomic Code Boundaries**: The main container and each depth layer (Background Mesh, Refractive Ribbons, Form Layer) must remain encapsulated in modular sub-components strictly under 200 lines per file.
- **Locked 120Hz Threading**: Use `will-change: transform` on all animated layers to force immediate browser layer isolation inside the compositor.

## 3. Depth Layer & Mathematical Mapping
The view container is divided into three discrete depth fields, calibrated by precise speed displacement ratios. For any given viewport scroll displacement $\Delta Y$, the layer translate offset is computed as:
$$Y_{\text{layer}} = \Delta Y \times (\text{SpeedFactor} - 1)$$

| Layer Profile | Components & Tokens | Speed Factor | Visual Behavior |
| :--- | :--- | :--- | :--- |
| **Layer 1 (Deep Background)** | Immersive dark mesh + custom radial oklab gradients | `0.15` | Drifts slowly, generating an illusion of infinite cosmic distance. |
| **Layer 2 (Midground Objects)** | Translucent refractive glass shapes with `backdrop-blur-sm` | `0.40` | Passes across the viewport at mid-velocity, distorting background gradients. |
| **Layer 3 (Foreground Gate)** | `AuthGateForm` utilizing heavy Obsidian Glass tokens | `1.00` | Anchor component, scrolls naturally or with tight responsive inertia tracking. |

## 4. Visual Tokens Alignment (Liquid Glass 4.0)
- **Glass Blending**: All midground floating objects must carry sub-pixel chromatic borders combined with multi-layered `box-shadow` structures.
- **Typography Matrix**: Section markers map to `font-outfit`, data arrays/technical requirement descriptions track to `font-inter`.