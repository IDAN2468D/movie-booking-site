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

### 🎯 Layer 1: PRD (Product Requirements Document)
- **Concept:** Elevating the discovery and booking experience to a premium, immersive, and highly collaborative environment.
- **Core Capabilities:**
  1. **AI Movie Swipe Matcher (Group Session):** Multiple interconnected users in a shared session swipe on a discovery catalog of movies. Intersections atomically trigger a unified matchmaking redirection.
  2. **Cinematic Theme Injector (Ambient Glass):** Real-time dynamic theme updates driven by movie genre/metadata across the view tree without layout reflows.
  3. **Spatial Preview:** Acoustic integration using spatialized Web Audio API (PannerNode, BiquadFilterNode) for layout elements.
  4. **Live Snack Ledger:** Real-time tracking and adding of snacks during the booking flow.
  5. **Offline Wallet:** Persistent offline-ready caching of The Kinetic Ticket and booking data.

### 📐 Layer 2: Technical Spec (Blueprint)
- **State Architecture:** Manage UI transitions via hardware-accelerated CSS (`will-change: background-color, backdrop-filter`) mapped to Liquid Glass 3.0 specs. Use Zustand for state.
- **Database Contracts (MongoDB Schema - `swipe_sessions`):**
  ```json
  {
    "_id": "ObjectId",
    "sessionId": "String (Unique, 6-digit alphanumeric)",
    "hostUserId": "ObjectId",
    "participants": ["ObjectId"],
    "sessionStatus": "String ('active' | 'matched' | 'expired')",
    "catalogFilters": { "genres": ["String"], "date": "Date" },
    "swipes": [
      {
        "userId": "ObjectId",
        "movieId": "ObjectId",
        "direction": "String ('like' | 'dislike')",
        "timestamp": "Date"
      }
    ],
    "matchedMovieId": "ObjectId (Nullable)"
  }
  ```
- **API Signatures & Boundary Conditions:**
  - **REST / Server Actions:** `POST /api/swipe/match` taking boundary-validated inputs via Zod. Outputs conform to `{ success: boolean; data?: any; error?: string }`.
  - **WebSockets Boundaries:** Real-time sync of swipe events. Websocket events must carry the `sessionId` and securely authenticate users. Events must be strictly typed.
  - **MongoDB Aggregation Pipelines Boundaries:** Match resolution queries must leverage indexed matching on `swipes` arrays. Bounded by an `$match` on active sessions and `catalogFilters` to prevent full collection scans.

### 🗺️ Layer 3: Development Plan
- [x] Step 1: Establish the secure backend route `POST /api/movies/match` and hook it to the showtime query selector.
- [x] Step 2: Implement the swipe interaction card state deck using Tailwind CSS styling and clean gesture handling.
- [x] Step 3: Build the "Match Found" overlay modal container with its dynamic link routing directly to the Cin Book seating map.
- [x] Step 4: Execute a robust Self-Healing Execution Loop running validation tests on mock swiping sessions.

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
