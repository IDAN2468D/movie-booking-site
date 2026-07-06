# 🎬 Movie Booking Site - Premium Experience

A futuristic, high-performance movie discovery and booking platform built with Next.js 15, MongoDB, and Liquid Glass aesthetics.

## 🚀 Quick Start
```bash
npm install
npm run dev
```

## 🤖 AI Governance & Documentation
To maintain project quality and consistency, all AI agents follow the standards defined in the `.agents/rules` directory:

- **Master Rules**: [.agents/rules/movie-booking-site.md](./.agents/rules/movie-booking-site.md)
- **Project Specification**: [.agents/rules/project_spec.md](./.agents/rules/project_spec.md)
- **Active Plans**: Check `.agents/rules/active_plan.md` for current tasks.

## 🎭 Feature Core: Movie Swipe Matcher Engine

### 🎯 Layer 1: PRD (Product Requirements Document)
- **Concept:** Help users or couples instantly discover what movie to watch tonight using an intuitive, mobile-friendly card swipe deck (Swipe Right = Like, Swipe Left = Pass).
- **Core Capabilities:**
  1. Swipe Card Interface: Smooth interactive UI rendering high-res movie poster artwork, genre tags, and running time.
  2. Immediate Matchmaking Hub: When a movie is liked, query the server and output a celebratory modal stating: "Match Found! Showing in 1 hour in Hall 5, 12 seats left!".
  3. Action CTA Button: A prominent button that routes the user directly to the interactive cinema seat selector map (Cin Book).

### 📐 Layer 2: Technical Spec
- **State Architecture:** Manage active decks locally using transient arrays. On a positive swipe, send a background payload to the backend server.
- **Server Route:** Implement `POST /api/movies/match` expecting `userId` and `likedMovieIds`. The endpoint queries MongoDB to find showtimes matching the favored movie IDs that are scheduled for today and have available seats.
- **Edge Cases:** If a liked movie has completely sold out or its showtime passed during the swiping session, fallback gracefully by showing the next available match or recommending the closest alternative genre.

### 🗺️ Layer 3: Development Plan
- [x] Step 1: Establish the secure backend route `POST /api/movies/match` and hook it to the showtime query selector.
- [x] Step 2: Implement the swipe interaction card state deck using Tailwind CSS styling and clean gesture handling.
- [x] Step 3: Build the "Match Found" overlay modal container with its dynamic link routing directly to the Cin Book seating map.
- [x] Step 4: Execute a robust Self-Healing Execution Loop running validation tests on mock swiping sessions.

---
*Built with ❤️ for the ultimate cinematic experience.*
