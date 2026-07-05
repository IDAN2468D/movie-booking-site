# Spec & Prompt: Auth Gate Upgrade to Liquid Glass 4.0

This document contains the full architectural specification and the interactive AI prompt required to upgrade the **Auth Gate (Login/Registration)** component to the next-generation **Liquid Glass 4.0** standard.

---

## 🛠️ Part 1: Technical Specification (Spec)

### 1. Visual Architecture (Liquid Glass 4.0 Layout)
- **Container Surfaces:** Deep Obsidian base (`bg-neutral-950/40`) layered with a massive `backdrop-blur-[40px]` and `saturate-[250%]`.
- **Chromatic Sub-Pixel Borders:** Multi-layered specular border emulation to capture light refracting across the component.
- **Shadow Synthesis:** Heavy macro-depth shadow combined with an aggressive white inner stroke (`inset 0 0 0 1px rgba(255,255,255,0.12)`) to give a concrete material separation from the cinematic background.
- **Interactive States:** Floating inputs must utilize GPU-accelerated micro-translations (`transform-gpu`) on focus. Pure black background or neon glass fills on input active states.

### 2. Layout Stability & Zero-Reflow (120Hz Lock)
- **Error/Success Indicators:** Localized Hebrew error or validation notifications must reside within a fixed-height layout box or use absolute overlays to avoid moving or resizing adjacent input elements or buttons upon triggering.
- **Transitions:** Mode switching between "Sign In" and "Sign Up" must use structural sliding transitions using layoutId or GPU-accelerated opacity maps to ensure high-refresh-rate smoothness.

---

## 🦾 Part 2: Production-Ready AI Agent Prompt

```markdown
You are acting as an Expert AI-First Full-Stack Developer. Your goal is to completely refactor and upgrade the **Auth Gate / Login & Registration component** to comply with the strict **Liquid Glass 4.0 (Cinematic Hyper-Refractive) Standard**.

### 1. Strict Structural Rules
- **Zero-Reflow (120Hz Lock):** Any error messages, validation tooltips, or loading states must never alter the structural height or width of the main container. Pre-allocate height or use absolute positioning (`absolute bottom-...`) to lock layout positions.
- **GPU Acceleration:** All transition animations (focus rings, button hover glow, sign-in/sign-up switching) must explicitly use `transform-gpu` to offload computation. Never animate layout-disruptive properties like `height`, `width`, `top`, or `margin`.
- **File Modularity:** Keep the component highly focused. Separate form fields or specialized visual background wrappers into sub-components if total length exceeds 250 lines.

### 2. Styling Spec & Tailwind Tokens
Apply the precise Liquid Glass 4.0 aesthetic values directly:
- **Main Glass Card:**
  `backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.2),_inset_0_-1px_1px_rgba(0,0,0,0.4)]`
- **Premium Input Fields:**
  `bg-neutral-900/60 border border-white/[0.08] focus:border-white/[0.25] focus:bg-neutral-950/80 text-white placeholder-neutral-500 rounded-xl transition-all duration-300 focus:ring-1 focus:ring-white/20 outline-none font-family-['Inter']`
- **Primary Call-to-Action Button:**
  High-fidelity premium interactive layout utilizing a subtle inner specular gradient or high-contrast border glow.
- **Typography Matrix:**
  - Header Title ("ברוך הבא" / "הרשמה למערכת"): `font-family: 'Outfit', sans-serif; font-weight: 700;`
  - Form Labels, Errors, Buttons: `font-family: 'Inter', sans-serif; font-weight: 500;`

### 3. Localization & Validation
- Ensure all validation text, placeholder prompts, and error bounds are localized in grammatically perfect Hebrew.
- Integrate secure validation gates (Zod schema parsing) natively within the Next.js Server Actions processing the auth state changes.

### 4. Implementation Steps Requested
1. Review the current implementation of your Auth Gate component.
2. Replace all traditional backdrop and card styling classes with the upgraded Liquid Glass 4.0 tokens.
3. Wrap interactive interactive elements with hardware-accelerated Tailwind transitions.
4. Provide the fully refactored, complete, and production-ready code file.
```
