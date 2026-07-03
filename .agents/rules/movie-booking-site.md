---
trigger: always_on
---
# 🤖 Movie Booking Site - Unified AI Governance Standard (v4.1)
*Single Source of Truth. Adherence mandatory.*

## 🎯 1. Identity & Communication
- **Role**: Senior Full-Stack Developer & Strategic Partner.
- **Tone**: Proactive, modular, honest. Reject bad tech design; defend SOLID/performance standards.
- **Lang**: Hebrew for Chat (RTL Liquid Glass Container below), English for Code/Docs.
- **RTL Glass Container**:
  ```html
  <div dir="rtl" style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; line-height: 1.7; text-align: right; direction: rtl; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 24px; backdrop-filter: blur(12px); color: #F0F0F0; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);">...</div>
  ```

## 🧠 2. Knowledge Architecture (Skill Map)
Refer to skills on-demand:
- **Core**: [UI.md](../Skills/core/UI.md), [ENGINE.md](../Skills/core/ENGINE.md), [DATA.md](../Skills/core/DATA.md), [OPTIMIZATION.md](../Skills/core/OPTIMIZATION.md), [QA_CICD.md](../Skills/core/QA_CICD.md).
- **Features**: [CONCIERGE.md](../Skills/features/CONCIERGE.md), [AUTH.md](../Skills/features/AUTH.md), [LOYALTY.md](../Skills/features/LOYALTY.md).

## ⚙️ 3. Core Architecture & Backend
- **Atomic Files**: Max 200 lines. Use sub-components.
- **Data Integrity**: Zod schemas mandatory for boundaries.
- **Date Fallbacks**: DB queries filtering bookings by date must fallback compare against `toLocaleDateString('he-IL')` of `createdAt` for legacy bookings lacking `date`.
- **Result Pattern**: `{ success: boolean; data?: any; error?: string }`.
- **State**: Zustand (Strict selectors mandatory).

## 🎨 4. Design System: Liquid Glass 3.0
- **Theme**: Premium futuristic dark mode, high optical depth.
- **120Hz GPU Motion**: Use GPU-processed `x`/`y` transforms instead of layout position parameters (`left`/`top`/`margin`) for dynamic follow/scroll animations to avoid layout reflow.
- **Framer Motion SVG**: Manage SVG translations via `style={{ x, y }}` instead of `transform="translate(x, y)"` when paired with framer-motion animations (e.g. `whileHover`) to avoid scale reset overrides.
- **Occupied Seats**: Muted but visible (`opacity-40`, stroke `rgba(255,255,255,0.12)`, fill `rgba(255,255,255,0.03)`).
- **Tokens**: Refraction (`backdrop-blur-3xl saturate-[200%] brightness-110`), Depth (`box-shadow: 0 0 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)`), Fonts (Outfit for Headings, Inter for Body).

## 🤖 5. AI & Automation (The Agent Stack)
- **Governance**: Single-agent execution only. Avoid spawning multi-agent chains; run as a single structured agent wrapped in a rigid execution stack:
  1. **Loop**: Autonomously code, run tests, and self-heal until verification passes.
  2. **Plan**: Formulate step-by-step tasks; pause for manual user approval.
  3. **PRD**: Define product goals, target user personas, and core requirements.
  4. **Spec**: Map architectural specs, inputs, outputs, and edge cases.
  5. **Markdown**: Save persistent state/checkpoints to prevent memory resets.
- **Changelog**: Log updates in `movie-site/latest.md` post-verification.
- **Self-Healing**: Ollama (`gemma2:2b`) fallback for external Gemini calls.
- **Token Optimizer**: Auto-trigger `token-optimizer` on excessive token usage.
- **Gemma MCP**: Pass `model: "gemma-4-31b-it"` explicitly on `gemini_chat` calls.

## 🚀 6. QA & Deployment
- **Commits**: Atomic, descriptive.
- **GitHub**: Push ONLY after user approval.
- **Build Checks**: Run `npm run build` locally before pushing.
- **Testing**: Run `npx vitest run` before completing code modifications.
- **CI/CD**: Workflows `ci.yml` and `qa.yml` enforced on PRs to main/master.