# 🏛️ CinePulse System Architecture State

## Module Architecture Overview

| Module ID | Module Name | Primary Path | Key Functionality | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Module A** | Account & Profile | `/src/app/dashboard/profile` | 2FA OTP, Notification Preferences, Profile Update | `ACTIVE` |
| **Module B** | Organization & RBAC | `/src/app/dashboard/organization` | Team Member Roles, Invitations, Access Control | `ACTIVE` |
| **Module C** | Billing & Stripe | `/src/app/dashboard/billing` | Stripe Checkout, Invoices, Tier Upgrade | `ACTIVE` |
| **Module D** | Security & Audit | `/src/app/dashboard/security` | Audit Logs, Active Sessions, Security Presets | `ACTIVE` |
| **Module E** | Expense Manager | `/src/app/dashboard/expenses` | Expense Categorization, Receipts, Status Approval | `ACTIVE` |
| **Module F** | Budget Planner | `/src/app/dashboard/budgets` | Monthly Budget Caps, Variance Analytics | `ACTIVE` |
| **Module G** | Crypto Portfolio | `/src/app/dashboard/crypto` | Asset Holdings, Realized Profit/Loss, Trade Logs | `ACTIVE` |
| **Module H** | Gemini AI Advisor | `/src/app/dashboard/ai-advisor` | Gemini Financial Advisor, Insights (`gemini-3.5-flash-lite`) | `ACTIVE` |
| **Module I** | Movie Entrance Engine | `/components/movie` | Framer Motion Shared Element Transition (`layoutId`), 3D Hero | `ACTIVE` |
| **Module J** | Loading Animation & Indicator Engine | `/components/ui/LoadingIndicator.tsx` | 120Hz GPU Indicators (`orbit`, `spinner`, `pulse`, `dots`), Zero-Layout Shift | `ACTIVE` |
| **Module K** | CineBook Thermal Receipt Printer Engine | `/components/receipt/CineBookReceiptPrinter.tsx` | 120Hz GPU Dynamic Height Rollout, Key-Based Instant Reprint, Metallic Head Slot, Interactive Serrated Tear, Vector Barcode | `ACTIVE` |
| **Module L** | Production Cinematic Memory Capsule | `/components/tickets/ChronoRefractiveReel.tsx` | Full MongoDB Booking Shards, User Reflection Journaling, Web Audio 35-50Hz Pulse, Dual Reel/Grid Views | `ACTIVE` |
| **Module M** | Panoramic Kinetic Catering Lounge Engine | `/components/catering/VisualCateringGrid.tsx` | Full-Width Liquid Glass 4.0 Grid, Category Filter Pills, Kinetic Drag & Quick Stepper Controls, Smart Combo AI | `ACTIVE` |
| **Module N** | Neural Stem-Decomposer & Spatial Mixer Studio | `/components/soundtrack/StemDecomposerStudio.tsx` | 4-Stem Audio Separation (Dialogue, Score, Sub-Bass, SFX), Web Audio Biquad Filter & Gain Nodes | `ACTIVE` |
| **Module O** | Gemini Interactive Screenplay Sandbox | `/components/movie/WhatIfSandboxModal.tsx` | Multi-Branch Alternative Narrative Graph & Timeline Simulator with `gemini-3.5-flash-lite` | `ACTIVE` |
| **Module P** | CineSync AR Co-Watching Sphere | `/components/social/CineSyncSphere.tsx` | Live Group Sync Lounge, Synchronized Trailer Playback, Web Audio Chime, Reactive Emojis | `ACTIVE` |
| **Module Q** | Dynamic VIP Last-Minute Seat Auction Arena | `/components/vip/LiveSeatAuctionArena.tsx` | Live Bidding Steppers, Web Audio Gavel Strike Sound Synthesizer, 180s Neon Countdown Clock | `ACTIVE` |
| **Module R** | AI Afterglow Cine-Debate & Spoiler-Guard Arena | `/components/community/AfterglowLounge.tsx` | Biometric Hold-to-Reveal Spoiler Unmasking, Post-Movie Trivia Quiz & Community Discussions | `ACTIVE` |
| **Module S** | Live Spoiler Filter & Auto-Archiving Stream | `/components/community/SpoilerFilterStream.tsx` | Real-time AI Sentiment & Spoiler Detection, 24h Auto-Archive Scheduler, Push Notification Toggle | `ACTIVE` |
| **Module T** | AI Bio-Sensory CineSnacks & Kitchen Timer | `/components/concessions/BioSensoryPalateCard.tsx` | Dynamic AI Pick Cards, Bio-Sensory Palate Matching, Express Kitchen Dispatch Countdown | `ACTIVE` |
| **Module U** | 10-Min Session Lock & Group Split Payment | `/components/booking/SplitPaymentTimer.tsx` | 10-Minute Group Session Lock, Individual Seat Checkout Execution, Dual ILS / Crypto USDC Pricing | `ACTIVE` |
| **Module V** | Web Audio 3D Seat Spatializer | `/components/booking/SeatAcousticPreviewModal.tsx` | Seat-Specific Dolby Atmos 3D Spatial Audio Preview with Web Audio PannerNode & BiquadFilterNode | `ACTIVE` |
| **Module W** | Gemini Live Bio-Sensory Flavor & Mood Predictor | `/components/ai/BioSensoryMoodPredictor.tsx` | Biometric Sliders (Energy, Valence, Intensity), Live Flavor & Movie Perception Matching with Gemini | `ACTIVE` |
| **Module X** | Haptic Sub-Bass Wavefront Sync & Tactile Modulator | `/components/audio/HapticWavefrontModulator.tsx` | Web Audio 35Hz-50Hz Sub-Bass & Haptics API Vibration Sync | `ACTIVE` |
| **Module Y** | Dynamic Biometric VIP Seat Auction Stream | `/components/vip/VIPSeatAuctionStream.tsx` | Live VIP Seat Auction, Gavel Sound Synthesizer, Biometric Touch Hold | `ACTIVE` |
| **Module Z** | AI Neural Mood & Screenplay Scene Graph | `/components/ai/NeuralSceneGraphModal.tsx` | Scene Graph Graph Analysis with `gemini-3.5-flash-lite` | `ACTIVE` |
| **Module AA** | Acoustic Actor Biography & Audio Reel | `/components/actor/AcousticActorBioPlayer.tsx` | Web Speech API Narration & 120Hz GPU Filmography Reel | `ACTIVE` |
| **Module AB** | Chrono-Refractive Passbook & NFC Scanner | `/components/tickets/ChronoNFCScannerModal.tsx` | HMAC-SHA256 Encrypted NFC Ticket Scanner & Liquid Glass Refractive Card | `ACTIVE` |
| **Module AC** | Gemini AI Neural Role Emotion Graph | `/components/actor/ActorRoleEmotionGraph.tsx` | Actor Role Emotion & Intensity Analysis with `gemini-3.5-flash-lite` | `ACTIVE` |
| **Module AD** | Web Audio Sub-Bass Scene Synthesizer | `/components/actor/ActorAudioSceneSynthesizer.tsx` | Web Audio 35Hz-50Hz Sub-Bass Oscillator & Audio Scene Speech Synthesizer | `ACTIVE` |
| **Module AE** | Biometric Refractive Fan Badge Shard | `/components/actor/ActorFanBadgeShard.tsx` | HMAC-SHA256 Encrypted Actor Fan Badge & Biometric Touch-Hold Scanner | `ACTIVE` |

| **Module AF** | Smart Watchlist & Cloud Sync | `/components/watchlist/WatchlistGrid.tsx` | Mongoose Watchlist Model, LocalStorage & DB Sync, dedicated `/watchlist` View | `ACTIVE` |
| **Module AG** | Spotlight Live Search Engine | `/components/search/SpotlightSearchModal.tsx` | Global `Cmd+K` / `Ctrl+K`, Multi-Category Live Search (Movies, Actors, Genres) | `ACTIVE` |
| **Module AH** | Verified Community Reviews & CineScore | `/components/movie/reviews/CommunityReviewsSection.tsx` | Mongoose MovieReview Model, Verified Ticket Check, Spoiler Shield, CineScore Badge | `ACTIVE` |

---

## Phase 42: High-Priority Movie Features Suite (Sprints 110-112)
1. **Smart Watchlist & Cloud Sync**: `Watchlist.ts`, `watchlistValidation.ts`, `watchlistActions.ts`, `WatchlistButton.tsx`, `WatchlistCard.tsx`, `WatchlistGrid.tsx`, `app/(main)/watchlist/page.tsx`.
2. **Spotlight Live Search Engine**: `spotlightSearchValidation.ts`, `spotlightSearchActions.ts`, `SpotlightResultsList.tsx`, `SpotlightSearchModal.tsx`, `TopBar.tsx`.
3. **Verified Community Reviews & CineScore**: `MovieReview.ts`, `movieReviewValidation.ts`, `movieReviewActions.ts`, `CineScoreBadge.tsx`, `VerifiedReviewCard.tsx`, `MovieReviewModal.tsx`, `CommunityReviewsSection.tsx`.

---

## API Routes & Server Actions Map
- `POST /api/auth/register` - Account Registration
- Server Action `watchlistActions.ts` - Smart Watchlist Add, Remove, and Cloud Sync
- Server Action `spotlightSearchActions.ts` - Spotlight Live Multi-Category Search
- Server Action `movieReviewActions.ts` - Community Reviews, Verified Ticket Check, and Like Voting
- Server Action `actorEmotionActions.ts` - Gemini AI Actor Role Emotion Graph Metrics
- Server Action `actorBadgeActions.ts` - HMAC-SHA256 Encrypted Fan Badge Shard Generation
