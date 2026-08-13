---
name: feature-audit-skill
description: Analyze project architecture, audit active modules and sprints, and generate Specification-Driven Development (SDD) roadmaps, PRD/SPEC documentation, and master prompts.
allowed-tools: vm_shell google_search
---

# Feature Audit & Master Architecture Skill (v9.5 SDD)

## Objective
Analyze current project state, audit implemented modules against SDD criteria, identify gaps in existing features, and architect next-generation hyper-premium features adhering to Liquid Glass 4.0 Pro UI, Web Audio API Spatializer, and Agent Stack rules.

## Execution Protocol

1. **Context Loading:**
   - Read `.agents/state/ARCHITECTURE_STATE.md` (Master State), `.agents/state/SPRINTS.md` (Active Sprints), and `.agents/templates/` (PRD & SPEC standards).
   - Inspect active components in `/app`, `/components`, `/lib`, and `/hooks`.

2. **Gap Analysis & Capability Audit:**
   - Review implemented features against PRD/SPEC specifications.
   - Evaluate existing features for potential upgrades (e.g., WebSocket Auto-Archiving, AI Sentiment Filtering, Biometric Pairing, Session Lock Timers, Spatial Audio 3D Spatializer).
   - Ensure Lean execution with zero bloat.

3. **Architectural Feasibility & SDD Compliance:**
   - **Visuals:** 120Hz Zero-Reflow GPU rendering (`transform-gpu`, `opacity`).
   - **Audio:** Web Audio API (`PannerNode`, `BiquadFilterNode`).
   - **Security:** Zero client-side ORM/DB exposure and strict Zod boundary validation.
   - **Isolation:** Maximum 200 LOC per component file.

4. **Deliverable Generation:**
   - Feature Roadmap Markdown table: `[Feature Name] | [Target Sprint] | [PRD/SPEC Status] | [Tech Stack/API]`.
   - Complete PRD draft following `.agents/templates/PRD_TEMPLATE.md`.
   - Complete Technical Architecture SPEC draft following `.agents/templates/SPEC_TEMPLATE.md`.