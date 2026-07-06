# Specular Neural Auth Gate Specification (v4.0)

## 1. Architectural Overview
The Specular Neural Auth Gate replaces standard static login/register layouts with an obsidian-depth glass refracting gateway. It utilizes React 19 native form status paradigms and Next.js 15 Server Actions to handle identity verification securely and optimistically without triggering full-page browser reflows.

## 2. Core Architectural Rules
- **Atomic Architecture**: Code files must remain strictly modular. Form sub-elements, status indicators, and background glass layers must be divided into micro-components under 200 lines per file.
- **React 19 Execution**: Forms must capture pending and error states natively using the React 19 `useActionState` hook. Traditional client-side `useState` loading toggles are forbidden.
- **Zero-Reflow Frame Lock**: Visual feedback loops, focus ring shimmers, and error box translations must leverage GPU-bound transitions exclusively (`transform-gpu`, `scale`, `opacity`) to ensure a locked 120Hz display line.

## 3. Data-Flow & Concurrency
1. **Input Schema**: Data boundary checking is enforced at the entry barrier using Zod validators on the client and server sides.
2. **Server Action Dispatch**: The form routes payload straight into a secure Next.js Server Action (`authenticateUserAction`), wrapping crypto functions and JWT cookie settings.
3. **Unified Response**: The execution pipeline returns responses strictly obeying the project's Result Pattern: `{ success: boolean; error?: string; targetUrl?: string }`.
4. **Optimistic Feedback**: Transition paths use React 19 `useTransition` to seamlessly carry the user into the booking dashboard upon validation.

## 4. Visual Design Tokens (Liquid Glass 4.0 Standard)
- **Obsidian Container**: `backdrop-blur-[40px] saturate-[250%] bg-neutral-950/60 border border-white/10` featuring macro-depth inner shadows to simulate heavy optical glass refractions.
- **Typography Layout**: Structural titles and dynamic form headers map directly to `font-outfit`. Interactive input text fields, security requirement logs, and system error feedback loop patterns map to `font-inter`.