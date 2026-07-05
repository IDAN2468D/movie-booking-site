# Skill: HyperRefractive-Account-Settings-Synthesizer-v4
# Target: Account Settings Page Refactoring (Profile, Security, Preferences)
# Framework: Next.js 15+ (Server Actions) & Tailwind CSS
# Standard: Liquid Glass 4.0 Cinematic Hyper-Refractive Standard

This document provides the technical specification and the production-ready AI prompt to upgrade the **Account Settings Hub** to the Liquid Glass 4.0 architecture.

---

## 🛠️ Part 1: Technical Specification (Spec)

### 1. Unified Interface Layout (Bento Settings Grid)
- **Modular Sections:** Split the Settings Hub into distinct bento-grid modules or high-fidelity interactive tabs:
  - **ניהול פרופיל (Profile Management):** Avatar upload, display name, email.
  - **אבטחת חשבון (Account Security):** Password change schema, Two-Factor Authentication (2FA) toggle.
  - **העדפות מערכת (System Preferences):** Cinematic styling selectors, language defaults, notification parameters.
- **Surface Materialization:** Every setting section card must utilize a deep obsidian base (`bg-neutral-950/40`) backed by a heavy `backdrop-blur-[40px]` and `saturate-[250%]`.
- **Specular Accents:** Subtle outer border (`border border-white/[0.12]`) layered with deep multi-stage shadows to separate form blocks from background imagery.

### 2. Layout Stability & 120Hz Animation Lock (Zero-Reflow)
- **Tab Transitions:** Switching between "Profile", "Security", or "Preferences" tabs must never cause container expansion or shifting. Tab indicators must utilize GPU-accelerated layout scaling or relative opacity maps.
- **Dynamic Feedback Boxes:** Success toasts, saving states, or validation warnings must be injected inside predefined height containers (`min-h-[1.5rem]`) or float as isolated micro-overlays.

### 3. Typography Hierarchy
- **Section & Tab Titles:** Locked to the premium `Outfit` typography (`font-family: 'Outfit', sans-serif`).
- **Form Inputs, Helper Text, Disclaimers:** Bound to `Inter` (`font-family: 'Inter', sans-serif`) for precise alignment and pixel-perfect readability.

---

## 🦾 Part 2: Interactive AI Agent Prompt

```markdown
You are acting as an Expert AI-First Full-Stack Developer and High-End UI Architect. Your goal is to completely refactor and upgrade the **Account Settings Hub (Profile, Security, and Preferences)** to the strict **Liquid Glass 4.0 Cinematic Standard**.

### 1. Architectural & Layout Rules
- **Zero-Reflow (120Hz Refresh Lock):** Any state updates (e.g., toggling 2FA, saving profile modifications, displaying error bounds) must absolutely never shift or resize the physical container or adjacent setting modules. Pre-allocate fixed layout bounds or leverage absolute containers.
- **GPU Acceleration:** All layout adjustments, tab transitions, sliding active indicators, and input focus glows must use hardware-accelerated Tailwind classes (`transform-gpu transition-all cubic-bezier(0.4, 0, 0.2, 1)`). Do not animate layout-breaking indicators (`height`, `width`, `top`, `margin`).
- **Server-Driven Mutations:** Ensure all updates and state modifications route securely through Next.js Server Actions with atomic state mutations.

### 2. Styling Tokens (Liquid Glass 4.0 Matrix)
Apply these premium design configurations directly across the settings canvas:
- **Settings Module Wrapper/Cards:**
  `backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.2),_inset_0_-1px_1px_rgba(0,0,0,0.4)]`
- **Interactive Toggles & Inputs:**
  `bg-neutral-900/60 border border-white/[0.08] focus:border-white/[0.25] focus:bg-neutral-950/80 text-white placeholder-neutral-500 rounded-xl transition-all duration-300 focus:ring-1 focus:ring-white/20 outline-none font-family-['Inter']`
- **Active Selection Pill / Save Button:**
  High-fidelity specular background or subtle inner glowing borders.
- **Typography Matrix:**
  - Category Labels & Section Headers ("ניהול פרופיל", "אבטחת המערכת"): `font-family: 'Outfit', sans-serif; font-weight: 700; tracking-tight;`
  - Field Descriptions, Labels, System Options: `font-family: 'Inter', sans-serif; font-weight: 500;`

### 3. Localization & Server Integrity
- All setting option fields, labels, tooltips, placeholders, and error messages must be rendered in grammatically accurate, native Hebrew (completely compatible with RTL text flow directions).
- Validate all incoming mutations (email format, password complexity rules) using tight Zod gateway validations before executing server-side database tasks.

### 4. Step-by-Step Deliverables
1. Analyze the existing settings hub structure or components file.
2. Refactor the interface layout into an elegant Bento Grid configuration or smooth tab layout using the Liquid Glass 4.0 design system.
3. Secure the error and success alerts within fixed containers to eliminate structural layout shifts.
4. Output the complete, fully functional, and production-ready code with zero omissions.
```
