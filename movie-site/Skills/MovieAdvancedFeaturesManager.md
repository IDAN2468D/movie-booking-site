# Skill: MovieAdvancedFeaturesManager
## Core System Domain: Advanced Movie Booking Operations & Experiential UX

This skill dictates the technical blueprints, interface boundary invariants, database structures, and runtime loops for the advanced experiential features of the Movie Booking Application. All agent operations dealing with these modules must enforce these rules natively.

---

## 🎨 1. UI/UX: Cinematic Ambient Glass (Dynamic Theme Injector)
### Architectural Blueprint
* **Objective:** Real-time dynamic theme updates driven by movie genre/metadata across the entire view tree without causing layout layout recalculations (Layout Reflows).
* **Engineering Standards:**
  1. Enforce strict 120Hz animation fluidity by utilizing hardware-accelerated transitions via CSS `will-change: background-color, backdrop-filter` or Native React Reanimated nodes.
  2. The backdrop matrix must adhere to Liquid Glass 3.0 specification: `backdrop-blur(24px) saturate(180%)`.
* **Theme Tokens Matrix:**
  * `Sci-Fi / Cyberpunk`: Background: `bg-gradient-to-b from-purple-900/40 to-black/90`. Accent: Violet Glowing Pulse (`#A855F7`).
  * `Horror / Thriller`: Background: `bg-gradient-to-b from-red-950/40 to-black/95`. Accent: Deep Crimson Glow (`#991B1B`).
  * `Comedy / Drama`: Background: `bg-gradient-to-b from-amber-900/30 to-slate-950/90`. Accent: Amber Liquid Gold (`#F59E0B`).

---

## 🤝 2. Core Feature: AI Movie Swipe Matcher (Group Session)
### Product Intent (PRD)
Allows multiple interconnected users in a shared session to swipe on a discovery catalog of movies. When an intersection occurs (Match), all participants are atomically redirected to a unified seat allocation screen.

### Technical Blueprint & Data Contract (MongoDB Schema)
* **Collection:** `swipe_sessions`
```json
{
  "_id": "ObjectId",
  "sessionId": "String (Unique, 6-digit alphanumeric)",
  "hostUserId": "ObjectId",
  "participants": ["ObjectId"],
  "sessionStatus": "String ('active' | 'matched' | 'expired')",
  "catalogFilters": { "genres": ["String"], "date": "Date" },
  "swipes": [
    {
      "userId": "ObjectId",
      "movieId": "ObjectId",
      "direction": "String ('like' | 'dislike')",
      "timestamp": "Date"
    }
  ],
  "matchedMovieId": "ObjectId (Nullable)"
}