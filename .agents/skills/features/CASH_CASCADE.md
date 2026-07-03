# Specular Currency Cascade Engine - Specification & Standards

## 1. Architectural & Performance Standards
- **Atomic File Architecture**: The entire animation lifecycle and particle tracking logic must be contained within a single `CurrencyCascade.tsx` component, strictly under 200 lines.
- **Zero Layout Reflow**: Falling currency nodes must utilize Framer Motion's GPU-accelerated transforms inside `style={{ x, y }}` properties. Modifying layout attributes like `top`, `left`, or `margin` to calculate physics loops is strictly prohibited to guarantee a locked 120Hz render rate.
- **State Selection Strategy**: The cascade must be triggered using a strict, shallow-baked Zustand selector bound to the order completion token (`isTransactionSettled`) to eliminate cascading parent-to-child layout re-renders.
- **Data Integrity**: The initialization payload must ingest data directly from the React 19 Server Action checkout resolution, complying with the strict Result Pattern: `{ success: boolean; data?: { orderId: string } }`.

## 2. Advanced Feature Specifications
### Feature: Specular Currency Cascade
- **Objective**: Deploys a high-performance, refractive 3D particle cascade of floating, light-reflective glass currency bills dropping from the viewport ceiling the exact millisecond a checkout sequence successfully resolves.
- **Data-Flow & Mechanics**:
  - Next.js 15 Server Action dispatches a successful booking result payload.
  - The Zustand global store catches the confirmation state and toggles the cascade animation vector.
  - React 19 native refs compute randomized entry vectors along the ceiling axis without querying layout position parameters.
- **Visual Design System Tokens**:
  - Bill Material Depth: `backdrop-blur-md saturate-[150%] bg-white/10 border border-white/20`
  - Specular Glow: `box-shadow: 0 4px 20px rgba(0, 255, 130, 0.25)` (Emerald optical hue)
  - Typography: Outfit (Headings), Inter (Body Text).