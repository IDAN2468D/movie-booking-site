# 🎬 Movie Booking Site - Master Development Roadmap & Work Plan

This document outlines the detailed development phases, specifications, and checklists for the Movie Booking Site, tracking the visual design, booking engine, user management, and integrations.

---

## 🎨 Phase 1: Liquid Glass 3.0 UI Design System
Implement a premium, futuristic dark mode interface with deep refraction and tactile optical depth.

- [ ] **ColorSync Integration**: Hook into selected movie genre metadata to dynamically adjust backgrounds and accent shadows (e.g., action = deep crimson, sci-fi = neon cyan, drama = gold).
- [x] **3D Parallax Interactions**: Use React 19 / Framer Motion to create mouse-tracked parallax orbs and movie poster cards with responsive tilt effects.
- [ ] **120Hz Animation Optimizations**: Ensure all mouse-glow, scanner lines, and scroll-linked animations use GPU-accelerated CSS properties (`transform`, `opacity`) instead of trigger-heavy positioning to prevent layout reflow.
- [ ] **AI Concierge Orb**: Integrate a glowing glass orb with breathing states (`idle`, `listening`, `processing`, `speaking`).

---

## 🎫 Phase 2: Seat Map & Real-time Booking Engine
Ensure transactional integrity and highly interactive ticket purchases.

- [ ] **SVG-based Seat Map**: A clean, scalable vector grid representing theater seats.
  - States: `Available` (Neon Cyan), `Selected` (Gold/Orange), `Booked` (Muted Grey).
- [ ] **Optimistic UI & Locking**: Lock seats optimistically on the client, and double-check seat status on the server before finalizing checkout.
- [ ] **Collectible Ticket QR**: Generate high-end ticket designs with QR codes overlayed on glass panels. QR code contains a JWT-signed payload of the booking.
- [ ] **RTL-Safe PDF Export**: PDF ticket download with correct Hebrew letter order and formatting.

---

## 🔐 Phase 3: Auth, Session, & Loyalty Ledger
Secure customer accounts and implement gamified customer loyalty rewards.

- [ ] **NextAuth.js Integration**: Secure sessions with JWT, storing profiles and preferences in MongoDB.
- [ ] **User Profile & Favorite Movies**: Dynamic user preferences to customize recommendation engines.
- [ ] **Loyalty Points Ledger**: Add transaction history logging for point accrual (e.g., 10 points per ticket) and redemption for snacks/upgrades.

---

## 🔌 Phase 4: Integrations & AI Concierge Backend
Connect external APIs and build the AI-powered concierge.

- [ ] **TMDB API caching**: Standardize API fetches with `next: { revalidate: 3600 }` to avoid rate limits and reduce page load times.
- [ ] **AI Concierge (Gemini API)**: Multi-turn conversational interface for natural language movie recommendation.
- [ ] **Self-Healing Fallback (Ollama)**: Implement local Ollama `gemma2:2b` fallback in the route catch blocks to automatically handle Gemini API rate limits or invalid keys.

---

## 🧪 Phase 5: Quality Assurance & CI/CD Pipelines
Verify application stability and pipeline automation.

- [ ] **Unit Tests Verification**: Ensure all local helper functions and custom hooks pass their Vitest specs.
- [ ] **E2E Playwright Flows**: Run simulated browser tests locally for checkout and booking flows.
- [ ] **GitHub Action Workflows**: Confirm push/PR integration triggers execute correctly in `.github/workflows/`.

---

## 📊 Development Checklist
- [ ] Initialize NextAuth adapters for MongoDB
- [ ] Design the SVG seat layout component
- [ ] Create the genre color palette mapping file (`ColorSync`)
- [ ] Implement the local Ollama fallback logic
- [ ] Setup repository secrets for GitHub Actions CI/CD
