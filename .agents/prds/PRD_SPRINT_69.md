# 📄 Product Requirements Document (PRD) — Sprint 69

> **Status:** Approved  
> **Version:** 9.0 SDD  
> **Target Feature:** Neural Biometric Seat & Acoustic Sweet-Spot Calibrator (Sprint 69)  
> **Owner:** Senior Full-Stack Developer & AI UX Architect  

---

## 🎯 1. Executive Summary & Core Objective
- **Problem Statement:** Standard cinema seating choice fails to customize acoustic frequency response and bass resonance according to individual biometric ear sensitivity or seating distance.
- **Proposed Solution:** A Liquid Glass 4.0 interactive acoustic sweet-spot calibrator with real-time Web Audio equalization, dynamic EQ filter curve response, and 40Hz sub-bass tactile acoustic preview.
- **Target Persona:** Audiophiles, VIP Moviegoers, and AV Enthusiasts looking for optimal cinema seating sound acoustics.

---

## 🎨 2. Screen Awareness & Liquid Glass 4.0 Layout Standards
- **Active Route/View:** Integrated within `/booking/[showtimeId]` seating view modal (`BiometricSeatContainer`).
- **Aesthetic Guidelines (Liquid Glass 4.0):**
  - **Backdrop Blur:** `backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40`
  - **Chromatic Borders:** `border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_inset_0_-1px_1px_rgba(0,0,0,0.4)]`
  - **Macro Shadows:** `box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5)`
  - **Typography:** `Outfit` for headers and acoustic decibel metrics, `Inter` for metadata.
  - **Zero-Reflow GPU Profile:** Exclusively use hardware-accelerated transforms (`transform-gpu`, `scale`, `opacity`).

---

## 📦 3. Feature Scope Breakdown

### 🟢 Must-Have Features (P0)
1. **Interactive Acoustic Matrix:** Visual frequency response grid reflecting seat acoustic rating (Sweet-Spot dB, Clarity Score, Bass Drop).
2. **Web Audio Frequency Equalizer:** Real-time Web Audio API (`BiquadFilterNode` & `PannerNode`) generating acoustic frequency response feedback.
3. **Zod Validated Server Action:** Server Action processing acoustic preference payload returning calculated sweet-spot metrics.

### 🔴 Explicit Non-Goals (Scope Boundary)
- Will NOT invoke client-side MongoDB operations or external MCP runtime tools.

---

## 🧪 4. Evaluation Criteria & Acceptance Evals
- **Functional Evals:** Dynamic calculation of sweet-spot acoustic metrics, Web Audio feedback on slider/seat change.
- **Performance Budget:** 120Hz smooth rendering, strict < 200 LOC per file.
- **Security Audit:** 100% Zod validation via `biometric-seat.schema.ts`.
