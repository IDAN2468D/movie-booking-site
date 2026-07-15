# 🤖 Architectural Blueprints: Sprints 11 to 16 (v6.2)
*Single Source of Truth for advanced experiential modules.*

---

## 🎟️ Sprint 11: Specular Seating Roulette Fusion

### 1. PRD Layer: Product Scope & Target Persona
- **Concept:** Provide a gamified seat raffle interface integrated directly into the `SeatMap.tsx` coordinate grid. Users click "רולטת מושבים" to initiate a fast visual scan that randomly lands on an available seat, locking it atomically on the server.
- **Visuals:** Framer Motion-based high-speed scale waves ripple outwards from the selected coordinate once locked. A full-screen "Currency Cascade" coin waterfall drops from the top viewport upon successful transaction.

### 2. Spec Layer: Technical Specifications
- **Data Schema & Validation:** Zod validator `RouletteSeatSchema` secures candidate coordinates.
- **Server Action:** `lockRouletteSeatAction` (App Router) commits the seat lock to MongoDB using an atomic Mongoose `findOneAndUpdate` operation. Returns the standardized `{ success: boolean; data?: any; error?: string }` contract.
- **Zustand Store:** `useRouletteStore` exposes:
  ```typescript
  interface RouletteState {
    isSpinning: boolean;
    winningSeatCoords: { row: number; col: number } | null;
    rippleTriggerId: number;
    startSpin: () => void;
    resolveSpin: (coords: { row: number; col: number }) => void;
  }
  ```
- **Acoustics:** Web Audio API triggers clicks on each step of the spin, concluding with a 40Hz sub-bass frequency envelope drop (`playResolutionDrop`) on landing.
- **Performance:** GPU compositor-only rendering using `transform-gpu` and `will-change: transform`. Files must remain strictly under 200 lines.

### 3. Plan Layer: Step-by-Step Roadmap
1. **Data Layer:** Create `lib/validations/roulette.ts` with Zod schemas. Build `app/actions/rouletteActions.ts` implementing `lockRouletteSeatAction`.
2. **UI/Physics:** Implement `components/booking/SeatingRoulette.tsx` with a `requestAnimationFrame` shuffle loop. Integrate Framer Motion ripples on the seat grid.
3. **Acoustics & Integration:** Mount the Roulette trigger button in `SeatMap.tsx`. Wire `useRouletteAudio` to synthesize spatial spin ticks and the sub-bass landing drop.

---

## 🖥️ Sprint 12: Netflix-Style Eco Screen Saver

### 1. PRD Layer: Product Scope & Target Persona
- **Concept:** Protect user screens and save system resources during idle periods (3 minutes without interaction). Renders a gorgeous full-bleed rotating carousel of featured movie art utilizing slow crossfades and a subtle Ken Burns zoom effect.
- **Zero-CPU Eco Mandate:** Drops CPU utilization to absolute zero during idle by utilizing GPU keyframes and completely freezing background DOM layers.

### 2. Spec Layer: Technical Specifications
- **State Management:** Zustand `useUIStore` monitors user activity and toggles `isScreenSaverActive`.
- **GPU Compositing:** Animations are written in vanilla CSS using `@keyframes` with `will-change: transform, opacity`.
- **DOM Freezing:** When `isScreenSaverActive` is true, the primary layout container receives `content-visibility: hidden` (or `display: none` for non-scroll elements) to suspend main-thread rendering.
- **Event Listeners:** Global activity listener (`mousemove`, `keydown`, `mousedown`) uses a debounced 3-minute timer with clean unmount teardowns.

### 3. Plan Layer: Step-by-Step Roadmap
1. **State Layer:** Add `isScreenSaverActive` and activity tracker hooks to the Zustand store.
2. **UI Layer:** Create `components/layout/EcoScreenSaver.tsx` with CSS-only animations and background carousel slides.
3. **Integration Layer:** Mount `EcoScreenSaver` at the app root layout level. Wrap the primary application DOM in a layout container that applies `content-visibility: hidden` when active.

---

## 💬 Sprint 13: Conversational AI One-Tap Booking & Payment

### 1. PRD Layer: Product Scope & Target Persona
- **Concept:** Enable users to complete a booking entirely through text conversation with the AI Concierge. The bot assists with seat selection, add-ons (snacks), and requests payment, presenting a secure, inline checkout widget inside the drawer.
- **Workflow:** `IDLE` -> `SEAT_SELECT` -> `ADD_ONS` -> `PAYMENT_PENDING` -> `SUCCESS` / `FAILED`.

### 2. Spec Layer: Technical Specifications
- **Server Action:** `processSecureBooking` processes transactions securely. On payment failure or timeout, it triggers an atomic rollback in MongoDB, deleting the corresponding `SeatLock` records.
- **Zod Boundaries:** Strict payload validation contracts for items, pricing, and seat IDs.
- **Checkout Component:** `BookingConfirmationWidget.tsx` renders a Liquid Glass 4.0 layout overlay inside the chat bubble list on checkout trigger.
- **Kinetics:** Localized Framer Motion particle explosion radiates outward from the "שלם עכשיו" button on success.

### 3. Plan Layer: Step-by-Step Roadmap
1. **Data Layer:** Build `processSecureBooking` Server Action inside `app/actions/paymentActions.ts` with atomic transaction rollbacks.
2. **UI Layer:** Create `components/ai/BookingConfirmationWidget.tsx` matching Liquid Glass 4.0 specifications.
3. **Integration Layer:** Connect the widget to the chat message renderer in `ChatWindow.tsx` so the AI can inject checkout payloads.

---

## 🏆 Sprint 14: VIP Bonuses & Pulse Gamification

### 1. PRD Layer: Product Scope & Target Persona
- **Concept:** Incentivize booking patterns with a gamified rewards system. Users earn "Pulse Points" for bookings and unlock status tiers (Bronze -> Silver -> Gold -> Liquid Elite).
- **Dashboard:** A premium hub displaying points trackers, active challenges, and redeemeable rewards.

### 2. Spec Layer: Technical Specifications
- **Zustand Integration:** A dedicated shallow-baked selector slice `useLoyaltyStore` manages point totals and tier mappings.
- **Acoustic feedback:** Point accumulation generates spatial synthesized clicks. Achievement unlock triggers `playResolutionDrop` (sub-bass 40Hz envelope).
- **Particle System:** Framer Motion hardware-accelerated particle canvas emits shards when rewards are redeemed.
- **Design Tokens:** Sub-pixel borders (`border-white/[0.12]`), blur saturation (`saturate-[250%]`), and elite gold typography styling (`font-outfit`).

### 3. Plan Layer: Step-by-Step Roadmap
1. **Data Layer:** Create `app/actions/loyaltyActions.ts` to fetch user loyalty points and handle rewards redemption Server Actions.
2. **UI Layer:** Build `components/vip/BonusesDashboard.tsx` and sub-components (under 200 lines each) with Liquid Glass 4.0 tokens.
3. **Acoustics & Kinetics:** Integrate spatialized click synthesis and Framer Motion shard explosions on ticket checkout or points redemption.

---

## 💎 Sprint 15: Dynamic Specular Subtitles Engine

### 1. PRD Layer: Product Scope & Target Persona
- **Concept:** Upgrade trailer watching with live audio-reactive subtitles. Subtitles swell, glow, and adjust their contrast dynamically based on the trailer's live volume levels and background video density.

### 2. Spec Layer: Technical Specifications
- **Audio Processing:** Connects to the trailer's HTML5 Video element using Web Audio API `AnalyserNode` to capture real-time frequency bytes.
- **Framer Motion Binding:** Binds frequency bytes to custom CSS properties and Framer Motion spring values (`scale`, `textShadow`, `opacity`) avoiding React re-renders by utilizing inline style bindings.
- **Validation Bounds:** Zod model `SubtitleSchema` validates subtitle timing and translation strings.
- **Visuals:** Micro-container features `backdrop-blur-md saturate-[160%] bg-white/5` with a sub-pixel border.

### 3. Plan Layer: Step-by-Step Roadmap
1. **Audio Hook:** Build `hooks/useAudioAnalyser.ts` to capture real-time decibel updates from media elements.
2. **Subtitles UI:** Implement `components/fx/SpecularSubtitles.tsx` and `components/fx/SubtitleText.tsx` (each under 200 lines).
3. **Integration:** Mount the engine into the upcoming movie trailer modal container (`TrailerModal.tsx`), linking the video element output node.

---

## 👥 Sprint 16: Phantom Presence & Cine-Ghosting

### 1. PRD Layer: Product Scope & Target Persona
- **Concept:** Bring friends together for shared online sessions. Peers can co-watch trailers and browse the seat map together, with live cursor tracking visualised as iridescent "ghost presence blobs."

### 2. Spec Layer: Technical Specifications
- **Signaling Contract:** Secured via Zod schemas `PeerSignalPayloadSchema` and `SessionSyncSchema`.
- **Peer-to-Peer Link:** Socket.io handles signaling and WebRTC DataChannels transmit coordinate packages (`{ row, col, x, y }`).
- **Presence Blobs:** Rendered on the `SeatMap` matrix using `transform-gpu` and absolute positioning coordinates.
- **Performance:** Zero layout reflows on remote mouse updates by tracking styles via Framer Motion's `style={{ x, y }}` object.

### 3. Plan Layer: Step-by-Step Roadmap
1. **Websocket & Signaling:** Create API signaling route `/api/presence/signal` using Socket.io.
2. **Signaling Hook:** Develop `hooks/usePhantomPresence.ts` to handle ICE candidate exchange and RTC connection state.
3. **UI Overlay:** Build `components/booking/PhantomCursors.tsx` and mount it directly over the `SeatMap.tsx` grid canvas.
