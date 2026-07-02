🚀 AUTH.md: Specular Neural Auth Gate & Session Ledger (v4.6)

An immersive, high-security authentication interface leveraging Next.js 15+ Server Actions, React 19 form states, and GPU-driven Liquid Glass aesthetics.

## 1. Core Technical Stack & Architecture
- [cite_start]**Server Actions & State**: Form submissions must process entirely via secure Next.js Server Actions using React 19's native `useActionState` hook for seamless pendency and error extraction[cite: 19, 26].
- **State Sync**: Upon successful authentication, user state metadata is committed to the global Zustand store using strict atomic selectors to prevent unnecessary re-renders of the root application shell.
- [cite_start]**Validation Layer**: Input validation (Email integrity, Password strength metrics) must execute instantly on both client and server boundaries utilizing a unified strict Zod schema[cite: 29].

## 2. Zero-Reflow Animation Rules
- [cite_start]**Tab & Form Shifting**: Switching between "Login" and "Register" viewports must execute via horizontal GPU-accelerated translations (`style={{ x }}` or `transform: translateX()`) inside Framer Motion containers[cite: 19]. Never mutate element positions via left, right, or margin to eliminate browser layout reflow.
- **Floating Specular Labels**: Form labels must animate seamlessly into focused states using purely layout-safe CSS transforms (`scale` and `translate3d`) processed directly on the GPU layer.

## 3. Liquid Glass 3.0 Visual Specification
- [cite_start]**Refractive Surface**: The main authentication card container must strictly enforce high optical depth tokens: `backdrop-blur-3xl saturate-[200%] brightness-110`[cite: 19].
- **Outer Glow & Shadows**: Structural boundaries must integrate the project's signature depth tokens: `box-shadow: 0 0 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)`.
- **Typography Standards**: Headings must use the 'Outfit' typeface with fluid tracking, while form inputs and helper text rely on 'Inter' for optimal screen readability.

## 4. Data Contracts & Security Enforcement
- **Atomic Files Rule**: Keep the core layout wrapper, login form, and registration sub-components strictly isolated. No individual component file may exceed 180 lines of code.
- [cite_start]**Standardized Return Pattern**: All authentication endpoints, server actions, and validation utilities must communicate back to the client boundary using the unified project Result Pattern: `{ success: boolean; data?: any; error?: string }`[cite: 19].