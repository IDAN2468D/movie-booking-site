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
| **Module K** | CineBook Thermal Receipt Printer Engine | `/components/receipt/CineBookReceiptPrinter.tsx` | 120Hz GPU Downward Paper Feed Rollout, Metallic Head Slot, Interactive Serrated Paper Tear, Vector Barcode | `ACTIVE` |
| **Module L** | Production Cinematic Memory Capsule | `/components/tickets/ChronoRefractiveReel.tsx` | Full MongoDB Booking Shards, User Reflection Journaling, Web Audio 35-50Hz Pulse, Dual Reel/Grid Views | `ACTIVE` |

---

## Phase 39: CineBook v5.0 Next-Gen Master Feature Suite (Sprints 6-18)
1. **Production-Ready Cinematic Memory Capsule & Shard Vault**: `memoryCapsule.ts`, `defaultMemoryCapsules.ts`, `memoryActions.ts`, `useMemoryCapsules.ts`, `acousticMemory.ts`, `MemoryReelHeader.tsx`, `MemoryShardCard.tsx`, `NeuralFlashbackModal.tsx`, `CreateMemoryModal.tsx`, `ChronoRefractiveReel.tsx`.
1. **AI Bio-Sync Haptic Seat Resonator**: `sensorySync.ts`, `SensoryProfile.ts`, `sensoryActions.ts`, `sensoryStore.ts`, `SensoryResonatorModal.tsx`.
2. **CineMatch AR Group Matchmaker & Voice-Vibe Agent**: `groupSync.ts`, `GroupMatch.ts`, `groupMatchActions.ts`, `GroupVibeAgentModal.tsx`.
3. **Dynamic Last-Minute VIP Seat Auction**: `auction.ts`, `SeatAuction.ts`, `auctionActions.ts`, `LiveSeatAuctionCard.tsx`.
4. **Interactive AI "What-If" Screenplay Simulator**: `storyBranching.ts`, `StoryNode.ts`, `storyBranchActions.ts`, `StoryBranchViewer.tsx`.
5. **Post-Screening Digital Memory Shard Vault**: `collectible.ts`, `MemoryShard.ts`, `collectibleActions.ts`, `MemoryShardVault.tsx`.
6. **Gradient Border Effect Skill & Ticket Cards Integration**: `QuantumTicket.tsx`, `HolographicTicket.tsx`, `GlobalGradientFrame.tsx`, `RightPanel.tsx`, `RightPanelLiveCinemaCard.tsx`, `FeaturesDropdown.tsx`, `SidebarNavItem.tsx`, `MovieCard.tsx`, `BranchCard.tsx`.
7. **User Data MongoDB Bookings Query Sync**: `app/api/bookings/route.ts` updated to query `{ $or: [{ userId }, { userEmail }] }` ensuring all user bookings from data are fetched.
8. **Liquid Glass 4.0 & Gradient Border Fusion**: Liquid Glass glassmorphism backdrop blur (`backdrop-blur-[60px]`, `saturate-[250%]`), glass borders, and radial gradient masking preserved in harmony (`LiquidGlassTicketVault.tsx`, `QuantumTicket.tsx`, `HolographicTicket.tsx`).
9. **Primary AI Model Strict Enforcement**: `gemini-3.5-flash-lite` enforced as default primary AI model across `lib/gemini.ts`, all server actions, and AI API endpoints.
10. **Movie Entrance Animation & Shared Element Transition**: Next.js 15 & Framer Motion Hero entrance animation with smooth GPU scale and fade transitions.
11. **Electric Border Effect & Smart Pick UI Cards**: Electric neon border glow with `public/log_white.svg`, 1000% scale at (56%, 41.7%), `background-origin: content-box` with padding, layered z-index.
12. **Global Loading Indicator Standardization**: Standardized `LoadingIndicator.tsx` across all pages, modals, buttons, AI studios, and sound synthesizers with GPU acceleration and accessibility.
13. **Neon Animated Card Skill & Universal Passbook Integration**: Rotating glowing neon gradient borders (`conic-gradient`), 2px `overflow-hidden` edge clipping, ambient drop-shadow aura (`shadow-[0_0_35px...]`), flip-out QR pass, and dark glass layers integrated across `QuantumTicket.tsx`, `HolographicTicket.tsx`, `NeonTicket.tsx`, `TicketsTabSwitcher.tsx`, and `app/(main)/tickets/page.tsx`.
14. **Standardized Skills Directory Architecture**: All 20 project skills organized into compliant `.agents/skills/<skill-name>/SKILL.md` directory structures.
15. **CineBook 120Hz GPU Thermal Receipt Printer Skill Integration**: Metallic gold printer slot, Framer Motion GPU downward paper feed rollout (`y: -100% -> 0`), interactive serrated edge tear effect, barcode, native Hebrew RTL formatting, and dynamic booking data integration in `SuccessView.tsx`.

---

## API Routes & Server Actions Map
- `POST /api/auth/register` - Account Registration
- `POST /api/auth/2fa/generate` - 2FA Secret & QR Code Generation
- `POST /api/auth/2fa/verify` - 2FA Verification
- `POST /api/organization/invite` - Send Team Invitation Token
- `POST /api/billing/checkout` - Create Stripe Checkout Session
- `POST /api/webhooks/stripe` - Stripe Webhook Handler
