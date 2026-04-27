# 🎨 Skill: Liquid Glass 2.0 Design System (UI-01)

Governs the visual language, components, and animations of the Movie Booking Site.

## 🗝️ Core Principles
1. **Refraction & Depth**: High optical depth using 3XL blurs and multi-layered shadows.
2. **Futuristic Dark Mode**: Deep blacks (`#000000`) with vibrant cyan (`#0AEFFF`) and orange (`#FF9F0A`) highlights.
3. **Cinematic Motion**: Smooth, spring-based transitions using Framer Motion.

## 🛠️ Visual Tokens

### 🌈 Color Palette
- **Background**: Deep Black (`#000000`)
- **Primary**: Cyan Neon (`#0AEFFF`) - *Interactive elements*
- **Accent**: Sunset Orange (`#FF9F0A`) - *Highlights & Alerts*
- **Glass**: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(24px)`

### 🖋️ Typography
- **Headings**: `Outfit` (Sans-serif, Wide, Premium)
- **Body**: `Inter` (Clean, Legible)
- **Mixed RTL**: Ensure `Assistant` is used as a fallback for Hebrew body text.

### 🍱 Components
- **Liquid Container**: 
  ```css
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  ```
- **Interactive States**: Hover effects should include a `brightness(1.2)` and a subtle `box-shadow` glow.

## 🎞️ Animation Standard (Framer Motion)
- Use `layoutId` for shared element transitions between screens.
- Default transition: `{ type: "spring", stiffness: 260, damping: 20 }`.

## 🔍 Audit Checklist
- [ ] Does the component feel "premium" and "glassy"?
- [ ] Is there enough contrast for accessibility on the dark background?
- [ ] Does it use the mandatory `Outfit` / `Inter` font stack?
- [ ] Are Hebrew texts properly aligned and RTL-compliant?

---
> [!TIP]
> Use `saturate-[200%]` on glass panels to make the background colors "pop" through the blur.
