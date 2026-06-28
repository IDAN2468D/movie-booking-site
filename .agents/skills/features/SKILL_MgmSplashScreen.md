---
type: skill
status: active
tags: [ui, animation, audio, nextjs15, framer-motion]
project: movie-booking-site
---

# SKILL: Cinematic MGM-Inspired Splash Screen

## 🎯 Executive Overview
Build a state-of-the-art, premium **Splash Screen component** inspired by the iconic **MGM roaring lion intro**, but reimagined with a futuristic **Liquid Glass & Neon Cyber** aesthetic for **"MOVIEBOOK Premium Cinema"**.

## 🛡️ Strict Boundaries & Rules
- **No REST APIs:** Exclusively client-side presentation engine with seamless integration into the Next.js 15 root layout.
- **RTL-Safe Architecture:** Ensure all horizontal text animations and "Skip" button positions adapt natively to Hebrew boundaries without breaking layout tracking.
- **Token Diet Compliance:** Do not perform full repository scans. Rely purely on this specification file.

---

## 🛠️ Feature Design Specifications

### 🔊 1. Audio Integration & Autoplay Safe-Guard
- Utilize native HTML5 `Audio` API.
- Since modern browsers block autoplay with sound, handle browser policies gracefully:
  - Attempt to play automatically. If blocked, smoothly display a premium, ultra-minimalist overlay blur with a text indicator: `"לחץ לחוויה קולנועית / Tap for Cinematic Experience"`.
- **Sound Profile:**
  - **0.0s - 1.5s:** Deep sub-bass drop / low frequencies rumble.
  - **1.5s - 3.5s:** Powerful, modern electronic synth swell / futuristic "cyber roar" peaking at the logo reveal.

### 🌌 2. Advanced VFX & Atmosphere
- **The MGM Ring Matrix:** A multi-layered concentric 3D circular ring system built using heavy Tailwind frosting effects (`backdrop-blur-xl bg-slate-900/40 border border-white/10`).
- **Obsidian Deep Background:** Background color locked to pure cinematic dark obsidian (`#05070B`).
- **Anamorphic Light Leaks:** Soft glowing particles or radial gradients mimicking shifting neon gold (`#FFB800`) and cyber teal (`#00F0FF`) backlights.

### 🎬 3. Core Animation Timeline (Framer Motion Sequence)

| Phase | Time Window | VFX Action | Animation Tokens |
| :--- | :--- | :--- | :--- |
| **Phase 1: Activation** | `0.0s - 1.5s` | Concentric glass rings spin into place along the Z-axis. Neon energy beam circles the perimeter. | `stiffness: 120, damping: 12` (Aggressive Spring) |
| **Phase 2: Metamorphosis** | `1.5s - 3.5s` | Center ring pulses violently with an expanding blurred radial shockwave. The **MOVIEBOOK Fusion Icon** scales up, vibrating to the audio frequency. Horizontal lens flares trigger. | `scale: [0, 1.2, 1]`, custom keyframes shaking effects. |
| **Phase 3: Ignition** | `3.5s - 4.5s` | Typography ignition: **"MOVIE"** (Metallic crisp white) snaps with camera blur. **"BOOK"** (`#FFB800`) explodes with neon flicker. | `filter: ["blur(10px)", "blur(0px)"]` + rapid opacity flicker. |
| **Phase 4: Dissolve** | `4.5s+` | Smooth scale down and fade out via `AnimatePresence` to render the actual app beneath. | `scale: 0.95`, `opacity: 0` |

---

## 🏗️ Technical Target Mapping
- **File Location:** `@/src/components/ui/MgmSplashScreen.tsx`
- **Typography Layout:** Text must follow premium Hebrew layout parameters using `Heebo` or `Rubik` with explicit `leading-relaxed`.
- **Skip Control:** A sleek, transparent `"דלג / Skip"` button placed safely in the top-left viewport boundary (properly aligned for RTL-first view).

## 🛑 Validation Checklist for AI Agent
- [V] Autoplay rejection does not crash the layout or freeze screen transition.
- [V] Component is fully self-contained as a client component (`"use client"`).
- [V] No layout shifting or horizontal scrollbars occur during the high-velocity horizontal flare animations.
- [V] TypeScript compiles with 0 errors (`npx tsc --noEmit`).