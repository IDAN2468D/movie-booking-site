# 🏛️ AccountPulse System Architecture State

## Module Architecture Overview

| Module ID | Module Name | Primary Path | Key Functionality | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Module A** | Account & Profile | `/src/app/dashboard/profile` | 2FA OTP, Notification Preferences, Profile Update | `ACTIVE` |
| **Module B** | Organization & RBAC | `/src/app/dashboard/organization` | Team Member Roles, Invitations, Access Control | `ACTIVE` |
| **Module C** | Billing & Stripe | `/src/app/dashboard/billing` | Stripe Checkout, Invoices, Tier Upgrade | `ACTIVE` |
| **Module D** | Security & Audit | `/src/app/dashboard/security` | Audit Logs, Active Sessions, Security Presets | `ACTIVE` |
| **Module E** | Expense Manager | `/src/app/dashboard/expenses` | Expense Categorization, Receipts, Status Approval | `ACTIVE` |
| **Module F** | Budget Planner | `/src/app/dashboard/budgets` | Monthly Budget Caps, Variance Analytics | `ACTIVE` |
| **Module G** | Crypto Portfolio | `/src/app/dashboard/crypto` | Asset Holdings, Realized Profit/Loss, Trade Logs | `ACTIVE` |
| **Module H** | Gemini AI Advisor | `/src/app/dashboard/ai-advisor` | Gemini Financial Advisor, Insights (`gemini-3.5-flash-lite`) | `ACTIVE` |

---

## Phase 38: Next-Gen Spatial Haptic & AI Search Suite (Sprints 99-101)
1. **Neural Biometric Pulse Sync & Seat Dynamic Tuning (Sprint 99)**: 3D FOV raycasting, Web Audio 40Hz sub-bass oscillator with spatial panning, device vibration haptics, Zod validated server action (`calculateSpatialHapticPerspectiveAction`), and `SpatialHapticSeatModal.tsx`.
2. **Quantum Multi-Angle Trailer Remixer & AI Hero Aura Scanner (Sprint 100)**: Liquid Glass 4.0 120Hz GPU parallax hero banner, AI aura breakdown modal, and 35Hz sub-bass Web Audio pulse trigger (`HeroAuraModal.tsx`).
3. **React Compiler Boost & Hebrew Voice AI Search (Sprint 101)**: Next.js React Compiler auto-memoization, `optimizePackageImports` for bundle speedup, Hebrew Web Speech API vocal search dock (`VoiceAiCommandShell.tsx`), and Neural Mood Engine modal (`NeuralMoodEngineModal.tsx`).

---

## API Routes & Server Actions Map
- `POST /api/auth/register` - Account Registration
- `POST /api/auth/2fa/generate` - 2FA Secret & QR Code Generation
- `POST /api/auth/2fa/verify` - 2FA Verification
- `POST /api/organization/invite` - Send Team Invitation Token
- `POST /api/billing/checkout` - Create Stripe Checkout Session
- `POST /api/webhooks/stripe` - Stripe Webhook Handler
- `POST /api/expenses` - Create / Filter Expense Entries
- `POST /api/crypto/trade` - Execute Crypto Buy/Sell Log
- `POST /api/ai/advisor` - Gemini AI Advisor Chat Handler (`gemini-3.5-flash-lite`)
