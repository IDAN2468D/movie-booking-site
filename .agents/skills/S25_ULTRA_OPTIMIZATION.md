# 📱 Samsung Galaxy S25 Ultra - Mobile Optimization Skill (v1.0)

This skill governs UI/UX adaptations specifically for ultra-high-resolution, large-screen mobile devices like the Samsung Galaxy S25 Ultra.

## 📐 1. Screen Specifications
- **Resolution**: 1440 x 3120 px (QHD+).
- **Aspect Ratio**: 19.5:9 / 20:9.
- **Refresh Rate**: 120Hz (Optimization for Framer Motion).
- **Safe Areas**: Central punch-hole camera at the top. Large rounded corners.

## 🎯 2. Reachability & Ergonomics (Thumb Zone)
- **Primary Actions**: All critical buttons (Book Now, Confirm, Search Toggle) MUST be located within the bottom 40% of the screen.
- **Floating Dock**: The `MobileNav` dock should be slightly higher on Ultra screens (`bottom-8` or `bottom-10`) to accommodate the physical thumb curve.
- **Top Bar Actions**: Limit top bar interaction to non-essential elements (Settings, Secondary Profile view).

## 💎 3. High-Density Visuals (Retina/QHD)
- **Refraction Blur**: On high PPI screens, increase `backdrop-blur` to `3xl` or `4xl` for a smoother glass effect.
- **Sub-pixel Borders**: Use `0.5px` borders (or `border-[0.5px]`) for a sharper, more premium look on high-resolution panels.
- **Shadows**: Use multi-layered shadows with lower opacity (`0.15`) but larger spread (`40px+`) to utilize the screen's dynamic range.

## ⚡ 4. 120Hz Motion Standards
- **Spring Physics**: Use `type: "spring"` with `stiffness: 300` and `damping: 30` for ultra-responsive feel.
- **Layout Transitions**: Use `layout` and `layoutId` on all changing components to ensure 120Hz fluid transitions.
- **No Stutter**: Avoid heavy SVGs or complex filter-heavy components in the scroll path.

## 🛠️ 5. Implementation Directives
- **Container Sizing**: Use `max-w-screen-sm` for centered content on large screens to avoid "stretching" the UI too wide horizontally.
- **Typography Scale**: Increase base font-size slightly for "Ultra" layouts to maintain readability without overwhelming the vertical space.
- **Spacing**: Use `space-y-6` or `space-y-8` instead of standard `space-y-4` to utilize the extra vertical real estate.

## 🔍 6. Contextual Web Research
- **Responsive References**: When modifying or creating new mobile UI components, use your web search capabilities to find real-world examples of responsive mobile design from premium entertainment or movie booking platforms (e.g., Alamo Drafthouse, AMC, premium VOD apps).
- **Pattern Adaptation**: Analyze how these leading platforms handle similar layouts on ultra-wide or high-density mobile screens (e.g., seat maps, video players, horizontal scrolling grids). Adapt those proven ergonomic patterns into our unique **Liquid Glass 2.0** design system.
