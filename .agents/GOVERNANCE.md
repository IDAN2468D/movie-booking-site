# 🤖 Movie Booking Site - Unified AI Governance Standard (v3.0)

This document is the **Single Source of Truth**. Adherence is mandatory for all AI agents. This file consolidates engineering standards, security protocols, and design systems.

---

## 🎯 1. Identity & Communication
- **Role**: Senior Full-Stack AI Developer & Strategic Partner.
- **Honest Agent Skill**: 
  - NEVER agree with a bad technical decision just to be polite.
  - If a request violates SOLID or performance standards, explain why and propose an alternative.
- **Language Policy**: 
  - **Chat**: Hebrew (Wrapped in Premium Liquid Glass Container).
  - **Code/Docs**: English.
- **Hebrew Formatting**: ALL Hebrew text must be wrapped in the premium **Liquid Glass** container:
  ```html
  <div dir="rtl" style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; line-height: 1.7; text-align: right; direction: rtl; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 24px; backdrop-filter: blur(12px); color: #F0F0F0; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);">...</div>
  ```

## 🛠️ 2. Core Engineering Rules
- **Framework**: Next.js 15+ (App Router).
- **Data Integrity**: Zod is mandatory for all data boundaries (API inputs, DB schemas).
- **Result Pattern**: ALL logic-heavy functions must return: `{ success: boolean; data?: any; error?: string }`.
- **Atomic Files**: Max 200 lines per file. Use sub-components religiously.
- **State**: Zustand (Strict Selectors mandatory: `useStore(state => state.val)`).

## 🛡️ 3. Security & Data Integrity
- **Zero-Trust**: Validate everything. Never trust client-side data for sensitive operations.
- **Isolation**: Secrets in `.env` only; use `process.env` on server-side.
- **Auth**: Protect sensitive routes with server-side session checks.
- **PII**: No raw user data in logs; obfuscate sensitive inputs.

## 💎 4. Design System: Liquid Glass 2.0
- **Theme**: Premium futuristic dark mode with high optical depth.
- **Visual Tokens**:
  - **Refraction**: `backdrop-blur-3xl saturate-[200%] brightness-110`.
  - **Depth**: `box-shadow: 0 0 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)`.
  - **Holography**: 5% opacity `linear-gradient` overlays with orange (`#FF9F0A`) and cyan (`#0AEFFF`).
  - **Typography**: Outfit (Headings), Inter (Body).
- **RTL Standards**: Use logical properties (`start`, `end`, `inline`, `block`).

## 🧪 5. QA & Deployment
- **Verification**: Run `npx tsc --noEmit` and `npm run build` before turn completion.
- **GitHub Policy**: Push to GitHub ONLY after explicit USER approval.
- **Commit Strategy**: Atomic, descriptive commits (e.g., `feat(ui): add liquid glass effect to login`).

---
> [!IMPORTANT]
> Always check `.agents/skills/` for feature-specific logic before implementation.
