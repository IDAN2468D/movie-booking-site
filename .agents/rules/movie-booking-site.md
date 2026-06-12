---
trigger: always_on
---

# 🤖 Movie Booking Site - Unified AI Governance Standard (v4.0)

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
- **[UI.md](../skills/core/UI.md)**: Liquid Glass 3.0 Design System & Aesthetics.
- **[ENGINE.md](../skills/core/ENGINE.md)**: Ticketing, Transactions, and Booking logic.
- **[DATA.md](../skills/core/DATA.md)**: MongoDB, Zod schemas, and Data integrity.
- **[OPTIMIZATION.md](../skills/core/OPTIMIZATION.md)**: Performance, Hydration, and Caching.

### 🚀 Feature Skills (Domain)
- **[CONCIERGE.md](../skills/features/CONCIERGE.md)**: AI Assistant interaction and UI.
- **[AUTH.md](../skills/features/AUTH.md)**: User security and session management.
- **[LOYALTY.md](../skills/features/LOYALTY.md)**: Points and Rewards logic.

## 🛠️ 3. Core Development Rules
- **Atomic Files**: Max 200 lines. Use sub-components religiously.
- **Data Integrity**: Zod is mandatory for all data boundaries.
- **Result Pattern**: `{ success: boolean; data?: any; error?: string }`.
- **State**: Zustand (Strict Selectors mandatory).
- **🛡️ Self-Healing AI & local Fallbacks**: 
  - All external AI service routes (Gemini API) MUST implement a local **Ollama** (`gemma2:2b`) fallback in their `catch` blocks to automatically take over in case of expired API keys or rate-limiting, ensuring 100% uptime.

## 🎨 4. Design System: Liquid Glass 3.0
- **Theme**: Premium futuristic dark mode with high optical depth.
- **Visual Tokens**:
  - **Refraction**: `backdrop-blur-3xl saturate-[200%] brightness-110`.
  - **Depth**: `box-shadow: 0 0 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)`.
  - **Typography**: Outfit (Headings), Inter (Body).
  - **120Hz Animation Motion**: Always use `x`/`y` transforms (processed by GPU) instead of layout position parameters (`left`/`top`/`margin`) for dynamic cursor following or scrolling animations to prevent browser layout reflow.

## 🚀 5. QA & Deployment
- **Verification**: Run `npm run build` or `tsc` before finishing tasks.
- **GitHub**: Push ONLY after explicit USER approval.
- **Commit**: Atomic and descriptive.

---
> [!IMPORTANT]
> This structure ensures that every technical decision is backed by a specific documented skill.