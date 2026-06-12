# 🗺️ System Skill Registry & Rules (Skill Map)

The system is organized according to a clear hierarchy to guarantee code quality, premium design, and high performance. The order is as follows:

## 🏛️ Governance
- **Unified AI Governance Standard**: The central governance rule that every AI agent must follow. Defines the technology stack (Next.js, MongoDB, Zustand).
- **Project Spec**: The functional specification of the site (data structures, key features).

## 🛠️ Core Skills
Deep technical guidelines organized by domain:
1. **[UI.md](../skills/core/UI.md)**: The "Liquid Glass 3.0" design system (blurs, colors, fonts, 3D parallax).
2. **[DATA.md](../skills/core/DATA.md)**: Database management, Zod schemas, and TMDB integration.
3. **[ENGINE.md](../skills/core/ENGINE.md)**: Ticketing logic, seat management, and transactions.
4. **[OPTIMIZATION.md](../skills/core/OPTIMIZATION.md)**: Performance, caching, and smart loading.

## 🚀 Feature Skills
Guidelines for implementing specific features:
- **[CONCIERGE.md](../skills/features/CONCIERGE.md)**: The AI Assistant (its interface and behavior).
- **[AUTH.md](../skills/features/AUTH.md)**: Security, signup, and login.
- **[LOYALTY.md](../skills/features/LOYALTY.md)**: Points and rewards system.

## 📜 Ironclad Development Rules
1. **Language**: Chat in Hebrew (always wrapped in the premium Liquid Glass 3.0 container with RTL support), code and documentation in English.
2. **Atomicity**: Files up to 200 lines. Split into small sub-components religiously.
3. **Reliability**: Every action returns a Result object `{ success, data, error }`.
4. **Zod**: Mandatory usage of Zod for all data interactions.

---
> [!TIP]
> Every time you request a change, I first review the relevant skill to ensure flawless execution.
