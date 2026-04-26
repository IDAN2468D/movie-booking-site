# 💎 Skill: AI Concierge & Interaction (Feat-01)

Governs the AI Concierge assistant, interactive UI components, and natural language help.

## 🗝️ Core Principles
1. **Premium Presence**: The Concierge is a refractive orb with organic motion.
2. **Context Awareness**: Suggestions must change based on the active route.
3. **Conversational RTL**: Chat bubbles and inputs must be perfectly aligned for Hebrew.

## 🛠️ Implementation Specs

### 1. Visual Identity
- **The Orb**: `backdrop-filter: blur(40px)`.
- **States**: `Idle` (Breathing), `Thinking` (Rotating Gradient), `Speaking` (Pulse).

### 2. Interactive Prompts
- Suggest popcorn on `Checkout`.
- Suggest "Similar Movies" on `MoviePage`.
- Offer "Ticket History" on `Profile`.

### 3. NLP & Actions
- Map keywords to internal routes: "Book Joker" -> navigate to movie 475557.

## 🔍 Audit Checklist
- [ ] Is the Z-index high enough to float above all components?
- [ ] Does it have a "Close" or "Minimize" state that feels natural?
- [ ] Is the Hebrew text wrapped in the standard Liquid Glass container?

---
> [!TIP]
> Use `framer-motion`'s `drag` prop to allow users to move the concierge around their screen.
