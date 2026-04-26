# ⚡ Skill: Ultra Optimization & Ergonomics (Opt-02)

Focuses on performance, mobile ergonomics (S25 Ultra), and high-refresh-rate smoothness.

## 📐 1. Screen & Performance Standards
- **QHD+ Ready**: Ensure assets look sharp on 1440p+ displays.
- **120Hz Motion**: Framer Motion must use `type: "spring"` for fluid, lag-free transitions.
- **Skeleton Strategy**: Every async component MUST have a refractive skeleton loader.

## 🎯 2. The "Thumb Zone" Rule
For large screens like the S25 Ultra:
- **Critical Actions**: Buttons must stay in the bottom 40% of the viewport.
- **Safe Areas**: Use `react-native-safe-area-context` (or CSS `env(safe-area-inset-*)`) religiously.

## 💎 3. High-Density Visuals
- **Micro-Borders**: Use `0.5px` borders for extreme sharpness.
- **Layered Shadows**: Multi-layered shadows with low opacity (5-10%) for maximum depth.
- **Refraction Boost**: Use `backdrop-blur-3xl` for high-PPI screen clarity.

## 🛠️ Performance Audit Checklist
- [ ] Are images using `next/image` with proper `sizes`?
- [ ] Is `LCP` under 1.5 seconds?
- [ ] Do all interactive elements have a tactile hover/active state?

---
> [!IMPORTANT]
> When testing on mobile, ensure the floating nav doesn't obstruct the device's native gesture bar.
