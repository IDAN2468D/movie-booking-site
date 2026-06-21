# 🎨 Liquid Glass 3.0 - Design System

The visual theme is a premium, futuristic dark mode that balances high optical depth, real-time light refraction, and high-performance layout transitions.

## 🗝️ Core Tokens

### 🌈 ColorSync Palette
The theme dynamically changes primary and secondary highlights depending on the current movie selection:
- **Base Background**: `#0A0A0A` (Deep velvet mesh)
- **Glass Panel Base**: `rgba(255, 255, 255, 0.03)`
- **Border Refraction**: `rgba(255, 255, 255, 0.08)`
- **Dynamic Accents**: Neon Cyan (`#0AEFFF`), Gold/Orange (`#FF9F0A`), or Magenta (`#FF1464`).

### 🖋️ Typography (Outfit & Inter)
- **Headings**: `Outfit`, sans-serif (tracking-tighter, semi-bold/black).
- **Body & Captions**: `Inter`, sans-serif.
- **Hebrew Standard**: Always use `line-height: 1.7` for Hebrew content to preserve readability with high-density fonts.

---

##  Bento Components 3.0

### 1. Liquid Glass Card
Use CSS classes to construct standard cards:
```html
<div class="glass backdrop-blur-3xl saturate-200 border border-white/8 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
  <!-- Card content -->
</div>
```

### 2. Holographic Scanner Effect
Adds a moving laser scan animation over active panels:
```css
.shimmer::after {
  content: '';
  position: absolute;
  top: -100%;
  left: -100%;
  width: 300%;
  height: 300%;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 45%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.05) 55%,
    transparent 100%
  );
  animation: shimmer 8s infinite linear;
}
```

### 3. Occupied Seating Component
Occupied or locked seats must remain visible as a muted glass component rather than blending into the dark background. Use `rgba(255, 255, 255, 0.03)` fill, `rgba(255, 255, 255, 0.12)` stroke, and `opacity-40` on the group wrapper.

---

## 🎞️ 120Hz Animation Standard

To prevent browser repaint-heavy layout reflows (especially during cursor following or scroll triggers):
1. **Always Use**: CSS `transform: translate3d(x, y, 0)`, `scale()`, and `opacity` properties.
2. **Never Use**: Direct modifiers for layout dimensions: `left`, `top`, `margin-left`, `width`, or `height`.
3. **Hardware Acceleration**: Set `willChange: "transform, opacity"` on highly dynamic particles.
4. **Framer Motion in SVG**: When animating `scale` or `tap` on `motion.g` elements inside SVGs, always pass coordinates `x` and `y` inside the `style` prop (e.g. `style={{ x, y }}`) rather than the native SVG `transform` attribute. This guarantees that Framer Motion correctly merges translation with scaling instead of letting the CSS transform override the SVG attribute.
