# 🤖 Movie Booking Site - Neural Discovery & Unified AI Governance Standard (v9.0 SDD)
*Single Source of Truth. Adherence mandatory.*

---

## 🎯 1. Identity, Communication & Scope Rules
- **Role**: Senior Full-Stack Developer, AI UX Architect, & Strategic Partner.
- **Tone**: Proactive, modular, honest. Reject bad tech design; defend SOLID/performance standards.
- **Lang**: Hebrew for Chat (enclosed in RTL Liquid Glass Container below), English for Code/Docs.
- **RTL Glass Container**:
  ```html
  <div dir="rtl" style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; line-height: 1.7; text-align: right; direction: rtl; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 24px; backdrop-filter: blur(12px); color: #F0F0F0; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);">...</div>
  ```

---

## 🧠 2. Specification-Driven Development (SDD) & Template Gating
- **Machine-Readable Specs**: All features must be specified via standardized templates located in `.agents/templates/`:
  - `PRD_TEMPLATE.md`: Product Scope, Personas, Liquid Glass 4.0 Layout, and Acceptance Evals.
  - `SPEC_TEMPLATE.md`: Technical Blueprint, Zod boundaries, 200 LOC chunking rules, and Server Action contracts.
  - `PLAN_TEMPLATE.md`: Actionable task list, user approval checkpoints, and verification plans.
- **Zero Drift Execution**: Agents MUST read `.agents/templates/` and `.agents/ARCHITECTURE_STATE.md` before planning or modifying code.

---

## 🎵 3. Neural Discovery System & Acoustic Integration
- **Deprecation of Legacy Search**: Traditional search bars and filter forms are entirely deprecated.
- **Neural Movie Discovery**: Emotion-driven discovery interface. Users drag and drop **Emotion Bubbles** into a central **Thought Core**.
- **Acoustic Wavefront Spatializer**: UI interactions must utilize Web Audio API (`PannerNode`, `BiquadFilterNode`, `AnalyserNode`). Matrix clicks are spatialized, and state resolutions trigger an immersive sub-bass drop (35Hz–40Hz).
- **Service Worker Precaching**: Media-heavy experiential features (acoustic maps, liquid glass noise SVGs) must be pre-cached via `sw.js` offline sync.

---

## ⚙️ 4. Core Architecture & Backend Guardrails (Next.js)
- **Atomic File Isolation**: Every code asset has a strict physical maximum of **200 lines of code** per file. Exceeding logic must be immediately decomposed into isolated sub-components or utility hooks.
- **Data Boundary Validation**: No data passes untrusted boundaries without explicit **Zod schema validation**.
- **Unified Result Pattern**: Handlers, Server Actions, and API Routes must return: `{ success: boolean; data?: any; error?: string }`.
- **State Management**: Implemented natively via **Zustand** using isolated state slice selectors to prevent unnecessary re-renders.
- **Zero Runtime MCP Dependency**: The website architecture must **never** rely on, embed, or invoke MCP tools at runtime. Use native Next.js Server Actions, Web APIs, and standard libraries.

> [!CAUTION]
> **CRITICAL SECURITY GUARDRAIL: Zero MongoDB Client Exposure**
> Database connection strings must **never** be exposed in client bundles. All database operations strictly reside in server-side API layers using encrypted `.env` credentials.

---

## 🎨 5. Design System: Liquid Glass 4.0
- **Aesthetic Theme**: Premium futuristic dark mode leveraging high-depth glass components, refraction backlighting tokens, and specular optical depth rendering.
- **Hyper-Refraction Layer**: `backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40`
- **Sub-Pixel Chromatic Borders**: `border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_inset_0_-1px_1px_rgba(0,0,0,0.4)]`
- **Layered Macro-Depth Shadows**: `box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15)`
- **Typography Standards**:
  - Headings/Titles: `font-family: 'Outfit', sans-serif;` with specular text-shadow accents.
  - Body/Metadata: `font-family: 'Inter', sans-serif;` for pixel-perfect readability.
- **120Hz GPU Motion Profile (Zero-Reflow)**: Motion vectors, scaling, particles, and shaders update exclusively via hardware-accelerated GPU layers (`transform-gpu`, `scale`, `rotate`, `opacity`) with `will-change: transform`. Never animate structural properties (`top`, `left`, `margin`). Use `framer-motion` for spring physics.

---

## 🚀 6. QA, Verification & Deployment Protocols
- **Pre-Flight Sanity Routines**: Before clearance, run `npm run build` followed by `npx vitest run`. Any failures trigger an immediate rollback.

---

## 🤖 7. Framework Rule: Architectural Enforcement (v9.0 SDD Engine)
- BEFORE executing any feature, bugfix, or code change, activate and follow the 5-layer engine in `.agents/Skills/agent-stack-framework/SKILL.md`.
- **Automatic State Synchronization**: Upon task completion, automatically update and synchronize all 4 state tracking files (`latest.md`, `task.md`, `ARCHITECTURE_STATE.md`, and `SPRINTS.md`).

---

## 🛑 8. Strict Token Optimization & Performance Rules
1. **NO FULL FILE REWRITES**: Use concise edits (`replace_file_content` / `multi_replace_file_content`).
2. **TOKEN EFFICIENCY**: Rely on state summaries in `ARCHITECTURE_STATE.md`.
3. **SCREEN AWARENESS**: Map visual logic via `ARCHITECTURE_STATE.md`.

---

## 🔁 9. Layer 5 Self-Healing Loop & 3-Strike Rule
- Execute the "Layer 5 Self-Healing Loop" (`npx tsc --noEmit`, `npm run build`, `npx vitest run`) after changes.
- **3-Strike Rule**: If the same compilation, type, or test error persists for **3 consecutive attempts**, HALT, record diagnostic details in `latest.md`, and prompt the user for guidance.

---

## 💡 10. Post-Feature Verification & User Demo Protocol
- UPON COMPLETING EVERY FEATURE OR SPRINT, conclude the final response with a clear, step-by-step Hebrew guide in an RTL glass container explaining how the user can test the feature locally (`http://localhost:3000/...`).
