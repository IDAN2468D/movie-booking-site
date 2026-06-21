# 🎬 Movie Booking Site - Master Development Roadmap & Work Plan

This document outlines the detailed development phases, specifications, and checklists for the Movie Booking Site, tracking the visual design, booking engine, user management, and integrations.

---

## 🎨 Phase 1: Liquid Glass 3.0 UI Design System
Implement a premium, futuristic dark mode interface with deep refraction and tactile optical depth.

- [x] **ColorSync Integration**: Hook into selected movie genre metadata to dynamically adjust backgrounds and accent shadows (e.g., action = deep crimson, sci-fi = neon cyan, drama = gold).
- [x] **3D Parallax Interactions**: Use React 19 / Framer Motion to create mouse-tracked parallax orbs and movie poster cards with responsive tilt effects.
- [x] **120Hz Animation Optimizations**: Ensure all mouse-glow, scanner lines, and scroll-linked animations use GPU-accelerated CSS properties (`transform`, `opacity`) instead of trigger-heavy positioning to prevent layout reflow.
- [x] **AI Concierge Orb**: Integrate a glowing glass orb with breathing states (`idle`, `listening`, `processing`, `speaking`).

---

## 🎫 Phase 2: Seat Map & Real-time Booking Engine
Ensure transactional integrity and highly interactive ticket purchases.

- [x] **SVG-based Seat Map**: A clean, scalable vector grid representing theater seats.
  - States: `Available` (Neon Cyan), `Selected` (Gold/Orange), `Booked` (Muted Grey).
- [x] **Optimistic UI & Locking**: Lock seats optimistically on the client, and double-check seat status on the server before finalizing checkout.
- [x] **Collectible Ticket QR**: Generate high-end ticket designs with QR codes overlayed on glass panels. QR code contains a JWT-signed payload of the booking.
- [x] **RTL-Safe PDF Export**: PDF ticket download with correct Hebrew letter order and formatting.

---

## 🔐 Phase 3: Auth, Session, & Loyalty Ledger
Secure customer accounts and implement gamified customer loyalty rewards.

- [x] **NextAuth.js Integration**: Secure sessions with JWT, storing profiles and preferences in MongoDB.
- [x] **User Profile & Favorite Movies**: Dynamic user preferences to customize recommendation engines.
- [x] **Loyalty Points Ledger**: Add transaction history logging for point accrual (e.g., 10 points per ticket) and redemption for snacks/upgrades.

---

## 🔌 Phase 4: Integrations & AI Concierge Backend
Connect external APIs and build the AI-powered concierge.

- [x] **TMDB API caching**: Standardize API fetches with `next: { revalidate: 3600 }` to avoid rate limits and reduce page load times.
- [x] **AI Concierge (Gemini API)**: Multi-turn conversational interface for natural language movie recommendation.
- [x] **Self-Healing Fallback (Ollama)**: Implement local Ollama `gemma2:2b` fallback in the route catch blocks to automatically handle Gemini API rate limits or invalid keys.

---

## 🧪 Phase 5: Quality Assurance & CI/CD Pipelines
Verify application stability and pipeline automation.

- [x] **Unit Tests Verification**: Ensure all local helper functions and custom hooks pass their Vitest specs.
- [x] **E2E Playwright Flows**: Run simulated browser tests locally for checkout and booking flows.
- [x] **GitHub Action Workflows**: Confirm push/PR integration triggers execute correctly in `.github/workflows/`.

---

## 📊 Development Checklist
- [x] Initialize NextAuth adapters for MongoDB
- [x] Design the SVG seat layout component
- [x] Create the genre color palette mapping file (`ColorSync`)
- [x] Implement the local Ollama fallback logic
- [x] Setup repository secrets for GitHub Actions CI/CD

---

## 🤖 Phase 6: Gemma 31B Advanced AI Integrations
Implementation of the highly requested AI-powered futuristic features.

- [x] **Cinematic Vibe Matcher**: Allow users to upload an image of their surroundings (via `analyze_image` MCP concept) to get a movie recommendation that matches the mood.
- [x] **Cinematic Deep Dive**: A "Deep Dive" button on the movie page that triggers a deep research process (`gemini_deep_research` concept) to fetch trivia and behind-the-scenes lore.
- [x] **AI Movie Trailers**: Generate short ambient teaser videos for classic movies or special events (`generate_video` concept).
- [x] **Personal AI Avatars**: A feature in the Loyalty dashboard to generate a custom cinematic profile picture (`generate_image` concept).

---

## 🚀 Phase 7: The "Wow Factor" Expansion (Gemma MCP Magic)
Further pushing the boundaries of AI integration in the browser.

- [x] **Cinematic Universe Maps**: Dynamic SVG infographic mapping out actor connections and movie universe lore.
- [x] **VIP Screening Mini-Sites**: Generate custom HTML/CSS landing pages on the fly for users to invite friends to group bookings.
- [x] **Cosplay Studio (Prop Insertion)**: Allow users to upload a photo and edit it (via AI in-painting) to add cinematic props like lightsabers.
- [x] **"What If?" Scenarios**: An interactive chat area where the AI rewrites the movie's ending based on user prompts.
