# Specular Neural Catering Pipeline (v2.0) - Specification & Standards

## 1. Architectural & Performance Standards
- **Atomic File Architecture**: No single file may exceed 200 lines. Isolate visual card matrices, phase scheduling wheels, and allergy filter pills into dedicated micro-subcomponents.
- **State Selection Strategy**: Zustand global state stores (cart, delivery phases, allergy tokens) must be consumed strictly using atomic, shallow-baked selectors to eliminate cascading parent-to-child layout re-renders.
- **Zero Layout Reflow**: All transitions, phase selection animations, and fluid cart updates must exclusively employ hardware-accelerated GPU x/y transforms inside Framer Motion instead of top/left/margin layout properties.
- **Data Integrity & Error Handling**: All catering pipeline payloads (add-to-cart, phase updates, group splits) must be validated via Zod schemas at runtime and wrapped in the strict Result Pattern: `{ success: boolean; data?: any; error?: string }`.

## 2. Advanced & Expanded Feature Specifications

### Feature: Specular Neural Catering Pipeline (With Multi-Phase & Group Sync)
- **Objective**: Replaces static snack ordering with a refractive, fluid UI that uses localized mood analytics, movie timeline mapping, and user biometric tokens to orchestrate synchronized group catering or phase-delayed delivery directly to the seat.
- **Data-Flow & Mechanics**:
  - **Temporal Phase Scheduler**: Uses Next.js 15+ Server Actions to map snacks to distinct timeline markers (Trailers, Act 1, Climax). React 19 `useOptimistic` manages the instant visual transition of items between delivery phases.
  - **Biometric Filtering**: Filters menu items by crossing user preference profiles fetched from MongoDB against a Zod-validated ingredient matrix before rendering the grid view.
  - **Group Combo Splits**: Syncs shared cart state across related seat vectors in the Zustand store layer, allowing unified checkout optimization.
- **Visual Design System Tokens**:
  - Filter Layer: `backdrop-blur-3xl saturate-[200%] brightness-110`
  - Container Depth: `box-shadow: 0 0 50px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.15)`
  - Typography: Outfit (Headings), Inter (Body Text).