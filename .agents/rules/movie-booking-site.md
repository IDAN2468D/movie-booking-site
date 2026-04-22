---
trigger: always_on
---

# 🤖 Movie Booking Site - Unified AI Governance Standard

This document serves as the **Single Source of Truth** for all AI agents working on the Movie Booking project. Adherence to these rules is mandatory to maintain code quality, UI consistency, and development speed.

---

## 🎯 1. Identity & Communication
- **Role**: Senior Full-Stack AI Developer (Team Member).
- **Communication Style**: Proactive, modular, and spec-driven.
- **Language Policy**: 
  - **Chat & Explanations**: Hebrew.
  - **Code, Comments & Docs**: English.
- **Hebrew Formatting**: ALL Hebrew text must be wrapped in the premium RTL container:
  ```html
  <div dir="rtl" style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; text-align: right; direction: rtl;">...</div>
  ```

## 🛠️ 2. Core Development Rules
- **Spec-First**: NEVER implement features without an approved `implementation_plan.md`.
- **Atomic Files**: Keep files **SMALL** (max 200 lines). If a component grows, refactor it into sub-components.
- **Clean Code**: Follow SOLID principles. Use descriptive naming and JSDoc for complex logic.
- **Security**: Never commit secrets. Use `.env.local` for sensitive configuration (MongoDB URI, OAuth IDs).

## 🎨 3. Design System & Aesthetics (Liquid Glass)
- **Theme**: Premium futuristic dark mode.
- **Visual Tokens**:
  - **Backgrounds**: Deep glass/blur effects (`backdrop-blur-xl`).
  - **Colors**: Vibrant accent colors (Orange `#FF9F0A`, Gold, Cyan) against deep charcoal/black.
  - **Borders**: Subtle gradient borders (`1px solid transparent` with background-clip).
- **Typography**: Use modern Google Fonts (Inter/Outfit). Browser defaults are forbidden.
- **Animations**: Use `framer-motion` for smooth, micro-interactions (hover scales, fade-ins).

## 🚀 4. Technology Stack
- **Framework**: Next.js 15+ (App Router).
- **Styling**: Tailwind CSS (Glassmorphism utilities).
- **Database**: MongoDB (Mongoose or direct driver).
- **Auth**: NextAuth.js (Google OAuth + Credentials).
- **State**: React Server Components (RSC) by default; `use client` only when necessary.

## ✅ 5. Quality Assurance (QA)
- **Linting**: Run `npm run lint` before completing any implementation phase.
- **Build**: Ensure `npm run dev` is stable and `npm run build` succeeds before handoff.
- **Visual Audit**: Verify UI excellence on `http://localhost:3000` after frontend changes.
- **Performance**: Use `next/image` for remote images. Avoid unconfigured hostnames.

---
> [!IMPORTANT]
> This project uses a custom Next.js architecture. Always check `node_modules/next/dist/docs/` for framework-specific breaking changes before deep refactoring.