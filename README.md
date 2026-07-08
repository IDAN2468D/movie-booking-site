# 🎬 Movie Booking Site - Premium Experience

A futuristic, high-performance movie discovery and booking platform built with Next.js 15, MongoDB, and Liquid Glass aesthetics.

## 🚀 Quick Start
```bash
npm install
npm run dev
```

## 🤖 AI Governance & Documentation
To maintain project quality and consistency, all AI agents follow the standards defined in the `.agents/rules` directory:

- **Master Rules**: [.agents/rules/movie-booking-site.md](./.agents/rules/movie-booking-site.md)
- **Project Specification**: [.agents/rules/project_spec.md](./.agents/rules/project_spec.md)
- **Active Plans**: Check `.agents/rules/active_plan.md` for current tasks.

## 🎭 Master Scope: Advanced Experiential Features

### 🎯 Layers 1 & 2: PRD (Product Requirements Document)
- **Concept:** Elevating the discovery and booking experience to a premium, immersive, and highly collaborative environment driven by The Agent Stack.
- **Core Capabilities:**
  1. **MovieSwipeMatcher:** A real-time "Tinder-style" movie matchmaking system. Involves zero-lag swiping via hardware-accelerated translation matrices, local memory state aggregation (debounced), and an immediate trigger match engine without re-querying the database index.
  2. **DynamicAmbientCinemaMode:** Ambient responsiveness extracting color palettes from active movie assets and reflecting them globally. Enforces zero layout reflows by asynchronously morphing theme backdrops via CSS variables.
  3. **QuantumSeatMapLiveSync:** Real-time interactive Cinema Hall Seat Map Matrix. Features a pessimistic hold strategy (10 min locks), a real-time event bridge for global client syncing, and strict collision avoidance with silent client roll-backs.
  4. **LiquidGlassTicketVault:** Offline-ready digital ticket verification. Guarantees cryptographic verification with dynamic QR tokenization rotating every 15s via a time-based hashing algorithm linked to secure JWT payloads.
  5. **InSiteMovieCriticAgent:** Embedded interactive AI Movie Critic Bot inside the movie description canvas, utilizing an encrypted back-channel gateway route (Port 5000) to shield API keys, and keeping chat history in localized temporary states.

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
    - **Operational Boundaries (Drawer Scope):** The interactive chat drawer queries localized contextual data (movie metadata, user preferences) without re-fetching from the database. It handles upstream stream-failures gracefully with a local fallback mechanism.
    - **Secure Backend Proxy Endpoint:** A dedicated Express routing gateway hosted on Port 5000 (`POST /api/critic/proxy/chat`) masks all upstream LLM/OpenAI API tokens. Client payload: `{ message: String, localContext: { movieId: String, currentMood: String } }`.
    - **Memory Context Isolation:** The internal temporary message array state is managed strictly via a localized Zustand slice (`useCriticStore`). This enforces memory context isolation, preventing token leakage and ensuring chat history is wiped when the drawer unmounts or the session ends.
- **Unified Result Pattern:** All operational handlers and Server Actions encapsulate outputs within: `{ success: boolean; data?: any; error?: string }`.

---
*Built with ❤️ for the ultimate cinematic experience.*

### 🚀 Special Experiential Features Ledger (Completed July 2026)

# Latest Save-Point: Phase 1 Plan

## Phase 1: AI Movie Swipe Matcher (Backend & Data Contracts)

### Step 1: Zod Schema Definition & Validation Boundaries
- [x] Create `src/lib/validations/swipeSession.ts`
- [x] Define Zod schema for `swipe_sessions` matching the database contract.
- [x] Ensure strict type safety and parameter boundary validation for incoming API requests.

### Step 2: MongoDB Models and Indexing
- [x] Create `src/lib/models/SwipeSession.ts` (Mongoose Model / MongoDB collection schema).
- [x] Implement optimized indexes on `sessionId` (unique) and `sessionStatus`.
- [x] Ensure DB credentials remain exclusively in server-side `.env`.

### Step 3: API Signatures for Session Management (Server Actions)
- [x] Create unified Server Action: `createSwipeSession(hostUserId, catalogFilters)`
  - Output constraint: `{ success: boolean; data?: any; error?: string }`
- [x] Create unified Server Action: `joinSwipeSession(sessionId, participantUserId)`
  - Validation: Verify session exists and is `active`.

### Step 4: Swiping Logic & Aggregation Matcher
- [x] Create Server Action: `recordSwipe(sessionId, userId, movieId, direction)`
  - Record the swipe atomically in the `swipes` array.
- [x] Design MongoDB Aggregation Pipeline: `checkSessionMatch(sessionId)`
  - Boundary: `$match` on specific `sessionId` and `sessionStatus: 'active'`.
  - Condition: Identify if a `movieId` exists where all `participants` have a corresponding `direction: 'like'` swipe.

### Step 5: WebSockets Sync Boundaries
- [x] Set up the WebSocket infrastructure (or Pusher fallback) at `src/pages/api/socket/swipe.ts` (if applicable) or configure an external real-time sync mechanism.
- [x] Define broadcast events for:
  - `ParticipantJoined`
  - `SwipeRecorded`
  - `MatchFound` (contains `matchedMovieId`)
- [x] Ensure WS messages adhere to the validation boundaries.

### Step 6: Atomic Verification Routine (Layer 5)
- [x] Write integration test routines for the backend endpoints to simulate a host, multiple participants, and a successful intersection match.
- [x] Execute Self-Healing execution loop (`npx tsc --noEmit` / `npx vitest run`) to verify all data boundary invariants.

## Phase 2: Frontend UI Views & Client Sync Hook

### Step 1: Client WebSocket Connection Orchestration
- [x] Create `src/hooks/useSwipeSession.ts`.
- [x] Handle WebSocket room joining, and event listening.
- [x] Manage local state and trigger victory overlay upon `match_found`.

### Step 2: Liquid Glass 3.0 Swipe Deck Interface
- [x] Create `src/components/MovieSwipeDeck.tsx`.
- [x] Utilize framer-motion for smooth gesture tracking.
- [x] Apply Liquid Glass 3.0 visual specs.
- [x] Implement Dynamic Theme Injector without layout reflows.

### Step 3: Integrated Session Screen Container
- [x] Create `src/components/MovieSwipeSessionContainer.tsx` as parent orchestrator.
- [x] Wire `useSwipeSession` hook.
- [x] Render `MovieSwipeDeck` and map callbacks to `recordSwipe`.
- [x] Implement Glassmorphic Victory Overlay modal displaying matched movie.

### Step 4: Router Navigation Trigger
- [x] Add high-fidelity glass CTA button to the Victory Overlay.
- [x] Implement Next.js `useRouter` redirect to seat allocation map.

## Phase 3: Spatial Sweet-Spot Map Enhancements

### Step 1: Acoustic Sweet-Spot Visuals
- [x] Identify Rows F-H, Columns 6-12 inside `SeatMap.tsx`.
- [x] Render subtle, pulsing hardware-accelerated radial background: `radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)` behind the seat.

### Step 2: Sweet-Spot Hover Preview Overlay
- [x] Detect hover state on acoustically optimal seats.
- [x] Render highly polished Liquid Glass 3.0 floating capsule with text "✨ Prime Audio Sweet-Spot" and "Acoustic Fidelity: 98%".

## Phase 4: Live Ticket & Snack Ledger Architecture

### Step 1: Backend Live Order Sync & Change Streams
- [x] Create order state contract array in `orderActions.ts`.
- [x] Implement backend action `updateOrderState` that transmits real-time `order_state_changed` signals via WebSocket pipeline.

### Step 2: Live Progress Tracker UI Component
- [x] Create `src/components/LiveTicketLedger.tsx` client component subscribing to WebSocket room.
- [x] Render high-fidelity vertical progress timeline inside Liquid Glass 3.0 container.
- [x] Animate active step with glowing pulsing layout effects using Framer Motion.

## Phase 5: Offline Ticket Crypto-Wallet Architecture
- [x] **Step 1:** Implement `generateTicketHash` in `src/lib/cryptoWallet.ts` using Universal Web Crypto API.
- [x] **Step 1:** Implement offline detection guard `isNetworkOnline()`.
- [x] **Step 2:** Create `src/components/OfflineTicketWallet.tsx` displaying the digital secure ticket voucher.
- [x] **Step 2:** Incorporate Liquid Glass 3.0 styling and Off-Grid Network Guard banner.
- [x] **Complete:** 100% Type Safety and Compilation Validation across the final layout structure.
