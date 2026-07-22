# Phase 25 Tasks: Native Zero-MCP Hyper-Sensory Suite (Sprints 51-55)

## Sprint 51: Spatial IMAX 3D Seat Walkthrough
- `[ ]` Create Zod validation schema `lib/validations/spatialSeat.ts`.
- `[ ]` Create Next.js Server Action `app/actions/getSeatPerspective.ts`.
- `[ ]` Build 3D WebGL component `components/booking/SpatialSeatPreview.tsx` (Three.js / WebGL + Web Audio `PannerNode`).
- `[ ]` Write Vitest test suite `tests/spatial-seat.spec.ts`.

## Sprint 52: AI Director's Companion & Audio Isolator
- `[ ]` Create Server Action `app/actions/getDirectorsTrivia.ts` using native `@google/genai` SDK.
- `[ ]` Build audio equalizer component `components/media/DirectorsAudioCompanion.tsx` using native Web Audio `BiquadFilterNode`.
- `[ ]` Write Vitest test suite `tests/directors-audio.spec.ts`.

## Sprint 53: Biometric Dynamic Holographic Passbook
- `[ ]` Build touch-hold interactive card `components/tickets/BiometricHoloPass.tsx` using `PointerEvents`, Web Audio `OscillatorNode`, and Framer Motion.
- `[ ]` Write Vitest test suite `tests/biometric-pass.spec.ts`.

## Sprint 54: Native Multi-Currency Lock & Split-Pay
- `[ ]` Create exchange rate Server Action `app/actions/getCurrencyRates.ts` fetching direct REST API with Zod validation.
- `[ ]` Build currency lock & split-pay widget `components/checkout/CurrencySplitWidget.tsx`.
- `[ ]` Write Vitest test suite `tests/currency-split.spec.ts`.

## Sprint 55: VIP Cine-Pulse Analytics Dashboard
- `[ ]` Create MongoDB aggregation Server Action `app/actions/getVipAnalytics.ts`.
- `[ ]` Build analytics visualizer `components/vip/VipAnalyticsDashboard.tsx` with Recharts / Chart.js.
- `[ ]` Write Vitest test suite `tests/vip-analytics.spec.ts`.

## Layer 5 Self-Healing & Verification
- `[ ]` Run `npx tsc --noEmit`.
- `[ ]` Run `npm run build`.
- `[ ]` Run `npx vitest run`.

