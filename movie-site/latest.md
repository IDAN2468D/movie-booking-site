# 🛑 User-Defined Agent Directives & Constraints
*All future requests provided by the user must be logged here.*

## 🛑 STRICT TOKEN OPTIMIZATION RULES (Added Manually)
You operate in a high-efficiency environment where tokens are heavily budgeted. 
Adhere to these output constraints strictly:

1. **NO FULL FILE REWRITES:** Never rewrite an entire file if only small parts changed. 
2. **USE CODE SNIPPETS / DIFFS:** Provide only the specific functions or lines that need modification. Use clear comments indicating where the code fits:
   ```javascript
   // ... existing code ...
   function updatedTarget() {
       // Only the changed logic here
   }
   // ... existing code ...
   ```

---

# 🆕 Latest Updates (v7.2)

## 🌪️ Biometric Emotion Vortex (Sprint 27)
- **Feature Implemented:** Upgraded the post-movie rating system with a gamified 3D physics engine where users drop "Emotion Orbs" into a gravity well.
- **Physics & UI:** Engineered `EmotionVortexCanvas.tsx` and `DraggableEmotionOrb.tsx` using `framer-motion` for 120Hz drag-and-drop physics, scale transformations, and Liquid Glass 4.0 dynamic color shifting based on the dragged emotion.
- **Acoustics:** Created `useVortexAcoustics.ts` to generate spatial Web Audio "suction" frequency ramps and 40Hz sub-bass drops upon orb collision.
- **Backend & Data Boundary:** Implemented `EmotionVortex` MongoDB schema and secure `castEmotionOrbAction` Server Action with strict Zod validation (`EmotionOrbSchema`).
## 🎧 Acoustic Seat Preview Engine (Sprint 20)
- **Feature Implemented:** Users can now preview the exact spatial audio properties of a selected seat before booking.
- **Backend Architecture:** Created Zod schemas (`SeatAcousticProfileSchema`) and secure Server Action `getSeatAcousticProfile` mapping the Unified Result Pattern.
- **Audio Engineering:** Upgraded `useAcousticFeedback.ts` with continuous Web Audio API loops (`playSeatPreviewLoop`), utilizing `PannerNode` and `BiquadFilterNode` for 3D HRTF spatial mapping and lowpass filtering based on the seat position.
- **Liquid Glass 4.0 UI:** Engineered `AcousticPreviewModal.tsx`, an immersive 120Hz zero-reflow GPU overlay using `framer-motion`, `transform-gpu`, and frosted glass (`backdrop-blur-[40px] saturate-[250%]`).
- **Integration:** Integrated seamlessly into `SeatMap.tsx` with a dedicated "Acoustic" toggle button.

## 🥤 Kinetic Liquid Physics & Acoustic Pouring (Sprint 20)
- **Feature Implemented:** Upgraded the Concession Stand tray with Liquid Glass physics and procedural audio.
- **Acoustic Engineering:** Created `usePouringAcoustics.ts` utilizing the Web Audio API to synthesize a "carbonation fizz" sound using a `BufferSourceNode` of white noise passed through an exponentially sweeping `BiquadFilterNode` (Bandpass). Includes a slow logarithmic fade-out to simulate lingering bubbles.
- **Liquid Physics UI:** Integrated an `<AnimatePresence>` liquid simulator inside `SnackDraggableItem.tsx`. When a drink snaps to a cupholder, a `motion.div` fills up vertically over 1.5 seconds, layered with animated fizz particles.
- **Integration:** Hardware-accelerated (`transform-gpu`) physics ensure zero reflows during the liquid fill.

## 🔍 3D Holographic "UV Ink" Scanner (Sprint 20)
- **Feature Implemented:** Upgraded the Offline Ticket Vault with a 3D interactive Hologram Scanner.
- **Optics & UI:** Engineered `UVScannerTicket.tsx` utilizing `framer-motion`'s `useMotionValue` and `useSpring` to create a 3D glass ticket that tilts based on cursor/touch proximity. Added a dynamic SVG UV reveal mask (`mix-blend-color-dodge`) to expose hidden watermarks.
- **Acoustic Engineering:** Created `useUVAcoustics.ts` utilizing the Web Audio API to generate a localized oscillator (low-frequency hum). Frequency and Gain dynamically ramp up as the UV light passes over the hidden watermark.
- **Integration:** Replaced the static QR Code view in `LiquidGlassTicketVault.tsx` with the new 3D component.

---

# 🆕 Latest Updates (v7.1)

## 🎟️ Sprints 19 & 22 (Completed ahead of schedule in Sprint 14)
- **Features Implemented:**
  1. **Generative Holographic Scratch-Card (Sprint 19):** AI-driven prizes via Gemini, Zod validation, atomic MongoDB commits, and liquid-glass holographic rendering.
  2. **3D Cinematic Parallax Hero (Sprint 22):** Multi-layered spatial depth (Z-index/Transform) with GPU-composited performance.
- **Metrics:** 0 TypeScript errors, 100% test pass rate (39/39), production build stable.
- **Constraints Met:** Strictly under 200 LOC per component.
- **Next Step:** System is clean and ready for Sprint 15 (Proactive Engagement / Social Pulse).

## 🧪 Liquid Glass 4.0 Expansion (Layer 5)
- **Phase 1: Validations & State:** Created `lib/validations/liquidGlass.ts` with strict Zod contracts and established `lib/store/liquidGlassStore.ts` using isolated Zustand atomics.
- **Phase 2: Volumetric Film-Grain:** Implemented `VolumetricFilmGrain.tsx` with a `requestAnimationFrame` loop modifying GPU matrices.
- **Phase 3: Kinetic Ticket Shatter:** Built `TicketShatterSimulator.tsx` using `framer-motion` array mappings for zero-reflow 120Hz 3D glass shards tracking the cursor.
- **Phase 4: Dynamic Snack Tray:** Engineered `DynamicSnackTrayCanvas.tsx` with proximity collision detection and draggable items tracking hardware-accelerated coordinates.
- **Phase 5: Chrono-Refractive Reel:** Constructed `ChronoRefractiveReel.tsx` and `ChronoSlide.tsx` tracking framer-motion `useScroll` mapped to exponential opacity decay variables on GPU.
- **Phase 6: Biometric Specular Intensity Map:** Assembled `BiometricIntensityMap.tsx` overlaying a volumetric heatmap tied dynamically to genre selection.
- **Phase 7: Holographic Ticket Shard-Fusion:** Created `HolographicShardFusion.tsx` using a React portal to emit zero-reflow glass particles upon checkout resolution.
- **Integration & Verification:** Successfully mounted `BiometricIntensityMap` and `DynamicSnackTrayCanvas` into `SeatMap.tsx`. Passed all `npx vitest run` checks and `npm run build` compilation stages successfully.

---

# 🆕 Latest Updates (v7.0)

## 🤖 Enterprise-Cognitive Agent Stack Upgrade (v7.0)
- **Framework Upgrades:** Overhauled the core 5-layer execution engine to v7.0 inside `SKILL.md` and `AGENTS.md`.
- **Token Optimization & JIT:** Established protocols for token budget monitoring and JIT skill loading from `.agents/Skills/` to conserve token budgets.
- **Screen Awareness:** Hardcoded UI Screen Context checks before conducting frontend view modifications.
- **Self-Healing Loop:** Detailed strict automated testing (`npx tsc --noEmit` and `npx vitest run`) and enforced a robust 3-Strike Rule to halt and prompt the user on persistent diagnostic failures.
- **Verification:** Verified 100% successful compilation and vitest suite execution (39/39 passing).

---

# 🆕 Latest Updates (v6.2)

## 🎬 Movies Coming Soon Screen Upgrade (Sprint 18)
- **Navigation & Routing:** Engineered a dedicated `/coming-soon` route and integrated it into the Liquid Glass 4.0 Sidebar and MobileNav layouts.
- **Backend & Data Integrity:** Developed `getMovieTrailerAction` and expanded `movieValidation.ts` using Zod schemas for TMDB YouTube trailer results.
- **Liquid Glass 4.0 UI:** Engineered `ComingSoonClient.tsx`, `UpcomingMovieCard.tsx`, and `TrailerModal.tsx`. Included dynamic background layout-reflow-free liquid transitions synced with movie poster hovers.
- **Interactive Features:** Integrated a real-time countdown badge, Save to Calendar local tracking, and immersive TMDB video modals.
- **Self-Healing Loop:** Conducted rigorous verification with `npm run build` and `npx vitest run` (39/39 passing) resulting in a fully isolated, strictly-typed implementation module.

## 🎬 Movies Coming Soon Carousel (Sprint 18)
- **TMDB Server Proxy:** Executed Step 1 - Created Server Action `getUpcomingMoviesAction` with Next.js revalidation cache (24 hours) protecting API Keys on the server.
- **Zod Data Boundary:** Executed Step 2 - Defined strict type-safe operational mapping via `UpcomingMovieSchema` to secure inputs.
- **Liquid Glass 4.0 UI Carousel:** Executed Step 3 - Implemented `ComingSoonCarousel.tsx` featuring sub-pixel chromatic borders, layered depth shadows, and 120Hz zero-reflow loading skeletons.
- **Rigorous Verification:** Finalized test suite (`upcomingMovies.test.ts`) with 100% Vitest coverage and compiled successful production Next.js Turbopack build.

## 🎫 Offline Ticket Vault (LiquidGlassTicketVault)
- **Backend Sealing:** Engineered the HMAC-SHA256 signature Server Action for zero client exposure encryption alongside strict Zod schemas for the barcode payload.
- **Liquid Glass Vault UI:** Implemented `LiquidGlassTicketVault.tsx` rendering a `qrcode.react` secure token with a Liquid Glass 4.0 layout and `useSubBass` acoustic unlock animation.
- **Verification:** Finalized and verified the complete workflow with zero TypeScript errors and 100% Vitest coverage pass (32/32 tests). Module locked.

## 🍿 Cinema Concession Redesign (v6.2)
- **Backend Architecture:** Engineered Concession Server Actions, zero-client database contracts, and strict Zod validation boundary mapping the Unified Result Pattern.
- **Liquid Glass UI & Kinetics:** Implemented `ConcessionMatrix` and `Bucket` utilizing Framer Motion `layoutId` drops, Zustand caching, and GPU-accelerated WCAG-safe ambient flavor glow.
- **Acoustic Integration & Live Sync:** Wired 40Hz Web Audio API sub-bass drops to interactions with rigorous unmount cleanup, and linked Server Actions to a UI Live Sync timeline using React `useTransition`.

---

# 🆕 Latest Updates (v6.1)

## ⚙️ Settings Control Center (v6.1)
- **Backend Architecture:** Engineered Settings Control Center Backend with strict Zod Validation Boundary & Server Actions.
- **Liquid Glass 4.0 UI:** Engineered Liquid Glass 4.0 UI Layout Matrix including Optics Controller, Data Purge Engine, and Settings Dashboard binding.
- **Acoustic Integration:** Activated WebAudio API Spatializer and bound UI inputs to MongoDB Server Actions for full Master Feature completion.

---

# 🆕 Latest Updates (v5.9)

## 🎭 Movie Swipe Matcher Engine (v5.9)
- **Secure Backend Route:** Created the Matcher API route (`POST /api/movies/match`) mapping the Unified Result Pattern with legacy date fallbacks.
- **Hermetic Zod Validations:** Implemented strict validation boundaries preventing untrusted data passage.
- **Liquid Glass 4.0 Interface:** Assembled `SwipeMatcher.tsx` using a gesture-driven deck of movie cards via `framer-motion` for zero-reflow 120Hz GPU motion.
- **Match Found Modal:** Engineered an immersive overlay triggered conditionally upon backend validation of available seats, featuring particle explosions.
- **Stabilization & Kinetic Ticket Fusion:** Fixed top-card drift logic in `SwipeMatcher.tsx`. Engineered a dynamic "Continue" interaction in `DynamicSeatMap.tsx` that initiates "The Kinetic Ticket Fusion" overlay with particle explosions once seats are selected.
- **The Live Cinema Pivot:** Deleted the Seating Roulette engine and `DynamicSeatMap` in favor of a direct "Live Broadcast" flow (`/cinema/live/[movieId]`). The Match Screen was heavily upgraded to "Titanium Glass" UI with real-time responsive cinematic blurred backdrops that match the top card.
- **Social Match Sync:** Created strict Zod boundary and isolated MongoDB `/api/rooms` mutation endpoint. Engineered low-latency SSE stream endpoint (`/api/rooms/listen`) with interval polling to instantly transmit 'matched' events to clients.

---

# 🆕 Latest Updates (v5.8)

## 💎 Dynamic Specular Subtitles Engine (v5.8)
- **Component Architecture:** Created the atomic `components/fx/SpecularSubtitles.tsx` and sub-rendering `components/fx/SubtitleText.tsx` components under 200 lines to conform to strict SSOT bounds.
- **Store Sync:** Linked to Zustand global state using shallow-baked selectors for zero-reflow rendering.
- **Audio-Reactive Pipeline:** Hooked Web Audio Analyser frequency bytes directly to Framer Motion GPU spring transitions (scale, glow, chromatic shift).
- **Zod Bounds Validation:** Created `lib/validations/subtitles.ts` to validate subtitle arrays before render with error-boundary reporting.

---

# 🆕 Latest Updates (v5.7)

## 💎 Liquid Glass 3.0 Homepage Redesign (v5.7)
- **Category Filters Redesign:** Upgraded `CategoryFilters.tsx` to utilize premium multi-layered obsidian glass styling, cyber-cyan/magenta border shifts, dynamic hover elevations (`y: -3`), and spring animations.
- **SmartPicks AI Grid Redesign:** Upgraded `SmartPicksView.tsx` recommendations to premium Bento cards featuring neon corner highlights, custom backdrop blur saturates (`saturate-[220%]`), and interactive cursor refraction glows.
- **Mobile Booking Capsule:** Converted the mobile booking trigger inside `HomeContent.tsx` into a floating capsule (pill geometry) with high optical depth, outline border refractions, and layout-reflow-free scaling.

---

# 🆕 Latest Updates (v5.6)

## 💎 Liquid Glass 3.0 Next-Gen Interactive Features (v5.6)
- **Acoustic Sub-Bass Resonator:** Created `SubBassResonator.tsx` implementing physical device haptic vibrations mapped to sub-80Hz audio frequencies via the Web Audio API and HTML5 Vibration API.
- **Chroma-Refractive Poster Warp:** Created `PosterRefractor.tsx` implementing dynamic 3D mouse parallax tilts and layered chromatic aberration red/cyan offset shifting on movie posters.
- **Quantum Subtitles Sync:** Created `QuantumSubtitles.tsx` matching typographic scaling, weight shifts, and glow colors to Web Audio intensity levels.
- **Lobby Presence Ambient:** Created `LobbyPresencePulse.tsx` showing glowing concentric SVG/Framer Motion ripples representing concurrent active bookings.

---

# 🆕 Latest Updates (v5.5)

## 💎 Liquid Glass 3.0 Flagship Features (v5.5)
- **Aura Mood-Based Discovery:** Upgraded `NeuralMoodOrbit.tsx` with a dynamic morphing SVG liquid background well, viscous squish morph boundaries, and real-time color scheme shifts matching active moods.
- **Prism Seating Floor:** Upgraded `SeatMap.tsx` with a 3D perspective glass floor canopy (`rotateX`, `rotateZ`, `skewX`), cursor-following radial light refraction highlights, and adjacent concentric seat-selection ripple scaling waves.
- **Kinetic Ticket Artifact:** Upgraded `QuantumTicket.tsx` with shatter-to-assemble opening layout animations, 3D mouse parallax tracking tilts, and a toggleable QR code glass-frost overlay.
- **Specular Currency Cascade Engine:** Created `CurrencyCascade.tsx` implementing GPU-accelerated coin/shard waterfalls using `style={{ x, y }}` properties connected to transaction success state via a Zustand shallow selector.
- **Roaring Lion Celebration Gate:** Created `RoaringLionCelebration.tsx` showing a stylized glass lion head with gold radial glow rings, using layout-reflow-free Framer Motion GPU transitions.
- **Component Atomicity:** Decomposed `SeatMap.tsx` and `QuantumTicket.tsx` into modular subcomponents (`LobbyCursor.tsx`, `SeatLegend.tsx`, `TicketViews.tsx`, `TicketShard.tsx`) to guarantee no file exceeds 200 lines.

---

# 🆕 Latest Updates (v5.4)

## 🍔 Food & Drinks Page Refactoring (v5.4)
- **Component Atomicity:** Refactored the monolithic `food/page.tsx` into clean, modular subcomponents: `FoodHeader.tsx`, `FoodCategoryFilter.tsx`, `FoodItemCard.tsx`, and `FoodGrid.tsx` inside `components/food/`, ensuring no file exceeds 200 lines.
- **Zustand State Isolation:** Applied strict, shallow-baked selectors to `useBookingStore` to restrict component re-renders.
- **Zod Input Verification:** Created a new validation layer at `lib/validations/food.ts` to secure quantity adjustments and category actions at boundary entries.

---

# 🆕 Latest Updates (v5.3)

## 🌌 Specular Neural Catering Pipeline v2.0 (v5.3)
- **Zustand State Refactoring:** Replaced legacy state logic with a robust, client-side Zustand store featuring strict, shallow-baked selectors to eliminate cascading parent-to-child renders.
- **Biometric Allergen Filters:** Created `IngredientFilter.tsx` to handle user preference and allergy filtering, crossing active profiles with the menu matrix.
- **Temporal Phase Scheduler:** Created `PhaseSelector.tsx` for scheduling delivery to trailers, Act 1, and the film climax, backed by React 19 `useOptimistic` for instant visual changes.
- **Group Combo Splits:** Created `GroupComboSync.tsx` utilizing React 19 `useActionState` to split and sync group combos across seat vectors via Server Actions.

---

# 🆕 Latest Updates (v5.2)

## 🎨 Liquid Glass 3.0 Homepage Redesign (v5.2)
- **Category Filters Refinement:** Upgraded `CategoryFilters.tsx` to high-fidelity Liquid Glass 3.0 elements featuring custom pink/magenta glows (`rgba(255,20,100,0.45)`), dynamic hover translations (`y: -3`), and bottom-edge reflection lines using Framer Motion layout IDs.
- **Featured Hero Upgrade:** Updated `FeaturedHero.tsx` to use the premium theme color accents, corrected booking button shadow highlights, and set Outfit/Inter typography alignment to maximize text readability and premium feel.

---

# 🆕 Latest Updates (v5.1)

## ⚡ Token Optimization & Workspace Efficiency (v5.1)
- **Rules File Compression:** Optimized and compressed `.agents/Rules/movie-booking-site.md` to a dense, keyword-oriented standard, resulting in a **46% token reduction**.
- **Workspace Scan Exclusion:** Created a `.contextignore` configuration in the root directory to permanently exclude build directories (`.next`, `node_modules`), coverage report folders, and temp scratch files from agent workspace scans, preventing token waste.

---

# 🆕 Latest Updates (v5.0)

## 🤖 Anthropic Agent Stack Alignment (v5.0)
- **Unified AI Governance Standard:** Fully integrated the 5-step Anthropic Agent Stack (Loop, Plan, PRD, Spec, Markdown) into the core workspace rules.
- **Standardized Execution Loop:** Enforced structured planning, test-driven validation loops, and persistent markdown state tracking across all future agent interactions.
