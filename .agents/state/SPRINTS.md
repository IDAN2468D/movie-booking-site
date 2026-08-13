# 🤖 Architectural Blueprints: Active Phase & Future Roadmap (v9.0 SDD)
*Single Source of Truth for active development sprints. Historical sprints (11–78) are archived in [ARCHIVE_SPRINTS.md](./ARCHIVE_SPRINTS.md).*

---

## ⚡ Phase 31: The Sensory Priming & Resonance Layer (Active Phase)

### 🌀 Sprint 79: CineResonanceContainer (מנוע תהודה קולנועית וכיול אקוסטי)
- **Concept:** Hebrew localized pre-movie acoustic resonance calibration and 3D wave visualizer.
- **Tech Stack:** Web Audio API (`AnalyserNode`, `BiquadFilterNode`, 40Hz sub-bass), Framer Motion 120Hz, Zod, Next.js Server Actions, `CineResonanceContainer.tsx`.
- **Status:** ✅ Completed

### 🌐 Sprint 80: NeuralSyncNexusContainer (מרכז הסנכרון הקבוצתי)
- **Concept:** Hebrew localized group aura sphere merging, 3D stereo audio panning, and harmonic chord celebration.
- **Tech Stack:** Web Audio API (`PannerNode`), Framer Motion 120Hz GPU, Zod, Next.js Server Actions, `NeuralSyncNexusContainer.tsx`.
- **Status:** ✅ Completed

### ⚡ Sprint 81: TactileResonanceContainer (מרכז התהודה והמגע ההפטי הקולנועי)
- **Concept:** Hebrew localized Tactile Audio-Haptic Resonance Center with 35Hz-60Hz sub-bass sound, `navigator.vibrate` physical haptics, Zod validated server action calibration, and Advanced Features dropdown navigation button.
- **Tech Stack:** Web Audio API (`OscillatorNode`, `GainNode`), Haptic API (`navigator.vibrate`), Framer Motion 120Hz GPU, Zod, Next.js Server Actions, `TactileResonanceContainer.tsx`.
- **Status:** ✅ Completed

### 🧬 Sprint 82: BiometricAuraChamberContainer (תא האורה והביומטריה הקולנועית)
- **Concept:** Hebrew localized Biometric Aura & Mood Chamber with touch-hold fingerprint scanner, Web Audio sub-bass heartbeat audio pulse, Zod validated server action aura analysis, and Advanced Features dropdown button integration.
- **Tech Stack:** Web Audio API (`AudioContext`), PointerEvents, Framer Motion 120Hz GPU, Zod, Next.js Server Actions, `BiometricAuraChamberContainer.tsx`.
- **Status:** ✅ Completed

### 🎵 Sprint 83: QuantumPersonaSoundtrackSynthContainer (סנתזטור פסקול הנוירונים הקוונטי)
- **Concept:** Hebrew localized Quantum Persona Soundtrack Synthesizer with Web Audio polyphonic synthesizers, 120Hz GPU waveform visualizer, Zod validated server action soundtrack preset generation, and Advanced Features dropdown button integration.
- **Tech Stack:** Web Audio API (`OscillatorNode`, `GainNode`, `BiquadFilterNode`), Framer Motion 120Hz GPU, Zod, Next.js Server Actions, `QuantumPersonaSoundtrackSynthContainer.tsx`.
- **Status:** ✅ Completed

### ⚡ Sprint 85: Electric Border Effect & Smart Recommendation UI Cards (אפקט גבול חשמלי מואר לכרטיסיות המלצה)
- **Concept:** Hebrew localized Electric Neon Border Effect with HDR vector SVG `log_white.svg`, 1000% scale at (56%, 41.7%), `background-origin: content-box` with padding, higher z-index dark content layering, and Framer Motion scale transitions.
- **Tech Stack:** Tailwind CSS, Framer Motion 120Hz GPU, SVG Filter & Radial Core, `ElectricSmartPickCard.tsx`, `SmartPicksView.tsx`, `AIRecommendations.tsx`, `globals.css`.
- **Status:** ✅ Completed

### 💫 Sprint 86: Global Loading Indicator Standardization (סטנדרטיזציית אנימציות טעינה קולנועיות)
- **Concept:** Repository-wide unification of loading indicators with 4 GPU-accelerated variants (`orbit`, `spinner`, `pulse`, `dots`) replacing all ad-hoc spinners and icons across 40+ components, ensuring zero layout shift and full accessibility.
- **Tech Stack:** Tailwind CSS GPU transforms (`[transform:translateZ(0)]`, `will-change-transform`), CSS custom properties, ARIA roles, `LoadingIndicator.tsx`.
- **Status:** ✅ Completed

### 🌟 Sprint 87: Universal Neon Animated Card Skill Integration (אפקטי ניאון דינמיים מוארים לכל הכרטיסים)
- **Concept:** Implementation of `.agents/skills/neon-animated-card.md` skill across all tickets (Quantum, Holographic 3D, and Neon Pass), featuring rotating neon gradient borders (`conic-gradient`), 2px `overflow-hidden` edge clipping, ambient drop-shadow aura (`shadow-[0_0_35px...]`), flip-out QR pass, and dark glass layer.
- **Tech Stack:** Tailwind CSS, Framer Motion 120Hz GPU, Next.js App Router, `QuantumTicket.tsx`, `HolographicTicket.tsx`, `NeonTicket.tsx`, `TicketsTabSwitcher.tsx`, `app/(main)/tickets/page.tsx`.
- **Status:** ✅ Completed

### 📁 Sprint 88: Standardized Skills Directory Architecture (ארגון וסדר מלא בתיקיות הסקילים)
- **Concept:** Full re-organization of all project skills into standard directory formats `.agents/skills/<skill-name>/SKILL.md`, migration of loose markdown files, and cleanup of legacy empty folders.
- **Tech Stack:** Antigravity Customization Protocol, Markdown frontmatter, `SKILL.md`.
- **Status:** ✅ Completed

### 🎟️ Sprint 89: 120Hz GPU Thermal Receipt Printer Skill Integration (אופטימיזציית מדפסת קבלות 120Hz GPU)
- **Concept:** Implementation and 120Hz GPU optimization of `.agents/skills/receipt-print-animation/SKILL.md` skill featuring metallic gold printer slot (`from-amber-600 via-yellow-400 to-amber-700`), dynamic height paper rollout (`height: 0 -> auto` smoothly pushing down layout), key-driven instant re-print lifecycle (`printKey`), interactive serrated paper tear effect, scissor tear indicator, haptic vibration, vector barcode, Hebrew RTL layout (`dir="rtl"`), and integration into `SuccessView.tsx`.
- **Tech Stack:** React 19, Next.js 15, Framer Motion 120Hz GPU (`transform-gpu`, `will-change-transform`), Tailwind CSS, Liquid Glass 4.0 Pro, `CineBookReceiptPrinter.tsx`, `SuccessView.tsx`.
- **Status:** ✅ Completed

### 🎞️ Sprint 90: Production-Ready Cinematic Memory Capsule & Shard Vault (קפסולת זיכרון קולנועית פרודוקטיבית)
- **Concept:** Full re-engineering of the "קפסולת זיכרון" (Memory Capsule) feature into a production-grade, connected, interactive cinema journaling and cryptographic shard vault. Connects real MongoDB booking data, supports saving personal reflections (`saveMemoryReflectionAction`), rating stars, companion records, favorite scenes, sensory Web Audio API pulse (35Hz-50Hz sweep), dual view modes (3D Parallax Film Reel 🎞️ / Shard Vault Grid 🗃️), custom memory creation, search, and genre filters.
- **Tech Stack:** React 19, Next.js 15 Server Actions, MongoDB, Web Audio API, Framer Motion 120Hz GPU, Tailwind CSS, Liquid Glass 4.0, Zod, Vitest, `memoryCapsule.ts`, `defaultMemoryCapsules.ts`, `memoryActions.ts`, `useMemoryCapsules.ts`, `acousticMemory.ts`, `MemoryReelHeader.tsx`, `MemoryShardCard.tsx`, `NeuralFlashbackModal.tsx`, `CreateMemoryModal.tsx`, `ChronoRefractiveReel.tsx`.
- **Status:** ✅ Completed

### 🍿 Sprint 91: Panoramic Wide Kinetic Catering Lounge Redesign (עיצוב מחדש רחב לחוויה קולינרית פיזיקלית)
- **Concept:** Extracted and redesigned the "חוויה קולינרית פיזיקלית" (`VisualCateringGrid.tsx`) into a full-width panoramic Liquid Glass 4.0 Pro culinary lounge in checkout. Added category filter pills (הכל, פופקורן ונשנושים, משקאות קרים, קינוחים וממתקים), responsive 6-column snack grid, direct `+`/`-` stepper click controls alongside 120Hz drag-to-tray physics, dual-column AI combo deals (`DynamicComboRoulette` & `SmartTray`), and docked floating cinema tray.
- **Tech Stack:** React 19, Next.js 15, Framer Motion 120Hz GPU, Tailwind CSS, Liquid Glass 4.0 Pro, `VisualCateringGrid.tsx`, `KineticSnackCard.tsx`, `CinemaTrayZone.tsx`, `app/(main)/checkout/page.tsx`.
- **Status:** ✅ Completed

### 🎛️ Sprint 92: Neural Stem-Decomposer & Spatial Mixer Studio (אולפן פירוק פסקול ל-4 ערוצים)
- **Concept:** Advanced Web Audio API 4-stem audio isolation engine (Dialogue, Score, 35-50Hz Sub-Bass, SFX), Liquid Glass 4.0 Pro faders, dynamic presets, mute controls, sub-bass pulse sweeps, and responsive audio visualizer integration.
- **Tech Stack:** Web Audio API (`BiquadFilterNode`, `GainNode`, `OscillatorNode`), React 19, Next.js 15 Server Actions, Zod, `StemDecomposerStudio.tsx`, `StemFader.tsx`, `stemMixerActions.ts`, `SoundtrackPlayerCard.tsx`, `app/(main)/soundtracks/page.tsx`.
- **Status:** ✅ Completed

### 🎬 Sprint 93: Gemini Interactive Screenplay Sandbox (מעבדת תסריטים אלטרנטיביים עם Gemini AI)
- **Concept:** Interactive branching narrative generator powered by `gemini-3.5-flash-lite`, visual scene graph timeline tree, choice explorers, and character fate tracking.
- **Tech Stack:** `@google/genai` (`gemini-3.5-flash-lite`), React 19, Framer Motion 120Hz GPU, Next.js 15 Server Actions, Zod, `WhatIfSandboxModal.tsx`, `SceneGraphTree.tsx`, `screenplayBranchActions.ts`, `WhatIfScenario.tsx`.
- **Status:** ✅ Completed

### 🌐 Sprint 94: CineSync AR Co-Watching Sphere (ספירת סנכרון צפייה קבוצתי)
- **Concept:** Real-time group co-watching lounge with synchronized trailer status, mood beacons, readiness toggling, Web Audio chime synthesizer (D5-A5), and live reactive emojis.
- **Tech Stack:** Web Audio API, Framer Motion 120Hz GPU, React 19, Next.js 15 Server Actions, Zod, `CineSyncSphere.tsx`, `GroupAuraBeacon.tsx`, `coWatchingActions.ts`, `app/(main)/nexus/page.tsx`.
- **Status:** ✅ Completed

### ⚡ Sprint 95: Dynamic VIP Last-Minute Seat Auction Arena (זירת מכרזי מושבי VIP של הרגע האחרון)
- **Concept:** Live last-minute seat auction arena with 180s countdown timer, dynamic bid steppers (+₪10, +₪25, +₪50), Web Audio wooden gavel strike synthesizer with 40Hz resonant thump, and haptic pulse feedback.
- **Tech Stack:** Web Audio API, Haptics API, React 19, Framer Motion 120Hz GPU, Next.js 15 Server Actions, Zod, `LiveSeatAuctionArena.tsx`, `AuctionGavelSound.ts`, `auctionBidActions.ts`, `app/(main)/vip/page.tsx`.
- **Status:** ✅ Completed

### 💬 Sprint 96: AI Afterglow Cine-Debate & Spoiler-Guard Arena (מתחם Afterglow מוגן ספוילרים וטריוויה)
- **Concept:** Post-movie community debate lounge with biometric hold-to-reveal spoiler unmasking, interactive trivia challenge with reputation points, and discussion feeds.
- **Tech Stack:** React 19, Framer Motion 120Hz GPU, Next.js 15 Server Actions, Zod, `AfterglowLounge.tsx`, `SpoilerRevealCard.tsx`, `afterglowActions.ts`, `MovieDetailsContent.tsx`.
- **Status:** ✅ Completed

### 🎙️ Sprint 97: Live Spoiler Filter & Auto-Archiving Stream (מסנן ספוילרים וארכוב 24 שעות)
- **Concept:** Real-time AI sentiment and spoiler stream with 24-hour auto-archiving countdown and push notification toggle.
- **Tech Stack:** React 19, Framer Motion 120Hz GPU, Next.js 15 Server Actions, Zod, `SpoilerFilterStream.tsx`, `communityLiveAudioActions.ts`.
- **Status:** ✅ Completed

### 🍱 Sprint 98: AI Bio-Sensory CineSnacks & Kitchen Timer (מזנון ביו-סנסורי ושעון מטבח)
- **Concept:** AI Pick dynamic gradient cards with palate matching algorithms and express kitchen dispatch countdown timer.
- **Tech Stack:** React 19, Framer Motion 120Hz GPU, Next.js 15 Server Actions, Zod, `BioSensoryPalateCard.tsx`, `KitchenDispatchTimer.tsx`, `bioSensorySnackActions.ts`, `food/page.tsx`.
- **Status:** ✅ Completed

### 💳 Sprint 99: 10-Min Session Lock & Group Split Payment (נעילת 10 דקות ותשלום מפוצל)
- **Concept:** 10-minute session lock timer widget with individual seat checkout execution and dual ILS (₪) / Crypto USDC pricing.
- **Tech Stack:** React 19, Next.js 15 Server Actions, Zod, `SplitPaymentTimer.tsx`, `splitPaymentActions.ts`, `checkout/page.tsx`.
- **Status:** ✅ Completed

### 🎧 Sprint 100: Web Audio 3D Seat Spatializer (תצוגת שמע 3D מרחבית לכל מושב)
- **Concept:** Seat-specific Dolby Atmos 3D spatial sound preview simulation utilizing Web Audio `PannerNode` and `BiquadFilterNode`.
- **Tech Stack:** Web Audio API, React 19, Framer Motion 120Hz GPU, `SeatAcousticPreviewModal.tsx`, `SeatMapSection.tsx`.
- **Status:** ✅ Completed

### 🔮 Sprint 101: Gemini Live Bio-Sensory Flavor & Mood Predictor (מנבא מצב רוח וטעמים ביומטרי)
- **Concept:** Interactive biometric sliders (Energy, Valence, Intensity) with live Gemini `gemini-3.5-flash-lite` multimodal flavor and movie perception matching.
- **Tech Stack:** `@google/genai` (`gemini-3.5-flash-lite`), React 19, Framer Motion 120Hz GPU, Next.js 15 Server Actions, Zod, `BioSensoryMoodPredictor.tsx`, `bioSensoryMoodActions.ts`, `concierge/page.tsx`.
- **Status:** ✅ Completed

### 📳 Sprint 102: Haptic Sub-Bass Wavefront Sync & Tactile Modulator (סנכרון תדרי תנודה רטוטים)
- **Concept:** Web Audio synthesis coupled with Haptics API (`navigator.vibrate`) synchronizing 35Hz-50Hz sub-bass sound waves with trailer haptic vibrations.
- **Tech Stack:** Web Audio API, Haptics API, Framer Motion 120Hz GPU, `HapticWavefrontModulator.tsx`, `hapticAudioActions.ts`.
- **Status:** ✅ Completed

### 🔨 Sprint 103: Dynamic Biometric VIP Seat Auction Stream & Live Gavel (מכרז מושבי VIP בזמן אמת)
- **Concept:** Real-time VIP seat auction stream with Web Audio gavel sound synthesizer, biometric fingerprint touch-hold, and live countdown timer.
- **Tech Stack:** Web Audio Synthesizer (`OscillatorNode`), React 19, `VIPSeatAuctionStream.tsx`, `vipAuctionStreamActions.ts`.
- **Status:** ✅ Completed

### 🧠 Sprint 104: AI Neural Mood & Screenplay Scene Graph Engine (מפת סצינות ניוראלית)
- **Concept:** Interactive scene graph visualizer powered by `@google/generative-ai` (`gemini-3.5-flash-lite`) mapping emotional valence, acoustic intensity, and dialogue density across movie chapters.
- **Tech Stack:** `@google/generative-ai`, Server Actions, Zod, Liquid Glass Canvas Graph, `NeuralSceneGraphModal.tsx`, `neuralSceneActions.ts`.
- **Status:** ✅ Completed

### 🎙️ Sprint 105: Acoustic Actor Biography & AI Voiceover Player (קריינות אקוסטית לביוגרפיית שחקנים)
- **Concept:** Dynamic actor biography player with Web Speech API audio narration and 120Hz GPU filmography reel.
- **Tech Stack:** Web Speech API, Framer Motion 120Hz GPU, `AcousticActorBioPlayer.tsx`, `actorBioActions.ts`.
- **Status:** ✅ Completed

### 🎟️ Sprint 106: Chrono-Refractive Passbook Shard & NFC Ticket Scanner (סורק כרטיסי NFC מוצפן)
- **Concept:** HMAC-SHA256 encrypted biometric passbook shard generator with refractive Liquid Glass 4.0 border and simulated NFC touch gate authentication.
- **Tech Stack:** Web Crypto API (HMAC-SHA256), Liquid Glass 4.0 Refractive Borders, `ChronoNFCScannerModal.tsx`, `chronoPassbookActions.ts`.
- **Status:** ✅ Completed

### 🎭 Sprint 107: Gemini AI Neural Role Emotion Graph (מניפת רגשות ודמויות נוירונלית לשחקנים)
- **Concept:** Deep emotional and intensity distribution analysis across an actor's filmography using `gemini-3.5-flash-lite` and 120Hz Liquid Glass 4.0 graph nodes.
- **Tech Stack:** `@google/generative-ai`, React 19, Framer Motion 120Hz GPU, Zod, `ActorRoleEmotionGraph.tsx`, `actorEmotionActions.ts`.
- **Status:** ✅ Completed

### 🔊 Sprint 108: Web Audio Sub-Bass Audio Scene Synthesizer (סינתיסייזר אקוסטי וסאב-באס 35-50Hz)
- **Concept:** Sub-bass frequency wave pulse synthesizer (42Hz) and speech synthesis monologue narration for actor profiles.
- **Tech Stack:** Web Audio API (`AudioContext`, `BiquadFilterNode`, `OscillatorNode`), Web Speech API, `ActorAudioSceneSynthesizer.tsx`.
- **Status:** ✅ Completed

### 🎖️ Sprint 109: Biometric HMAC-SHA256 Refractive Fan Badge Shard (תג מעריץ מוצפן בלחיצה ביומטרית)
- **Concept:** Biometric touch-hold passbook shard scanner issuing HMAC-SHA256 encrypted fan loyalty badges with haptic pulse feedback.
- **Tech Stack:** Crypto HMAC-SHA256, Haptics API (`navigator.vibrate`), Framer Motion 120Hz GPU, `ActorFanBadgeShard.tsx`, `actorBadgeActions.ts`.
- **Status:** ✅ Completed

---

## 🚀 Phase 41: Actor Cast Profile Engine Upgrade Suite (Sprints 107-109)
- Gemini AI Neural Role Emotion Graph, Web Audio Sub-Bass Scene Synthesizer, and Biometric HMAC-SHA256 Refractive Fan Badge Shard.
