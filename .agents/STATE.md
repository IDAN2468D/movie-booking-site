# 🧠 Agent Stack State & Project Scope

This file acts as the primary Layer 1 & 2 Persistence state for the Agent Stack Framework.
**Agents must read this file to understand the current technical boundaries and project scope.**

## 🎭 Master Scope: Advanced Experiential Features

### 🎯 Layers 1 & 2: PRD (Product Requirements Document)
- **Concept:** Elevating the discovery and booking experience to a premium, immersive, and highly collaborative environment driven by The Agent Stack.
- **Core Capabilities:**
  1. **MovieSwipeMatcher:** [✅ Implemented/Verified] A real-time "Tinder-style" movie matchmaking system. Involves zero-lag swiping via hardware-accelerated translation matrices, local memory state aggregation (debounced), and an immediate trigger match engine without re-querying the database index.
  2. **DynamicAmbientCinemaMode:** [✅ Implemented/Verified] Ambient responsiveness extracting color palettes from active movie assets and reflecting them globally. Enforces zero layout reflows by asynchronously morphing theme backdrops via CSS variables.
  3. **QuantumSeatMapLiveSync:** [✅ Implemented/Verified] Real-time interactive Cinema Hall Seat Map Matrix. Features a pessimistic hold strategy (10 min locks), a real-time event bridge for global client syncing, and strict collision avoidance with silent client roll-backs.
  4. **LiquidGlassTicketVault:** [✅ Implemented/Verified] Offline-ready digital ticket verification. Guarantees cryptographic verification with dynamic QR tokenization rotating every 15s via a time-based hashing algorithm linked to secure JWT payloads.
  5. **InSiteMovieCriticAgent:** [✅ Implemented/Verified] Embedded interactive AI Movie Critic Bot inside the movie description canvas, utilizing an encrypted back-channel gateway route (Port 5000) to shield API keys. Upgraded with real-time Text-to-Speech (TTS) engine, synchronized kinetic floating caption projection capsule, and contextual interactive Speaker Icon nodes on chat bubbles for manual playback control.
  6. **Predictive Soul-Seat Matrix & Dynamic Pricing Engine:** [✅ Implemented/Verified] Emotion-driven seat prediction engine utilizing active MongoDB live locks state. Incorporates real-time soul-seat coordinate mapping and dynamic flash offers with an ultraviolet pulse overlay.
  7. **Dynamic Cinema Trailer Stream:** [✅ Implemented/Verified] Official video streams projected inside a floating Liquid Glass media node, using real-time DOM frame extraction for dynamic ambient glow mapping.
  8. **Kinetic Group Booking & Split-Bill Engine:** [✅ Implemented/Verified] Shared live booking sessions across the coordinate grid with individual seat checkout states, synced via server actions with a strict TTL countdown window.
  9. **Predictive Ticket Demand Analytics:** [✅ Implemented/Verified] Real-time evaluation of coordinate booking frequencies against TMDB global popularity vectors, powering a physical spring-based dynamic price shift scale.
  10. **Cinema Social Pulse (Social Expansion):** [✅ Implemented/Verified] Real-time user presence indicators on the seating chart. Visualizes other users browsing the same showtime as Liquid Glass Presence Blobs using WebSockets and ephemeral session states.

### 📐 Layer 3: Technical Spec (Blueprint)
- **State Architecture:** Manage UI transitions via hardware-accelerated CSS (`will-change: transform, background-color`) mapped to Liquid Glass 4.0 specs. Use Zustand for localized state slicing to prevent global re-renders. All components must strictly limit to 200 LOC.
- **Server-Client Contract States:**
  - **1. MovieSwipeMatcher Contracts:**
    - **MongoDB Payload (`swipe_sessions`):** `{ _id: ObjectId, sessionId: String, hostUserId: ObjectId, participants: [ObjectId], sessionStatus: 'active'|'matched', swipes: [{ userId: ObjectId, movieId: ObjectId, direction: 'like'|'dislike', timestamp: Date }], matchedMovieId: ObjectId }`
    - **API Endpoint (`/api/movies/swipe`):** `POST` taking JSON Payload: `{ "user_id": "ObjectId", "movie_id": "ObjectId", "action": "like" | "dislike" }`. Responds with `{ success: boolean, matchFound: boolean, matchedMovieId?: string }`.
    - **Local Swipe Aggregation Cache (Zustand):** `{ swipeQueue: Array<{ movieId, action }>, isSyncing: boolean, syncThreshold: number (default 3), syncTimeout: number (debounce window e.g., 2000ms) }` to guarantee zero-lag 120Hz swiping animations.
    - **Socket Events:** `ParticipantJoined`, `SwipeRecorded`, `MatchFound` (broadcasts `matchedMovieId`).
  - **2. DynamicAmbientCinemaMode Contracts:**
    - **Color Palette Structure (Client-Side Context Extraction):** Image vectors are parsed locally via a custom `useAmbientColor` hook utilizing an off-screen `HTMLCanvasElement` to compute dominant `rgb()` values and construct complementary palettes.
    - **Hardware-Accelerated CSS Architecture:** Enforces zero layout reflows by injecting `--ambient-theme-glow` CSS variables at the root wrapper. Morphing transitions must exclusively use hardware-optimized properties: `transition: background-color 0.6s ease-in-out, box-shadow 0.6s ease-in-out; will-change: background-color, box-shadow;`.
  - **3. QuantumSeatMapLiveSync Contracts:**
    - **MongoDB Payload (`seat_locks`):** `{ _id: ObjectId, seatId: String, showtimeId: ObjectId, userId: ObjectId, lockExpiresAt: Date (TTL Index), status: 'held'|'booked' }`
    - **Socket Events:** `SeatLocked` (broadcasts `seatId`, `userId`), `SeatReleased`, `SeatBooked`.
  - **4. LiquidGlassTicketVault Contracts:**
    - **Offline Local Schema Cache Contract:** Local Cache Store maps explicitly to `DATA.md` specifications, storing encrypted payload structures in IndexedDB: `{ ticketId: String, encryptedPayload: String, validUntil: Date, offlineProof: String }`. Guarantees dynamic scanning parameters even in zero-network environments.
    - **Mathematical Rotation Token Rules:** Generates a shifting TOTP/QR hash locally every 15 seconds. The hash is computed using `HMAC-SHA256(ticketId + Math.floor(Date.now() / 15000))` utilizing a decoupled encrypted client JWT, ensuring cryptographically secure offline verification.
  - **5. InSiteMovieCriticAgent Contracts:**
    - **Operational Boundaries (Drawer Scope):** The interactive chat drawer queries localized contextual data without re-fetching from the database. It handles upstream stream-failures gracefully with a local fallback mechanism.
    - **Secure Backend Proxy Endpoint:** A dedicated Express routing gateway hosted on Port 5000 (`POST /api/critic/proxy/chat`) masks all upstream LLM/OpenAI API tokens. Client payload: `{ message: String, localContext: { movieId: String, currentMood: String } }`.
    - **Memory Context Isolation:** Managed strictly via a localized Zustand slice (`useCriticStore`), preventing token leakage and ensuring chat history is wiped when the drawer unmounts or the session ends.
    - **Synchronized Boundary Tracking:** Intercepts `SpeechSynthesisUtterance.onboundary` events, mapping the active character index to local state without triggering global component re-renders or layout reflows.
    - **Contextual Speaker Node Controls:** Replaces the global state approach with an explicit, contextual Speaker Icon Button (לחצן רמקול) attached to each message/text card to capture user intent and bypass browser autoplay restrictions cleanly. The message bubble container passes its unique string payload into the `useMovieCriticSpeech` sentence buffering loop via an explicit click gesture.
    - **Strict Speech Thread Cleanup:** Executes `window.speechSynthesis.cancel()` on component unmount to instantly terminate background audio and rendering threads, preventing memory leaks.
  - **6. Predictive Soul-Seat Matrix & Dynamic Pricing Engine Contracts:**
    - **User Preference Vector Schema:** Database addendum representing `{ userId: string, preferredRows: number[], preferredSections: 'center'|'left'|'right', genreAffinity: Record<string, number> }`.
    - **Live Concurrency Stream Contract:** Prediction calculation engine mapping directly over the existing `SeatMap.tsx` coordinate structure and active MongoDB live locks state.
    - **Ultraviolet Design Tokens (Liquid Glass 4.0):** Soul Pulse Overlay for predicted seats (`animate-pulse shadow-[0_0_15px_rgba(139,92,246,0.5)] border-violet-500/80`), and Flash Offer Panel (`backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-2xl`). Animations managed strictly via physics spring models (`stiffness: 300, damping: 20`).
    - **State Coupling Constraints:** Predictions must layer on top of current bounds with absolute zero Layout Reflows. Countdown interval timer guards must cleanly execute explicit `clear/destroy` routines inside `useEffect` unmounts to maintain 120Hz system frame rates.
  - **7. Immersive API Bundle Contracts (Sprint 8 Matrix):**
    - **YouTube & TMDB Stream Bindings:** Leverage YouTube Data API v3 and TMDB Video REST endpoints. Player instances must execute absolute tracking with clean DOM destruction on component `unmount` to prevent iframe memory leaks.
    - **Stripe Webhook Validation State:** Stripe Checkout Sessions & Live Webhooks API. Demands a Redis/MongoDB transactional state backed by a strict 10-minute TTL session expiration. Atomic release of cluster locks is required upon webhook timeout/failure.
    - **Dynamic Pricing Calculation Matrix:** Evaluates coordinate booking frequencies against TMDB Trending Matrix endpoints. Reflected visually via a physical spring-based demand index scale (`backdrop-blur-md border-amber-500/40`).
  - **8. Immersive API Bundle (Social Expansion) Contracts (Sprint 9 Matrix):**
    - **YouTube & TMDB Stream Bindings (Enhancement):** `components/movie/CinemaTrailerStream.tsx` fetches official video streams dynamically. Implements absolute tracking with clean DOM destruction on component `unmount` to bypass memory leaks.
    - **WebSocket Presence Synchronization Logic (Cinema Social Pulse):** New dependencies `socket.io` & `socket.io-client`. New route `pages/api/socket/io.ts` handles the Socket.io server upgrade. `hooks/usePresence.ts` maintains ephemeral in-memory map state. `SeatMap.tsx` implements `layoutId` transitions for Liquid Glass Presence Blobs to avoid DOM thrashing.
    - **Dynamic Pricing Calculation Matrix Parameters:** `app/api/pricing/tmdb-demand/route.ts` evaluates coordinate booking frequencies against regional TMDB popularity. `PredictiveDemandScale.tsx` uses framer-motion physical springs (`backdrop-blur-md border-amber-500/40`) with GPU-accelerated zero-reflow constraints.
- **Unified Result Pattern:** All operational handlers and Server Actions encapsulate outputs within: `{ success: boolean; data?: any; error?: string }`.

## 🚀 Special Experiential Features Ledger

### Phase 1: AI Movie Swipe Matcher
- [x] Zod Schema Definition & Validation Boundaries
- [x] MongoDB Models and Indexing
- [x] API Signatures for Session Management (Server Actions)
- [x] Swiping Logic & Aggregation Matcher
- [x] WebSockets Sync Boundaries
- [x] Atomic Verification Routine (Layer 5)

### Phase 2: Frontend UI Views & Client Sync Hook
- [x] Client WebSocket Connection Orchestration
- [x] Liquid Glass 3.0 Swipe Deck Interface
- [x] Integrated Session Screen Container
- [x] Router Navigation Trigger

### Phase 3: Spatial Sweet-Spot Map Enhancements
- [x] Acoustic Sweet-Spot Visuals
- [x] Sweet-Spot Hover Preview Overlay

### Phase 4: Live Ticket & Snack Ledger Architecture
- [x] Backend Live Order Sync & Change Streams
- [x] Live Progress Tracker UI Component

### Phase 5: Offline Ticket Crypto-Wallet Architecture
- [x] Implement crypto ticket hashing & offline guard
- [x] Create OfflineTicketWallet UI
- [x] Liquid Glass 3.0 styling

### Phase 6: Immersive API Bundle (Social Expansion) - Sprint 9
- [x] WebSocket presence handling
- [x] Liquid Glass Presence Blobs on Seat Map
- [x] Predictive TMDB demand scale

### Phase 7: Specular Seating Roulette Fusion - Sprint 11
- [x] Create validations and Server Action for lockRouletteSeatAction
- [x] Build SeatingRoulette component with requestAnimationFrame animation loop
- [x] Wire useRouletteStore Zustand and Web Audio click and sub-bass effects

### Phase 8: Netflix-Style Eco Screen Saver - Sprint 12
- [x] Add isScreenSaverActive and activity tracker hooks to Zustand
- [x] Build EcoScreenSaver component with pure CSS Ken Burns animations
- [x] Wrap main layout with content-visibility: hidden toggle

### Phase 9: AI One-Tap Booking & Payment - Sprint 13
- [x] Create processSecureBooking Server Action with atomic MongoDB rollbacks
- [x] Implement BookingConfirmationWidget in Liquid Glass 4.0 layout
- [x] Integrate inline checkout widget inside AI Concierge drawer

### Phase 10: VIP Bonuses & Pulse Gamification - Sprint 14
- [x] Create Mongoose schema and Server Actions for loyalty points and rewards
- [x] Build BonusesDashboard with sub-pixel borders and elite styling
- [x] Wire spatial click synthesis and Framer Motion particle explosions

### Phase 11: Dynamic Specular Subtitles Engine - Sprint 15
- [x] Build hooks/useAudioAnalyser to capture decibel updates from video elements
- [x] Implement SpecularSubtitles and SubtitleText components
- [x] Mount subtitles engine inside Upcoming movie trailer modals

### Phase 12: Phantom Presence & Cine-Ghosting - Sprint 16
- [x] Setup Socket.io signaling server and PeerSignalPayloadSchema Zod schema
- [x] Build hooks/usePhantomPresence for WebRTC DataChannel connection
- [x] Implement PhantomCursors overlay on SeatMap grid canvas

### Phase 13: Generative Holographic Scratch-Card - Sprint 19
- [x] Create validations and Server Action for Generative Scratch Card (`lib/validations/scratchCard.ts`, `app/actions/scratchActions.ts`)
- [x] Overhaul scratch card components (`components/scratch/ScratchCardContainer.tsx`, `components/scratch/GoldScratchCard.tsx`, `components/scratch/RewardReveal.tsx`)

### Phase 14: 3D Cinematic Parallax Hero - Sprint 22
- [x] Overhaul `FeaturedHero.tsx` component to support multi-layer 3D Cinematic Parallax

### Phase 15: Co-Viewing Synchronization Nexus - Sprint 23
- [x] Create Zod Schema and simulated API route (`app/api/coviewing/route.ts`)
- [x] Integrate `HologramSeatOverlay.tsx` with Liquid Glass 4.0 aesthetics and Framer Motion
- [x] Implement Web Audio `useKineticAcoustics.ts` for 40Hz sub-bass ticket fusion
- [x] Wire Zustand `coviewingStore.ts` to `SeatMap.tsx` and context menus

### Phase 16: Dynamic Crypto Ticket Pricing - Sprint 25
- [x] Create Next.js API route (`app/api/pricing/crypto/route.ts`) with Zod schema validation
- [x] Build React Hook (`hooks/useCryptoPricing.ts`) for 15-second polling
- [x] Develop Framer Motion `CryptoTicketPricer.tsx` with zero-reflow number ticker
- [x] Integrate Crypto Pricer into `SeatMap.tsx` top bar

### Phase 16.1: Crypto Pricing Upgrades (Web3 Simulation) - Sprint 25.1
- [x] Upgrade `hooks/useCryptoPricing.ts` to maintain state history arrays
- [x] Add SVG background Sparkline charting and glowing Trend Indicators (↗/↘)
- [x] Implement 60-second "Lock Rate" functionality to block API polling
- [x] Add "Pay with Wallet" simulation (Phantom/MetaMask flow) with Success animations

### Phase 17: Crypto Checkout & Cashback Rewards - Sprint 26
- [x] Integrate `CryptoTicketPricer` into `BookingSummarySidebar` as the primary checkout module
- [x] Create global `walletStore.ts` via Zustand to track user crypto balances
- [x] Implement 5% automatic Bitcoin Cashback upon successful Web3 payment simulation
- [x] Add dynamic "Wallet Balance" display above the checkout widget
