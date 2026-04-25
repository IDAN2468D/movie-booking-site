# 🏛️ Platform Governance & Engineering Standards (v2.0)

This unified governance file replaces multiple separate audit/QA files to ensure a noise-free, high-integrity development environment.

---

## 🛡️ 1. Security & Data Integrity
- **Zero-Trust**: Use Zod for ALL input validation.
- **Isolation**: Secrets in `.env` only; use `process.env` on server-side.
- **Auth**: Protect sensitive routes/actions with `AuthGuard` or server-side session checks.
- **PII**: No raw user data in logs; obfuscate sensitive inputs (CVV, Passwords).

## ⚡ 2. Performance & Optimization
- **Images**: Use `next/image` with `priority` for LCP and `WebP` format.
- **Components**: Maximize Server Components. Minimize Client Component size.
- **State**: Use strict Zustand selectors: `useStore(state => state.val)`.
- **Caching**: 1-hour revalidation for TMDB: `next: { revalidate: 3600 }`.

## 🧪 3. QA, CI/CD & Workflow
- **Surgical Fixes**: Fix errors with minimal, targeted code changes.
- **Verification**: Run `lint`, `build`, and `test` (Playwright/Vitest) before turn completion.
- **TS Quality**: Zero `any` types; zero lint warnings allowed.
- **Pre-Deploy Check**: MANDATORY to run `npm run build` or `npx tsc --noEmit` before pushing to GitHub to prevent Render deployment failures.
- **Build**: Ensure Next.js build passes locally before pushing.

## 💎 4. RTL & Design System (Liquid Glass 2.0)
- **Logical Props**: Use `start`/`end`, `inline`/`block` instead of `left`/`right`/`top`/`bottom`.
- **Mirroring**: Mirror directional elements (arrows) but NOT brand/static icons.
- **Typography**: `Outfit` for display/UI, `Inter` for body.
- **A11y**: 4.5:1 contrast; descriptive Hebrew `aria-label` tags; Cyan focus rings.

---
> [!IMPORTANT]
> Adherence to these standards is verified during every QA phase.
