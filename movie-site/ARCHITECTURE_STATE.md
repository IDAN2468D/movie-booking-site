# 🧠 Agent Stack State & Architecture Blueprint (v8.0)

This file acts as the primary Layer 1 & 2 Persistence state for the Agent Stack Framework.
**Agents must read this file to understand the current technical boundaries and project scope.**

## 🎭 Master Scope: Advanced Experiential Features
The platform operates on a Next.js (App Router) architecture with a strict Zero-Reflow (120Hz GPU) presentation layer designated as **Liquid Glass 4.0**.

### 📐 Layer 3: Technical Spec & Contracts
- **State Architecture:** Manage UI transitions via hardware-accelerated CSS (`will-change: transform, opacity`). Use Zustand for localized state slicing to prevent global re-renders. Component limit is strictly 200 LOC.
- **Server Actions & Database:** All endpoints utilize Zod validation boundaries (`lib/validations/`) and return a unified contract: `{ success: boolean; data?: any; error?: string }`.

### 🚀 Historical Feature Ledger (Phases 1-19)

**Phase 1-2: AI Movie Swipe Matcher**
- Zod boundaries, MongoDB aggregation Matcher, and WebSockets Sync.
- Liquid Glass Swipe Deck Interface via `framer-motion`.

**Phase 3-4: Spatial Acoustics & Live Ledger**
- Acoustic Sweet-Spot Visuals.
- Live Ticket & Snack Ledger via Change Streams.

**Phase 5: Offline Ticket Crypto-Wallet**
- Cryptographic verification via JWT/HMAC-SHA256 hash.
- Liquid Glass Ticket Vault with dynamic QR rotation.

**Phase 6-7: Immersive APIs & Seating Roulette**
- TMDB/YouTube streams projected via floating Liquid Glass nodes.
- Seating Roulette via `requestAnimationFrame` shuffle loops and Web Audio API clicks.

**Phase 8-10: Gamification & Concierge AI**
- Eco Screen Saver (content-visibility optimization).
- Conversational AI Booking & Payment (In-drawer checkout).
- VIP Gamification & Pulse Points (Particle shard explosions).

**Phase 11-12: Subtitles & Phantom Cursors**
- Dynamic Specular Subtitles (Web Audio `AnalyserNode` frequency mapping).
- Cine-Ghosting (Socket.io/WebRTC presence blobs).

**Phase 13-14: Holographic Cards & Parallax**
- Generative Holographic Scratch-Card with Zod schema limits.
- 3D Cinematic Parallax Hero (`FeaturedHero.tsx`) tracking cursor vectors.

**Phase 15: Co-Viewing & Kinetic Acoustics**
- Synchronized hologram seat overlays.
- 40Hz sub-bass ticket fusion effects.

**Phase 16-17: Crypto Pricing & Web3 Simulation**
- Dynamic pricing evaluating TMDB demand vs ticket availability.
- 15-second polling limits, Sparkline charting, and Bitcoin 5% cashback Web3 flow.

**Phase 18: Biometric Emotion Vortex**
- 3D Physics engine dropping "Emotion Orbs" into a gravity well (`framer-motion` layout constraints).
- Real-time MongoDB persistence and gamified gameloops.

**Phase 19: The Vanguard Suite (Sprints 29-34)**
1. **Aura Profiles (Sprint 29)**: AI-generated `CinematicAura` text synthesis profiling based on history.
2. **Acoustic Checkout Resonance (Sprint 30)**: Liquid Glass shatter animations with synthesized Web Audio drops (`playShatterEffect`).
3. **Biometric Splash (Sprint 31)**: Initial splash screen via `framer-motion` and `onMouseMove` viewport tracking for Next.js initialization.
4. **Smart Tray AI (Sprint 32)**: Context-aware food recommendations mapped by Gemini AI (`SmartTray.tsx`).
5. **Social Pulse Lobby (Sprint 33)**: Live Server-Sent Events (`/api/pulse/stream`) broadcasting ticket pings as Liquid Ripples globally.
6. **"Liquid Time" Offline Sync (Sprint 34)**: Service Worker (`sw.js`) implementation for media precaching bound to `OfflineSyncCylinder.tsx` visualizer.
