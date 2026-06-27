# 💎 Skill: AI Concierge & Interaction (Feat-01)

Governs the AI Concierge assistant, interactive UI components, and natural language help.

## 🗝️ Core Principles
1. **Premium Presence (The Refractive Orb)**: 
   - The Concierge must be represented by a floating, translucent glass sphere in the bottom-left corner of the screen when closed.
   - It must utilize `backdrop-filter: blur(40px) saturate(200%)` and micro-borders (`border: 0.5px solid rgba(255,255,255,0.15)`).
   - The orb MUST support draggability (`drag` prop from Framer Motion) with boundaries so the user can relocate it dynamically.
2. **Context & Route Awareness**:
   - Suggestions and quick actions must change dynamically based on the active path/route (`usePathname()`):
     - `/checkout`: suggest treats and snacks or VIP seat upgrades.
     - `/rewards`: suggest loyalty point FAQs, trivia gaming, or catalog browsing.
     - `/tickets`: suggest showing the latest booking QR code or cancellations.
     - `/vip`: suggest subscription package details or VIP lounge features.
     - Default: suggest popular movie lookups, AI suggestions, and booking help.
3. **Conversational RTL**: Chat bubbles and inputs must be perfectly aligned for Hebrew (RTL) with unique layouts for user and assistant bubbles.

## 🛠️ Implementation Specs

### 1. Visual Identity & Orb States
- **Idle state**: Slow breathing motion with a pink/magenta background glow:
  `animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}`
- **Thinking state**: Fast, spinning cyan gradient representing active thought process:
  `animate={{ rotate: 360 }}` with a duration of `1.5s` repeating infinitely.
- **Speaking state**: Periodic radial pulses expanding outward from the orb.

### 2. NLP & Actions
- Map keywords to internal routes: "Book Joker" -> navigate to movie 475557.
- Support action commands in the AI model responses (e.g. `[ACTION:BOOK:ID]`) to automatically trigger the booking flow inside the client-side store.

## 🔍 Audit Checklist
- [ ] Is the Z-index high enough to float above all components (e.g. `z-50`)?
- [ ] Does it have a "Close" or "Minimize" button that resets the state?
- [ ] Are Hebrew responses wrapped in the standard Liquid Glass container?
- [ ] Do quick actions update dynamically as navigation changes?
