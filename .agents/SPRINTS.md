# 🤖 Architectural Blueprints: Sprints 11 to 22 (v7.1)
*Single Source of Truth for advanced experiential modules.*

---

## 🎟️ Sprint 11: Specular Seating Roulette Fusion
- **Status:** ✅ Completed

### 1. PRD Layer: Product Scope & Target Persona
- **Concept:** Provide a gamified seat raffle interface integrated directly into the `SeatMap.tsx` coordinate grid. Users click "רולטת מושבים" to initiate a fast visual scan that randomly lands on an available seat, locking it atomically on the server.
- **Visuals:** Framer Motion-based high-speed scale waves ripple outwards from the selected coordinate once locked. A full-screen "Currency Cascade" coin waterfall drops from the top viewport upon successful transaction.

### 2. Spec Layer: Technical Specifications
- **Data Schema & Validation:** Zod validator `RouletteSeatSchema` secures candidate coordinates.
- **Server Action:** `lockRouletteSeatAction` (App Router) commits the seat lock to MongoDB using an atomic Mongoose `findOneAndUpdate` operation. Returns the standardized `{ success: boolean; data?: any; error?: string }` contract.
- **Zustand Store:** `useRouletteStore` exposes `isSpinning`, `winningSeatCoords`, `rippleTriggerId`, `startSpin`, and `resolveSpin`.
- **Acoustics:** Web Audio API triggers clicks on each step of the spin, concluding with a 40Hz sub-bass frequency envelope drop (`playResolutionDrop`) on landing.
- **Performance:** GPU compositor-only rendering using `transform-gpu` and `will-change: transform`. Files must remain strictly under 200 lines.

### 3. Plan Layer: Step-by-Step Roadmap
1. **Data Layer:** Create Zod schemas and Server Actions (`lockRouletteSeatAction`).
2. **UI/Physics:** Implement `SeatingRoulette.tsx` with a `requestAnimationFrame` shuffle loop. Integrate Framer Motion ripples.
3. **Acoustics & Integration:** Mount the Roulette trigger button in `SeatMap.tsx`. Wire synthesized spin clicks and sub-bass drop.

---

## 🖥️ Sprint 12: Netflix-Style Eco Screen Saver
- **Status:** ✅ Completed

### 1. PRD Layer: Product Scope & Target Persona
- **Concept:** Protect user screens and save system resources during idle periods (3 minutes without interaction). Renders a gorgeous full-bleed rotating carousel of featured movie art utilizing slow crossfades and a subtle Ken Burns zoom effect.
- **Zero-CPU Eco Mandate:** Drops CPU utilization to absolute zero during idle by utilizing GPU keyframes and completely freezing background DOM layers.

### 2. Spec Layer: Technical Specifications
- **State Management:** Zustand `useUIStore` monitors user activity and toggles `isScreenSaverActive`.
- **GPU Compositing:** Animations are written in vanilla CSS using `@keyframes` with `will-change: transform, opacity`.
- **DOM Freezing:** When `isScreenSaverActive` is true, the primary layout container receives `content-visibility: hidden` (or `display: none` for non-scroll elements) to suspend main-thread rendering.
- **Event Listeners:** Global activity listener (`mousemove`, `keydown`, `mousedown`) uses a debounced 3-minute timer with clean unmount teardowns.

### 3. Plan Layer: Step-by-Step Roadmap
1. **State Layer:** Add `isScreenSaverActive` and activity tracker hooks to Zustand.
2. **UI Layer:** Create `EcoScreenSaver.tsx` with CSS-only animations and background carousel slides.
3. **Integration Layer:** Mount at root layout level. Wrap the primary application DOM in a layout container that applies `content-visibility: hidden` when active.

---

## 💬 Sprint 13: Conversational AI One-Tap Booking & Payment
- **Status:** ✅ Completed

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
2. **UI Layer:** Create `BookingConfirmationWidget.tsx` matching Liquid Glass 4.0 specifications.
3. **Integration Layer:** Connect the widget to the chat message renderer in `ChatWindow.tsx`.

---

## 🏆 Sprint 14: VIP Bonuses & Pulse Gamification
- **Status:** ✅ Completed

### 1. PRD Layer: Product Scope & Target Persona
- **Concept:** Incentivize booking patterns with a gamified rewards system. Users earn "Pulse Points" for bookings and unlock status tiers (Bronze -> Silver -> Gold -> Liquid Elite).
- **Dashboard:** A premium hub displaying points trackers, active challenges, and redeemable rewards.

### 2. Spec Layer: Technical Specifications
- **Zustand Integration:** A dedicated shallow-baked selector slice `useLoyaltyStore` manages point totals and tier mappings.
- **Acoustic Feedback:** Point accumulation generates spatial synthesized clicks. Achievement unlock triggers `playResolutionDrop` (sub-bass 40Hz envelope).
- **Particle System:** Framer Motion hardware-accelerated particle canvas emits shards when rewards are redeemed.
- **Design Tokens:** Sub-pixel borders (`border-white/[0.12]`), blur saturation (`saturate-[250%]`), and elite gold typography styling (`font-outfit`).

### 3. Plan Layer: Step-by-Step Roadmap
1. **Data Layer:** Create `loyaltyActions.ts` for loyalty points fetching and rewards redemption.
2. **UI Layer:** Build `BonusesDashboard.tsx` and sub-components (under 200 lines each) with Liquid Glass 4.0 tokens.
3. **Acoustics & Kinetics:** Integrate spatialized click synthesis and Framer Motion shard explosions on ticket checkout or points redemption.

---

## 💎 Sprint 15: Dynamic Specular Subtitles Engine
- **Status:** ✅ Completed

### 1. PRD Layer: Product Scope & Target Persona
- **Concept:** Upgrade trailer watching with live audio-reactive subtitles. Subtitles swell, glow, and adjust their contrast dynamically based on the trailer's live volume levels and background video density.

### 2. Spec Layer: Technical Specifications
- **Audio Processing:** Connects to the trailer's HTML5 Video element using Web Audio API `AnalyserNode` to capture real-time frequency bytes.
- **Framer Motion Binding:** Binds frequency bytes to custom CSS properties and Framer Motion spring values (`scale`, `textShadow`, `opacity`) avoiding React re-renders by utilizing inline style bindings.
- **Validation Bounds:** Zod model `SubtitleSchema` validates subtitle timing and translation strings.
- **Visuals:** Micro-container features `backdrop-blur-md saturate-[160%] bg-white/5` with a sub-pixel border.

### 3. Plan Layer: Step-by-Step Roadmap
1. **Audio Hook:** Build `useAudioAnalyser.ts` to capture real-time decibel updates from media elements.
2. **Subtitles UI:** Implement `SpecularSubtitles.tsx` and `SubtitleText.tsx` (each under 200 lines).
3. **Integration:** Mount the engine into the upcoming movie trailer modal container (`TrailerModal.tsx`), linking the video element output node.

---

## 👥 Sprint 16: Phantom Presence & Cine-Ghosting
- **Status:** ✅ Completed

### 1. PRD Layer: Product Scope & Target Persona
- **Concept:** Bring friends together for shared online sessions. Peers can co-watch trailers and browse the seat map together, with live cursor tracking visualized as iridescent "ghost presence blobs."

### 2. Spec Layer: Technical Specifications
- **Signaling Contract:** Secured via Zod schemas `PeerSignalPayloadSchema` and `SessionSyncSchema`.
- **Peer-to-Peer Link:** Socket.io handles signaling and WebRTC DataChannels transmit coordinate packages (`{ row, col, x, y }`).
- **Presence Blobs:** Rendered on the `SeatMap` matrix using `transform-gpu` and absolute positioning coordinates.
- **Performance:** Zero layout reflows on remote mouse updates by tracking styles via Framer Motion's `style={{ x, y }}` object.

### 3. Plan Layer: Step-by-Step Roadmap
1. **Websocket & Signaling:** Create API signaling route `/api/presence/signal` using Socket.io.
2. **Signaling Hook:** Develop `usePhantomPresence.ts` to handle ICE candidate exchange and RTC connection state.
3. **UI Overlay:** Build `PhantomCursors.tsx` and mount it directly over the `SeatMap.tsx` grid canvas.

---

## 🎬 Sprint 18: Movies Coming Soon Hub
- **Status:** ✅ Completed

### 1. PRD Layer: Product Scope & Target Persona
- **Concept:** A dedicated portal and carousel for upcoming movie releases, allowing users to watch trailers, track release count-downs, and add movies to local calendar trackers.
- **Visuals:** Liquid Glass 4.0 layout, zero-reflow transition states, and full-screen trailer modals.

### 2. Spec Layer: Technical Specifications
- **Data Boundary:** Zod-backed `UpcomingMovieSchema` mappings for TMDB upcoming APIs.
- **Server Cache:** Next.js revalidation cache (24 hours) protecting TMDB keys on the server.
- **Performance:** 120Hz zero-reflow loading skeletons and pure CSS Ken Burns effect on trailer posters.

### 3. Plan Layer: Step-by-Step Roadmap
1. **Data Layer:** Create `getUpcomingMoviesAction` and `getMovieTrailerAction` Server Actions.
2. **UI Layer:** Build `ComingSoonCarousel.tsx`, `UpcomingMovieCard.tsx`, and `TrailerModal.tsx` under 200 LOC.
3. **Integration:** Hook upcoming routes into Sidebar and Mobile navigation layouts.

---

## 🎫 Sprint 19: Generative Holographic Scratch-Card
- **Status:** ✅ Completed

### 1. PRD Layer: Product Scope & Target Persona
- **Concept:** Reward users with a digital holographic scratch-card after checkout that grants discount percentages, fixed pricing deductions, or free passes.
- **Visuals:** Premium golden/holographic scratch-off overlay with sub-pixel chromatic refractions.

### 2. Spec Layer: Technical Specifications
- **Atomic Operations:** Mongo transactional `$set` filter to prevent double-claiming or race conditions.
- **Zod schemas:** Strict type limits for rewards (`lib/validations/scratchCard.ts`).
- **Safety:** Verify `expiresAt > new Date()` for all rewards.

### 3. Plan Layer: Step-by-Step Roadmap
1. **Database Layer:** Implement Zod validations and atomic Mongo transaction handlers.
2. **Components:** Build `ScratchCardContainer.tsx` and canvas scratch triggers (`GoldScratchCard.tsx`).
3. **Integration:** Connect checkout completion to trigger the Scratch-Card overlay modal.

---

## 🏎️ Sprint 22: 3D Cinematic Parallax Hero
- **Status:** ✅ Completed

### 1. PRD Layer: Product Scope & Target Persona
- **Concept:** Provide a breathtaking 3D depth hero element for featured movies that tracks mouse movement (parallax) for an immersive theatrical vibe.
- **Performance:** Limit calculations to requestAnimationFrame GPU-bound animations to maintain 120Hz refresh rates.

### 2. Spec Layer: Technical Specifications
- **Animation Stack:** Hardware-composited `will-change: transform` vectors.
- **Z-Index Layering:** Multi-layered background art, title typography, and foreground overlays separated by physical scale margins.

### 3. Plan Layer: Step-by-Step Roadmap
1. **UI Layer:** Redesign `FeaturedHero.tsx` into a modular 3D layered structure.
2. **Animation Loop:** Add mouse coordinates tracking hook with linear interpolation (lerp).
3. **Styling:** Ingest sub-pixel chromatic outlines for typography.
