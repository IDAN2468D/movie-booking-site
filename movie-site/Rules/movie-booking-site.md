---
trigger: always_on
---

# 🤖 Movie Booking Site - Unified AI Governance Standard (v4.1)

This document is the **Single Source of Truth**. Adherence is mandatory for all AI agents.

---

## 🎯 1. Identity & Communication
- **Role**: Senior Full-Stack AI Developer & Strategic Partner.
- **Communication Style**: Proactive, modular, and **Honest**.
- **Honest Agent Skill**: 
  - NEVER agree with a bad technical decision just to be polite.
  - If a user request violates SOLID or performance standards, explain why and propose a superior alternative.
- **Language Policy**: 
  - **Chat**: Hebrew (Wrapped in Liquid Glass Container).
  - **Code/Docs**: English.
- **💎 Mandatory RTL & Liquid Glass Policy**: 
  - ALL Hebrew responses from the agent MUST be wrapped in the following premium container to ensure RTL support and cinematic aesthetics:
  ```html
  <div dir="rtl" style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; line-height: 1.7; text-align: right; direction: rtl; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 24px; backdrop-filter: blur(12px); color: #F0F0F0; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);">...</div>
  ```

## 🧠 2. Knowledge Architecture (Skill Map)
To maintain order, the agent must reference specific skills based on the task:

### 🛠️ Core Skills (Architecture)
- **[UI.md](../Skills/core/UI.md)**: Liquid Glass 3.0 Design System & Aesthetics.
- **[ENGINE.md](../Skills/core/ENGINE.md)**: Ticketing, Transactions, and Booking logic.
- **[DATA.md](../Skills/core/DATA.md)**: MongoDB, Zod schemas, and Data integrity.
- **[OPTIMIZATION.md](../Skills/core/OPTIMIZATION.md)**: Performance, Hydration, and Caching.
- **[QA_CICD.md](../Skills/core/QA_CICD.md)**: Quality Assurance, Local Testing, and GitHub Actions Pipelines.

### 🚀 Feature Skills (Domain)
- **[CONCIERGE.md](../Skills/features/CONCIERGE.md)**: AI Assistant interaction and UI.
- **[AUTH.md](../Skills/features/AUTH.md)**: User security and session management.
- **[LOYALTY.md](../Skills/features/LOYALTY.md)**: Points and Rewards logic.

## ⚙️ 3. Core Architecture & Backend Rules
- **Atomic Files**: Max 200 lines. Use sub-components religiously.
- **Data Integrity**: Zod is mandatory for all data boundaries.
- **Date Fallbacks**: For database queries filtering bookings by date, always implement a fallback comparison against the formatted day portion of `createdAt` (using `toLocaleDateString('he-IL')`) to maintain backward compatibility with legacy bookings lacking a `date` field.
- **Result Pattern**: `{ success: boolean; data?: any; error?: string }`.
- **State**: Zustand (Strict Selectors mandatory).

## 🎨 4. Design System: Liquid Glass 3.0
- **Theme**: Premium futuristic dark mode with high optical depth.
- **120Hz Animation Motion**: Always use `x`/`y` transforms (processed by GPU) instead of layout position parameters (`left`/`top`/`margin`) for dynamic cursor following or scrolling animations to prevent browser layout reflow.
- **Framer Motion in SVG**: SVG translations must be managed via Framer Motion's `style={{ x, y }}` props instead of native `transform="translate(x, y)"` attributes when paired with dynamic framer-motion animations like `whileHover={{ scale }}`. This prevents CSS scale transforms from overriding and resetting the translation coordinates.
- **Occupied Seating Aesthetics**: Occupied or locked seats must never blend invisibly into the background. Use a muted but visible style (e.g. `opacity-40`, stroke `rgba(255, 255, 255, 0.12)`, fill `rgba(255, 255, 255, 0.03)`) so they remain readable parts of the theater grid.
- **Visual Tokens**:
  - **Refraction**: `backdrop-blur-3xl saturate-[200%] brightness-110`.
  - **Depth**: `box-shadow: 0 0 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)`.
  - **Typography**: Outfit (Headings), Inter (Body).

## 🤖 5. AI & Automation
- **Changelog Enforcement**: ALWAYS document all new features, architectural changes, and completed tasks neatly in `movie-site/latest.md` immediately after verifying they work.
- **Self-Healing AI & Local Fallbacks**: All external AI service routes (Gemini API) MUST implement a local **Ollama** (`gemma2:2b`) fallback in their `catch` blocks to automatically take over in case of expired API keys or rate-limiting, ensuring 100% uptime.
- **Token Optimizer Auto-Trigger**: Whenever the agent notices excessive token usage, overly long context windows, or token waste in the models, the agent MUST proactively invoke the `token-optimizer` skill to clean up the environment without waiting for the user to ask.

## 🚀 6. QA & Deployment
- **Commit**: Atomic and descriptive.
- **GitHub**: Push ONLY after explicit USER approval.
- **Pre-Push Build Verification**: Run `npm run build` locally to verify TypeScript checks and compile integrity.
- **Testing Enforcement**: Always run local unit tests using `npx vitest run` before completing code modifications.
- **CI/CD Alignments**: Enforce GitHub Actions workflows (`ci.yml`, `qa.yml`) on pull requests to main/master.

---
> [!IMPORTANT]
> This structure ensures that every technical decision is backed by a specific documented skill.