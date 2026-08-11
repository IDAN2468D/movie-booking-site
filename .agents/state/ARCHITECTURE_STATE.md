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

---

## Phase 39: CineBook v5.0 Next-Gen Master Feature Suite (Sprints 6-17)
1. **AI Bio-Sync Haptic Seat Resonator**: `sensorySync.ts`, `SensoryProfile.ts`, `sensoryActions.ts`, `sensoryStore.ts`, `SensoryResonatorModal.tsx`.
2. **CineMatch AR Group Matchmaker & Voice-Vibe Agent**: `groupSync.ts`, `GroupMatch.ts`, `groupMatchActions.ts`, `GroupVibeAgentModal.tsx`.
3. **Dynamic Last-Minute VIP Seat Auction**: `auction.ts`, `SeatAuction.ts`, `auctionActions.ts`, `LiveSeatAuctionCard.tsx`.
4. **Interactive AI "What-If" Screenplay Simulator**: `storyBranching.ts`, `StoryNode.ts`, `storyBranchActions.ts`, `StoryBranchViewer.tsx`.
5. **Post-Screening Digital Memory Shard Vault**: `collectible.ts`, `MemoryShard.ts`, `collectibleActions.ts`, `MemoryShardVault.tsx`.
6. **Gradient Border Effect Skill & Ticket Cards Integration**: `QuantumTicket.tsx`, `HolographicTicket.tsx`, `GlobalGradientFrame.tsx`, `RightPanel.tsx`, `RightPanelLiveCinemaCard.tsx`, `FeaturesDropdown.tsx`, `SidebarNavItem.tsx`, `MovieCard.tsx`, `BranchCard.tsx`.
7. **User Data MongoDB Bookings Query Sync**: `app/api/bookings/route.ts` updated to query `{ $or: [{ userId }, { userEmail }] }` ensuring all user bookings from data are fetched.
8. **Liquid Glass 4.0 & Gradient Border Fusion**: Liquid Glass glassmorphism backdrop blur (`backdrop-blur-[60px]`, `saturate-[250%]`), glass borders, and radial gradient masking preserved in harmony (`LiquidGlassTicketVault.tsx`, `QuantumTicket.tsx`, `HolographicTicket.tsx`).
9. **Primary AI Model Strict Enforcement**: `gemini-3.5-flash-lite` enforced as default primary AI model across `lib/gemini.ts`, all server actions, and AI API endpoints.
10. **Movie Entrance Animation & Shared Element Transition**: Next.js 15 & Framer Motion Hero entrance animation with `layoutId={`movie-poster-${movie.id}`}` shared element transition, backdrop scale zoom, and staggered content reveal (`MovieEntranceAnimation.tsx`, `MovieCard.tsx`, `MovieDetailsContent.tsx`).

---

## API Routes & Server Actions Map
- `POST /api/auth/register` - Account Registration
- `POST /api/auth/2fa/generate` - 2FA Secret & QR Code Generation
- `POST /api/auth/2fa/verify` - 2FA Verification
- `POST /api/organization/invite` - Send Team Invitation Token
- `POST /api/billing/checkout` - Create Stripe Checkout Session
- `POST /api/webhooks/stripe` - Stripe Webhook Handler
- `POST /api/expenses` - Create / Filter Expense Entries
- `POST /api/crypto/trade` - Execute Crypto Buy/Sell Log
- `POST /api/ai/advisor` - Gemini AI Advisor Chat Handler (`gemini-3.5-flash-lite`)
