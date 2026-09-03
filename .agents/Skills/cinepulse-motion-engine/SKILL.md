---
name: cinepulse-motion-engine
description: Unified 120Hz GPU motion, conic neon glowing borders, 3D card tilt, thermal receipt printer physics, and zero-reflow loading states for CinePulse Liquid Glass 4.0 Pro UI. Use when building dark-mode glowing cards, interactive UI components, mouse-tracked border animations, ticket print animations, or animated loading screens.
license: MIT
---

# ⚡ CinePulse Motion Engine (120Hz GPU & Liquid Glass 4.0)

Unified hyper-performance animation engine adhering to 120Hz zero-reflow GPU constraints (`transform-gpu`, `will-change: transform, opacity`), Liquid Glass 4.0 Pro chromatic refractions, and native RTL alignment.

---

## 1. Conic Neon & Electric Glowing Borders

High-performance glowing borders for cinema cards and VIP badges using rotating conic gradients and electric SVG focal scaling.

```tsx
// Conic Glow Border Card Pattern
<div className="relative p-[1.5px] rounded-2xl overflow-hidden group transform-gpu">
  <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#ff007a,#7928ca,#00f0ff,#ff007a)] animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm will-change-transform" />
  <div className="relative rounded-2xl bg-black/85 backdrop-blur-xl border border-white/10 p-6 z-10">
    {children}
  </div>
</div>
```

---

## 2. 3D Card Tilt & Mouse Perspective Tracking

Real-time dynamic tilt calculation on mouse hover with spring physics via Framer Motion.

```tsx
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function use3DTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-12deg', '12deg']);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onMouseLeave = () => { x.set(0); y.set(0); };
  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}
```

---

## 3. Cinema Thermal Receipt Print Animation

Simulates physical ticket feed-out from an POS slot with paper tearing physics and sawtooth serrated edge.

```tsx
// Receipt Roll-Out Variants
export const receiptVariants = {
  hidden: { y: -80, opacity: 0, scaleY: 0.2, transformOrigin: 'top' },
  printing: {
    y: 0,
    opacity: 1,
    scaleY: 1,
    transition: { type: 'spring', damping: 22, stiffness: 180 }
  }
};

// Serrated Paper Edge (CSS Sawtooth)
<div className="w-full h-3 bg-repeat-x bg-[radial-gradient(circle,transparent_6px,#18181b_6px)] [background-size:16px_16px] [background-position:0_-8px]" />
```

---

## 4. Zero-Reflow GPU Loading Animations

Cinema reels, pulsating neural rings, and waveform loaders that never trigger DOM reflow.

```tsx
// Dual-ring GPU Loader
<div className="relative w-12 h-12 flex items-center justify-center transform-gpu">
  <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin will-change-transform" />
  <div className="w-6 h-6 rounded-full border-2 border-rose-500/20 border-b-rose-400 animate-spin-reverse will-change-transform" />
</div>
```

---

## 5. Implementation Rules
- **GPU Exclusivity:** Animate only `transform` and `opacity`. Never animate `width`, `height`, `margin`, or `padding`.
- **RTL Geometry:** Use `origin-right` or symmetrical transforms (`origin-center`) so transitions preserve alignment in Hebrew RTL mode.
- **200 LOC Ceiling:** Keep individual animation components modular under `components/ui/motion/`.
