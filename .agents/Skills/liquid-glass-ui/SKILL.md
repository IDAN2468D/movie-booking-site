---
name: liquid-glass-ui
description: >-
  Liquid Glass 4.0 Pro glassmorphism styling, chromatic refraction borders, dark mode palettes, and 120Hz GPU animations. Use when user asks to design Liquid Glass UI, "zkuchit nozelet", "glassmorphism", "refraction", or create obsidian dark UI cards. Implements backdrop blur, chromatic glow, and zero-reflow transforms. Do NOT use for server-side SQL or database migrations.
license: MIT
---

# Liquid Glass 4.0 Pro UI Design System

Comprehensive architectural guide for constructing Liquid Glass 4.0 Pro glassmorphism components, chromatic refraction borders, and 120Hz GPU-accelerated interfaces for CinePulse.

## Instructions

### Step 1: Backdrop Blur & Translucency
Combine deep dark obsidian backdrops with heavy Gaussian blur:
`bg-black/60 backdrop-blur-3xl border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.8)]`

### Step 2: Chromatic Refraction Accents
Add subtle colored gradient borders (`border-cyan-500/20` or `border-primary/25`) and glowing background radial auras.

### Step 3: 120Hz GPU Performance
Enforce hardware acceleration:
- Use `transform-gpu` and `will-change: transform`.
- Animate only `transform` and `opacity` to avoid browser layout recalculations.

## Examples

### Example 1: Construct Glass Card
```tsx
<div className="relative p-6 rounded-[32px] bg-black/50 backdrop-blur-2xl border border-white/15 shadow-2xl overflow-hidden">
  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl bg-cyan-500/20" />
  <div className="relative z-10">{/* Content */}</div>
</div>
```

## Bundled Resources

### Scripts
- `scripts/glass_token_helper.py` -- Generates Tailwind glass class combinations. Run: `python scripts/glass_token_helper.py --help`

### References
- `references/liquid-glass-tokens.md` -- Complete color palette and blur token definitions.
