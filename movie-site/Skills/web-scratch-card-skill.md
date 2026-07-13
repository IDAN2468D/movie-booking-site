# 🤖 Agent Skill Definition: web_procedural_scratch_card_generator

## 📋 Overview
Generates ultra-high-fidelity, hardware-accelerated pure web scratch card modules for Next.js 15 using HTML5 Canvas erase masking, procedural Web Audio API sound synthesis, and the Liquid Glass 4.0 visual token hierarchy.

## 🧱 Pure Web Tech Stack
- **Framework:** Next.js 15 (App Router) & TypeScript.
- **Masking Engine:** HTML5 Canvas API (`2d` context) leveraging `globalCompositeOperation = 'destination-out'`.
- **Styling & Theme:** Tailwind CSS 4.0 (Translucent overlays, glassmorphism, native backdrop blurs).
- **Audio Engine:** Web Audio API (`AudioContext`, `AudioBuffer`, `BiquadFilterNode`) for serverless, zero-MP3 scratching synthesis.
- **Haptics:** W3C Vibration API (`navigator.vibrate`) with cross-browser capability fallbacks.

## 📐 Design & Layout Guardrails (Liquid Glass 4.0)
1. **Zero-Overlap Rule:** To prevent text collisions, the scratchable upper mask layer MUST NOT contain any prize data, barcodes, or detailed branding. It must feature only a centralized glass-etched neural logo and minimal instructional micro-copy.
2. **Obsidian Deep Reward Layer:** The underlying card layer must be a structured dark Obsidian container (`bg-black/60` or `bg-[#0d0d0d]`) separating layout sectors into discrete components: Top Header, Center Voucher Box (with Copy Button), and Bottom Scan Barcode.
3. **Atomic Decomposition:** No outputted file can exceed 200 lines of code.