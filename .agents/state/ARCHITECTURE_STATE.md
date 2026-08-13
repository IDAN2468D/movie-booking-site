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

---

## Phase 39: CineBook v5.0 Next-Gen Master Feature Suite (Sprints 6-18 & 92-101)
1. **Live Spoiler Filter & Auto-Archiving Community**: `SpoilerFilterStream.tsx`, `communityLiveAudioActions.ts`.
2. **AI Bio-Sensory CineSnacks & Kitchen Timer**: `BioSensoryPalateCard.tsx`, `KitchenDispatchTimer.tsx`, `bioSensorySnackActions.ts`.
3. **10-Min Session Lock & Group Split Payment**: `SplitPaymentTimer.tsx`, `splitPaymentActions.ts`.
4. **Web Audio 3D Seat Spatializer**: `SeatAcousticPreviewModal.tsx`, `SeatMapSection.tsx`.
5. **Gemini Live Bio-Sensory Flavor & Mood Predictor**: `BioSensoryMoodPredictor.tsx`, `bioSensoryMoodActions.ts`.

---

## API Routes & Server Actions Map
- `POST /api/auth/register` - Account Registration
- `POST /api/auth/2fa/generate` - 2FA Secret & QR Code Generation
- `POST /api/auth/2fa/verify` - 2FA Verification
- `POST /api/organization/invite` - Send Team Invitation Token
- `POST /api/billing/checkout` - Create Stripe Checkout Session
- `POST /api/webhooks/stripe` - Stripe Webhook Handler
- Server Action `communityLiveAudioActions.ts` - Live Spoiler & Sentiment Stream
- Server Action `bioSensorySnackActions.ts` - Palate Pairing & Dispatch Timer
- Server Action `splitPaymentActions.ts` - Group Session Lock & Seat Checkout
- Server Action `bioSensoryMoodActions.ts` - Multimodal Gemini Mood & Flavor Prediction
