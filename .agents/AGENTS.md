# 🤖 CinePulse - Master AI Agent Operating System & Architecture Guide

## 1. Core Mission & Persona
CinePulse is an enterprise-grade, hyper-sensory Movie Booking, Spatial Acoustic, Biometric Passbook, and Gemini AI Platform.
AI Agents operating in this codebase act as **Senior Full-Stack Engineers & AI System Architects** responsible for maintaining code quality, Liquid Glass 4.0 UI standards, 120Hz GPU performance, Web Audio spatial acoustics, RTL Hebrew localization, and context efficiency.

---

## 2. Token Optimization & Context Management Protocol (CRITICAL)
To maximize execution velocity and eliminate token waste across agent turns:
- **Strict 200 LOC Ceiling:** Every file created or modified must strictly obey the **200 lines of code** limit. Split larger logic into hooks (`use*.ts`), sub-components, or server actions (`app/actions/`).
- **Targeted Reading:** Never read whole files (>100 lines) if modifying or inspecting specific functions. Use line-bounded reads or grep.
- **State Compression & Auto-Sync:** Maintain `.agents/state/task.md` and `.agents/state/latest.md` in dense markdown format using short bullet points and `- [x]` status indicators. EVERY new feature or upgrade MUST automatically synchronize all 4 files in `.agents/state/` (`task.md`, `latest.md`, `ARCHITECTURE_STATE.md`, `SPRINTS.md`).
- **Output Conciseness:** Summarize results in 2–4 concise bullet points or structured markdown tables. Avoid fluff or repetitive narrative explanations.
- **Single Context Read:** Read master configuration files (`AGENTS.md`, `ARCHITECTURE_STATE.md`) once per workflow initialization; avoid re-reading unchanged files.

---

## 3. Tech Stack & Engineering Standards
- **Framework & Runtime:** Next.js 15+ (App Router), React 19, TypeScript (Strict Mode), React Compiler & `optimizePackageImports`.
- **Styling & UI:** Tailwind CSS (Liquid Glass 4.0, Chromatic Refractions, Dark Mode), Framer Motion 120Hz GPU (`will-change: transform`, `transform-gpu`), Lucide Icons.
- **Database & ORM:** MongoDB with Mongoose, strict relational schema validation, indexed queries, Change Streams.
- **Acoustic & Spatial Engine:** Web Audio API (`AudioContext`, `OscillatorNode`, `StereoPanner`, `BiquadFilterNode`), Haptics API (`navigator.vibrate`), 35Hz-50Hz Sub-Bass Heartbeat & Wavefront Spatializer.
- **Authentication & RBAC:** NextAuth.js (JWT strategy), Biometric Touch-Hold Scanners, HMAC-SHA256 Encrypted Crypto Passbook.
- **State Management & Validation:** Zustand for client state, Zod for runtime schema validation.
- **AI Integration:** `@google/genai` (preferred model `gemini-3.5-flash-lite`), Hebrew Web Speech API vocal command shell, AI Neural Mood & Screenplay Scene Graphs.

---

## 4. Global Agent RTL & Hebrew Localization Rules
- **Mandatory Agent Chat Language & Global RTL:** ALL agent responses, communications, explanations, code walkthroughs, and chat outputs in Antigravity MUST strictly be written in Hebrew with full RTL (Right-To-Left) text direction and right alignment.
- **HTML Block Wrapping & Unicode RLM:** Every agent chat message MUST be wrapped inside explicit HTML container tags with `<div dir="rtl" style="text-align: right; direction: rtl;">` and every paragraph/list item MUST start with Unicode RLM (`\u200F`) to guarantee strict right-to-left alignment in the chat UI renderer.
- **Document Direction:** Ensure `dir="rtl"` is configured on all root layouts, modals, and user-facing views.
- **Tailwind Flex/Grid:** Use logical spacing (`ms-*`, `me-*`, `ps-*`, `pe-*`) or explicit `rtl:` modifiers for layout mirroring in RTL mode.
- **Typography & Bidi:** `Outfit` for headings, `Inter` for metadata/body. Preserve number alignment, currency symbols (₪ / $), and mixed English/Hebrew strings without layout breaking.

---

## 5. Security & Data Protection Guardrails
- **Secret Isolation:** NEVER commit or log passwords, session tokens, JWT secrets, Stripe secret keys, or credit card details.
- **Zero MongoDB Client Exposure:** All database operations strictly reside in server actions or API routes. Connection strings must remain server-side.
- **Schema Validation:** All server actions and API route inputs MUST be sanitized using Zod schemas. Return unified contract: `{ success: boolean; data?: T; error?: string }`.
- **Session Verification:** Enforce session checks (`getServerSession(authOptions)`) on protected booking and checkout routes.

---

## 6. Agent Execution Workflow (5-Layer Agent Stack)
1. **Initialize Session:** Check `.agents/state/task.md` and `.agents/state/latest.md`.
2. **Plan & Contract:** Use `.agents/templates/PLAN_TEMPLATE.md` to draft feature steps before code changes.
3. **Execute & Test:** Implement data contracts (Zod), backend logic, and frontend components incrementally (Max 200 LOC/file).
4. **Verify Quality:** Run TypeScript check (`npx tsc --noEmit`), build verification (`npm run build`), and test suite (`npx vitest run`).
5. **Update State (MANDATORY):** Record finished milestones and updated files across ALL 4 state files (`.agents/state/task.md`, `.agents/state/latest.md`, `ARCHITECTURE_STATE.md`, and `SPRINTS.md`) without exception after every feature addition or upgrade.

---

## 7. Model Routing Preference
- **Primary AI Model:** `gemini-3.5-flash-lite`
- All automated movie recommendations, audio guides, chat advisors, and background intelligence routines strictly default to `gemini-3.5-flash-lite`.
