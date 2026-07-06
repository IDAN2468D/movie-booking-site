---
name: "MovieSwipeMatcher"
description: "Governs the Tinder-like card swiping interface, local matching state, and high-performance MongoDB showtime lookups for the Cin Book cinema app."
---

# 🧠 Skill Context: Movie Swipe Matcher Engine

## 1. Functional Scope
This module isolates and governs the interaction loop, local gesture states, and active database filtering for the instant matchmaking carousel on the homepage.

## 2. Interface & UX Constraints (Tailwind CSS)
- **Card UI:** Render high-fidelity poster cards with fluid transitions (using Framer Motion or clean CSS animations) centered in a modern container.
- **Visual Micro-interactions:**
  - Swipe Right (Like): Render a temporary `bg-green-500/10` overlay with a green check border.
  - Swipe Left (Pass): Render a temporary `bg-red-500/10` overlay with a red dismiss cross border.
- **Empty State Guard:** When the stacked card array is empty (`movies.length === 0`), transition immediately to a custom loading skeleton or an elegant "No more movies playing today" layout.

## 3. State Management & MongoDB Sync Logic
- **Client Handling:** Maintain an in-memory array of liked movie IDs `[movieId1, movieId2]` during the active swipe session.
- **Backend Matching Query:** Upon session completion or a definitive "Right Swipe", trigger a secure backend API endpoint passing the liked IDs.
- **MongoDB Aggregation Rules:** - Perform a dynamic pipeline check: Match `movieId` against the `Showtimes` cluster.
  - Filter out showtimes that have occurred in the past or where `availableSeats.length === 0`.
  - Return an optimized response object containing the earliest matching movie, room number (e.g., "Hall 5"), and an auto-generated link directing the client straight to the seating grid matrix.