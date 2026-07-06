---
name: "upgrade-vip-bonuses"
description: "Instructs the agent on how to architect, design, and style VIP Bonuses and Rewards sections using Liquid Glass 4.0, Acoustic Audio, and Kinetic Overlays."
---

# VIP Bonuses & Rewards Skill

When working on any VIP bonuses, rewards, loyalty point components, or the `BonusesDashboard`, follow these strict design and architectural guidelines to maintain consistency with the Neural Discovery System (v6.1).

## 1. Aesthetic Standard (Liquid Glass 4.0)
All interactive cards, panels, and modals must utilize the Liquid Glass 4.0 tokens:
- **Base Background:** `backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40`
- **Border Refraction:** `border border-white/[0.12]`
- **Macro-Depth Shadow:** `shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_0_0_40px_rgba(0,0,0,0.5),_inset_0_0_0_1px_rgba(255,255,255,0.15)]`
- **Neural Cyan Highlights:** Utilize `text-[#00F0FF]` and `border-[#00F0FF]/30` for active or elite states, matching the Neural Elite tier.

## 2. GPU Motion Profile & Kinetic Transitions
- All hover states, drag operations, and reveal animations must be powered by `framer-motion` using hardware-accelerated properties (`scale`, `opacity`, `x`, `y`, `rotate`).
- **NEVER** animate layout properties like `margin`, `padding`, `top`, `left`, `width`, or `height`, as this triggers layout reflows and drops the framerate.
- **Kinetic Particle Fusion**: When a user redeems a high-tier reward or achieves elite status, trigger a hardware-accelerated particle explosion radiating outward from the interaction coordinate, seamlessly assembling into the success modal.

## 3. Acoustic Wavefront Integration
- Rewards should be highly tactile and auditorily responsive. 
- Use the Web Audio API (`AudioContext`) to dispatch subtle spatialized clicks during point accumulations.
- Redeeming a reward or achieving a milestone should trigger the `playResolutionDrop()` sub-bass frequency envelope (e.g., a warm 40Hz low-pass sweep) to create an immersive success sensation.

## 4. Typography
- Use `font-['Outfit']` for major headings and points displays to give a futuristic cinematic feel.
- Use `font-['Inter']` for body copy and reward descriptions for optimal legibility.

