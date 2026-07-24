# 🧠 Agent Stack State & Architecture Blueprint (v9.0 SDD)

This file acts as the primary Layer 1 & 2 Persistence state for the Agent Stack Framework.
**Agents must read this file alongside `.agents/templates/` to understand the current technical boundaries, PRD contracts, and project scope.**

## 🎭 Master Scope: Advanced Experiential Features
The platform operates on a Next.js (App Router) architecture with a strict Zero-Reflow (120Hz GPU) presentation layer designated as **Liquid Glass 4.0**.

### 📐 Layer 2 & 3: Neural SDD Blueprint & Contracts
- **Machine-Readable Templates:** All development strictly bound by `.agents/templates/PRD_TEMPLATE.md`, `SPEC_TEMPLATE.md`, and `PLAN_TEMPLATE.md`.
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

**Phase 26: The Hyper-Sensory Ecosystem (Sprints 56-61)**
1. **Neural Soundtrack Synthesizer (Sprint 56)**: Real-time procedural ambient soundtrack generator tuned via `@google/genai` harmonic parameters (`NeuralSoundtrackSynth.tsx`).
2. **360° Spatial AR Cinema Portal (Sprint 57)**: Interactive 3D Canvas perspective of screen curvature & acoustics from chosen seat with Gyro sensor fusion (`SpatialCinemaPortal360.tsx`).
3. **Cinematic Co-op VS Deck Matcher (Sprint 58)**: Dual-player simultaneous movie swipe deck with real-time match evaluation and harmonic acoustic celebration (`CoopVsSwipeDeck.tsx`).
4. **Hands-Free Voice AI Command Shell (Sprint 60)**: Hebrew Web Speech API speech recognition assistant with TTS feedback & hands-free navigation (`VoiceAiCommandShell.tsx`).
5. **Generative WebGL Trophy Vault (Sprint 61)**: Interactive 3D holographic crystal WebGL trophy vault displaying user achievement awards (`GenerativeTrophyVault.tsx`).

**Phase 28: The Hyper-Sensory Cinema Ecosystem (Sprints 64-68)**
1. **Real-Time Cinema Crowd Heatmap & Vibe Radar (Sprint 64)**: Interactive seat occupancy heatmap & acoustic spatial sound triggers (`CrowdHeatmapContainer.tsx`).
2. **AI Cinema Time-Traveler Trailer Remixer (Sprint 65)**: `@google/genai` era-remixed trailer scripts & CRT canvas shader filters (`TrailerRemixerContainer.tsx`).
3. **Quantum Loyalty Staking & NFT Pass Vault (Sprint 66)**: 3D Holographic ticket pass with Touch-Hold biometrics & 40Hz sub-bass audio (`QuantumStakingContainer.tsx`).
4. **AI Neural Cine-Persona Avatar & Voice Clone (Sprint 67)**: 3D glowing particle AI concierge avatar with speech synthesis (`CinePersonaAvatarContainer.tsx`).
5. **Hands-Free Voice AI Smart Search & Spatial Order (Sprint 68)**: Hebrew Web Speech API vocal command shell with spatial audio confirmation (`VoiceOrderEngineContainer.tsx`).

**Phase 29: Next-Gen Neural Spatial & Prediction Cinema Suite (Sprints 69-73)**
1. **Neural Biometric Seat & Acoustic Sweet-Spot Calibrator (Sprint 69)**: Interactive frequency equalizer and seat acoustic sweet-spot score (`BiometricSeatContainer.tsx`).
2. **Dynamic AI Screenplay & Branching Ending Simulator (Sprint 70)**: Interactive prompt choice node tree with plot divergence options (`ScreenplayBranchContainer.tsx`).
3. **Quantum Cine-Token Staking & Box Office Prediction Market (Sprint 71)**: Gamified prediction market dashboard with 40Hz sub-bass audio drop (`BoxOfficePredictionContainer.tsx`).
4. **AI Spatial Director's Cut Audio Commentary Visualizer (Sprint 72)**: Spatial panning commentary audio visualizer (`SpatialCommentaryContainer.tsx`).
5. **Voice-to-Hologram Cine-Pass Generator & Haptic Audio Vault (Sprint 73)**: Hebrew Web Speech API vocal command holographic VIP pass generator (`HoloVoicePassContainer.tsx`).

**Phase 30: The Transcendent Hyper-Sensory Cinema Suite (Sprints 74-78)**
1. **The Synesthetic Mood-Mapping Engine (Sprint 74)**: Dynamic Liquid Glass refraction blur & Web Audio harmonic drone synth based on emotional valence/arousal (`MoodRefractorContainer.tsx`).
2. **Chronos-Fluid Temporal Booking Slider (Sprint 75)**: Non-linear 3D refractive showtime bubbles mapped via Framer Motion `useTransform` Z-axis depth (`TemporalBookingContainer.tsx`).
3. **Biometric Resonance Seat-Matching / Aura Map (Sprint 76)**: Dynamic seat heatmap glow with Web Audio spatial resonance chords per seat (`AuraSeatMapContainer.tsx`).
4. **Neural-Linguistic Semantic Search / Intuition Bar (Sprint 77)**: Natural language metaphor & sentiment search with liquid mercury ink-bleed visuals (`IntuitionSearchContainer.tsx`).
5. **The Ether-Void Collective Lobby (Sprint 78)**: Pre-show 3D WebGL HTML5 canvas lobby rendering floating glass spheres with Web Audio `PannerNode` 3D spatial pings (`EtherVoidContainer.tsx`).






