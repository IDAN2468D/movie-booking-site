# 🗺️ Layer 4: Plan Phase Roadmap

## Execution Status: SPRINT 6 (Movie Matcher Matrix) - COMPLETED
*The Movie Matcher Matrix epic is 100% stable, completed, and operational. All systems (Quantum Sync, 3D Swiper, Acoustic Deck) verified.*

---

### Sprint 6: Movie Matcher Matrix - COMPLETED
**Goal:** Implement the interactive Swipe Matcher engine featuring hardware-accelerated gestures, strict Zod boundaries, real-time group sync, and Web Audio spatialization.

- [x] **Step 1:** Schema Integrity & Room Sync Actions (Zod boundaries, secure Server Actions).
- [x] **Step 2:** Physics-Driven Swiper Layout (Framer Motion 3D refraction, zero-reflow CSS).
- [x] **Step 3:** Acoustic Deck & Sonic Spatializer (Web Audio API, AI Resonance Overlay, `useTransition` latency masking).

---

### Sprint 5: InSiteMovieCriticAgent (Interactive Speaker Upgrade) - COMPLETED
**Goal:** Replace global state TTS approach with an explicit, contextual Speaker Icon Button attached to each message/text card to bypass browser autoplay restrictions cleanly.

- [x] **Step 1: Component State Extraction & Management**
  - Create a local state tracking mechanism inside `MovieCriticDrawer.tsx` or a sub-component (`MessageBubble.tsx`) to identify the `activeSpeechId`.
  - The message bubble container passes its unique string payload into the `useMovieCriticSpeech` sentence buffering loop via an explicit click gesture.
- [x] **Step 2: Interactive Speaker Trigger Node**
  - Append the speaker vector icon inside the AI chat bubbles.
  - Apply Liquid Glass 4.0 layout bounds: `backdrop-blur-md bg-white/5 border border-white/10 p-2 rounded-full hover:bg-white/15 active:scale-95 transition-all duration-200 cursor-pointer`.
  - Wire the `onClick` event to invoke `window.speechSynthesis.cancel()` followed by `processStream(text)` when toggling ON, or just `cancel()` when toggling OFF.
- [x] **Step 3: Acoustic Wave Feedback UI**
  - Conditionally inject hardware-accelerated glowing classes when the message's `id` matches the `activeSpeechId` (`animate-pulse shadow-[0_0_12px_rgba(139,92,246,0.4)]`).
- [x] **Step 4: Layer 5 Verification Loop**
  - Run type-safety checks (`npx tsc --noEmit`).
  - Compile the React build (`npm run build`).
  - Pass all unit tests (`npx vitest run`) to ensure zero runtime side effects.

---

<details>
<summary>Archived Checkpoints (Previous Sprints)</summary>

### Sprint 5: InSiteMovieCriticAgent (TTS & Cinematic Teleprompter Upgrade) - COMPLETED
- [x] **Step 1:** Speech Tracking Engine Hook (`useMovieCriticSpeech.ts`).
- [x] **Step 2:** Projection Capsule UI Component (`CinematicTeleprompter.tsx`).
- [x] **Step 3:** State Integration, Token Stream Buffering, and User Gesture Guards.
- [x] **Step 4:** Layer 5 Verification Loop passed 100% green.

### Sprint 5: InSiteMovieCriticAgent (Initial) - COMPLETED
- [x] **Step 1:** Secure Node.js Proxy Routing Gateway (`POST /api/critic/proxy/chat`).
- [x] **Step 2:** Localized Message State Array (`useCriticStore.ts`).
- [x] **Step 3:** Glass Chat Container Panel (`MovieCriticDrawer.tsx`).
- [x] **Step 4:** Character-by-Character Typing Stream Effect with error fallbacks.

### Sprint 4: LiquidGlassTicketVault - COMPLETED
- [x] **Step 1:** Offline Local Cache Contract (IndexedDB/Zustand) mapping to DATA.md.
- [x] **Step 2:** Localized Crypto-Token Rotator (`useTicketRotator.ts`) generating HMAC-SHA256 every 15s.
- [x] **Step 3:** Holographic Card UI (`LiquidGlassTicket.tsx`) with Liquid Glass 4.0 and framer-motion parallax.
- [x] **Step 4:** Zero-Network Degradation Guard & Offline Sync banner implementation.

### Sprint 1: DynamicAmbientCinemaMode - COMPLETED
- [x] **Step 1:** Color Palette Adapter (`useAmbientColor.ts`) with HTML5 Canvas extraction.
- [x] **Step 2:** Root Layout CSS Variables Injection (`AmbientThemeProvider.tsx`).
- [x] **Step 3:** Hardware-Accelerated Morphing Transitions (`will-change: background-color`).
- [x] **Step 4:** Integration with Design Tokens and Contrast Guard Utility for WCAG compliance.

### Sprint 2: MovieSwipeMatcher - COMPLETED
- [x] **Step 1:** MongoDB Schema & API Route (`/api/movies/swipe`) implemented with Match trigger.
- [x] **Step 2:** Zustand Local Swipe Aggregation Store implemented with debouncing logic.
- [x] **Step 3:** Liquid Glass 4.0 Swipe Cards UI (`MovieSwipeDeck.tsx`) built via `framer-motion`.
- [x] **Step 4:** Immediate Trigger Match Engine & Event Bridge functional.

### Sprint 3: QuantumSeatMapLiveSync (Real-Time Ticketing) - COMPLETED
- [x] **Step 1:** Establish the `seat_locks` MongoDB collection with TTL indexes for the 10-minute pessimistic hold strategy.
- [x] **Step 2:** Construct the WebSocket real-time event bridge (using SSE Change Streams) broadcasting `SeatLocked`, `SeatReleased`, and `SeatBooked` to connected clients.
- [x] **Step 3:** Build the `SeatMap` layout matrix strictly applying Liquid Glass 4.0 visual markers (free, selected, locked).
- [x] **Step 4:** Implement silent client roll-backs for transaction collisions and verify state consistency across multi-client mocks.
</details>
