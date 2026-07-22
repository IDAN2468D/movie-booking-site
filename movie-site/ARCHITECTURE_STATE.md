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

**Phase 20: Cognitive Ecosystem & Optimization (Sprints 35-37)**
1. **Time-Shift Concierge (Sprint 35)**: Proactive traffic and scheduling adjustments using Mock/Google Maps fallback in a Liquid Glass persistent floating agent.
2. **Cine-Swarm Interactive Nodes (Sprint 36)**: Added peer-to-peer Vibe Checks and acoustic feedback to Social Pulse rings.
3. **Quantum Worker Offloading (Sprint 37)**: Shifted all search and movie filtering logic to an asynchronous Web Worker to strictly enforce 120Hz Zero-Reflow.

**Phase 21: The Hyper-Sensory Integration**
1. **Neural Emotion Matrix (Sprint 38)**: Replaced standard dropdown search with a Gemini AI semantic mapping engine that generates a floating, physics-driven (Framer Motion) Liquid Glass orb overlay based on user mood prompts.

**Phase 25: Native Zero-MCP Hyper-Sensory Suite (Sprints 51-55)**
1. **Spatial IMAX 3D Seat Walkthrough (Sprint 51)**: Interactive 3D Canvas view of seat FOV curvature & `PannerNode` spatial acoustics (`SpatialSeatPreview.tsx`).
2. **AI Director's Companion & Audio Isolator (Sprint 52)**: `@google/genai` timestamped trivia overlays + Web Audio `BiquadFilterNode` frequency boosters (`DirectorsAudioCompanion.tsx`).
3. **Biometric Dynamic Holographic Passbook (Sprint 53)**: Holographic pass with touch-hold biometric authentication, sub-bass heartbeat audio, and GPU particle canvas shaders (`BiometricHoloPass.tsx`).
4. **Native Multi-Currency Lock & Split-Pay (Sprint 54)**: 10-minute exchange rate lock & multi-currency split checkout (`CurrencySplitWidget.tsx`).
5. **VIP Cine-Pulse Analytics Dashboard (Sprint 55)**: VIP metrics dashboard with genre affinity heatmaps (`VipAnalyticsDashboard.tsx`).

