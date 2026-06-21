# 🎨 Skill: Liquid Glass 3.0 Design System (UI-01)

Governs the visual language, components, and animations of the Movie Booking Site. Updated for **Liquid Glass 3.0**.

## 🗝️ Core Principles
1. **Dynamic Atmosphere**: Backgrounds and UI accents must morph based on the current context (e.g., Movie Genre) using the `ColorSync` utility.
2. **Tactile Depth**: High optical depth using 3XL blurs, multi-layered shadows, and **3D Parallax** interactions.
3. **Cinematic Motion & GPU**: 
   - All interactive or scroll-linked visual elements (like cursor trails, floating particles, hover glows) MUST use hardware-accelerated CSS properties (`transform` / `scale` / `opacity`) instead of trigger-heavy layout properties (`left` / `top` / `margin`) to prevent layout reflows and guarantee smooth 120Hz/120fps operation.
   - Use vertical holographic scanners, liquid pulses, and spring-based transitions.

## 🛠️ Visual Tokens

### 🌈 Dynamic Color Palettes (ColorSync)
- **Base Background**: Deep Black (`#000000`)
- **Interactive Highlights**: Neon Cyan (`#0AEFFF`) or Genre-specific primary.
- **Glass Base**: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(40px) saturate(200%)`.

### 🖋️ Typography
- **Headings**: `Outfit` (Premium, tracking-tighter)
- **Body**: `Inter` / `Assistant` (He)
- **Hebrew Standard**: Always use `line-height: 1.7` for Hebrew text.

### 🍱 Bento Components 3.0
- **Liquid Container (RTL Response)**:
  ```html
  <div dir="rtl" style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; line-height: 1.7; text-align: right; direction: rtl; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 24px; backdrop-filter: blur(12px); color: #F0F0F0; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);">...</div>
  ```
- **LiveActivityPulse**: Pulsing green indicators for real-time engagement.
- **Parallax Card / Orb**: 
  - Use `preserve-3d`, `drag` options, and Framer Motion for mouse-tracked or viewport-tracked rotation.
  - The AI Concierge Orb uses a breathing, translucent glass sphere design (`backdrop-blur-3xl saturate-200%`) with reactive states.
- **Occupied/Locked Seating Component**: Must be rendered as a muted glass component rather than blending into the dark background. Use `rgba(255, 255, 255, 0.03)` fill, `rgba(255, 255, 255, 0.12)` stroke, and `opacity-40` on the group wrapper.

## 🎞️ Animation Standard 3.0
- **Scanner**: Vertical scanning lines with blur and glow.
- **Pulse**: Radial expansion animations for live activity.
- **Default Transition**: `{ type: "spring", stiffness: 260, damping: 20 }`.
- **Framer Motion in SVG**: When animating `scale` or `tap` on `motion.g` elements inside SVGs, always pass coordinates `x` and `y` inside the `style` prop (e.g., `style={{ x, y }}`) rather than the native SVG `transform` attribute. This guarantees that Framer Motion correctly merges translation with scaling instead of letting the CSS transform override the SVG attribute.

## 🔍 Audit Checklist
- [ ] Does the UI adapt to the selected movie's genre?
- [ ] Is 3D Parallax or hardware-accelerated mouse-glow implemented?
- [ ] Are Hebrew responses wrapped in the mandatory Liquid Glass container?
- [ ] Does the design feel "Liquid" (blurred, saturated, vibrant)?
- [ ] Are occupied seats visible and styled with muted glass parameters?
- [ ] Are SVG hover scales safe from translation overrides (using `style={{ x, y }}`)?
