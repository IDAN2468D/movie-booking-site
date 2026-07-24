# 📄 Product Requirements Document (PRD) — Sprint 64

> **Status:** Draft  
> **Version:** 9.0 SDD  
> **Target Feature:** Real-Time Cinema Crowd Heatmap & Vibe Radar (Sprint 64)  
> **Owner:** Senior Full-Stack Developer & AI UX Architect  

---

## 🎯 1. Executive Summary & Core Objective
- **Problem Statement:** Traditional seat maps only display binary occupied/available states, lacking social context, atmosphere insight, and acoustic environment preview.
- **Proposed Solution:** A Liquid Glass 4.0 real-time crowd heatmap and acoustic vibe radar overlaying auditorium seating, highlighting crowd energy zones, vibe tags (e.g., "Acoustic Gold", "Chill Cinephiles"), and live spatial audio resonance.
- **Target Persona:** Social Moviegoers, VIP Subscribers, & Audio-Visual Enthusiasts looking for optimal seating atmosphere.

---

## 🎨 2. Screen Awareness & Liquid Glass 4.0 Layout Standards
- **Active Route/View:** Embedded inside `SeatMap` container and `SpatialSeatPreview` modal (`/booking/[showtimeId]`).
- **Aesthetic Guidelines (Liquid Glass 4.0):**
  - **Backdrop Blur:** `backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40`
  - **Chromatic Borders:** `border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_inset_0_-1px_1px_rgba(0,0,0,0.4)]`
  - **Macro Shadows:** `box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5)`
  - **Typography:** `Outfit` for headers & numeric vibe metrics, `Inter` for metadata.
  - **Zero-Reflow GPU Profile:** Exclusively use hardware-accelerated transforms (`transform-gpu`, `scale`, `opacity`, `rotate`) with `will-change: transform`.

---

## 📦 3. Feature Scope Breakdown

### 🟢 Must-Have Features (P0)
1. **Interactive Vibe Heatmap Layer:** Visual intensity gradients over auditorium seats indicating crowd density, acoustic clarity ratings, and atmosphere vibes.
2. **Acoustic Spatial Pulse:** Web Audio API (`PannerNode` + 40Hz sub-bass drop) triggering spatial sound previews upon hovering or selecting heat zones.
3. **Zod Validated Server Integration:** Server Action fetching validated showtime crowd density vectors via `crowd-heatmap.schema.ts`.

### 🟡 Nice-to-Have Features (P1)
1. **Peer Vibe Match Badge:** Highlights seats with >90% mood alignment to the active user's Neural Emotion profile.

### 🔴 Explicit Non-Goals (Scope Boundary)
- Will NOT expose raw user PII or exact user identities.
- Will NOT execute client-side MongoDB connections or external MCP runtime calls.

---

## 🧪 4. Evaluation Criteria & Acceptance Evals
- **Functional Evals:** Successful dynamic rendering of heat zones, dynamic acoustic frequency spatialization on seat hover.
- **Performance Budget:** 120Hz smooth zero-reflow rendering (<8.3ms frame execution), strict 200 LOC ceiling per source file.
- **Security Audit:** 100% Zod validated boundaries, zero MongoDB client exposure.
