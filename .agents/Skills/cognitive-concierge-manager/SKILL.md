---
name: Cognitive Concierge Manager
description: Instructs the agent on how to architect, design, and style the Cognitive AI Concierge upgrade for context-aware, proactive assistance.
---
# Skill: Cognitive Concierge Manager (Sprint 10)

## Objective
Upgrade the existing simple AI Concierge (`InSiteMovieCriticAgent`) into a "Cognitive Agent" capable of context-aware, proactive assistance while adhering to the Liquid Glass 4.0 standard.

## 1. AppState Integration
- **Context Injection**: The Concierge will dynamically ingest the active route, layout view (e.g., Seat Map vs Movie Swipe), and active global state via Zustand `useGlobalStore`. 
- **Active Context Hook**: Create a `useCognitiveContext()` hook to aggregate the current URL, selected seats, applied flash offers, and ongoing swipe sessions. This context vector is appended to the LLM backend proxy payload silently, passing rich environment data without user intervention.

## 2. Predictive Engine Logic
- **Historical Query Optimization**: To prevent context window bloat and performance degradation, MongoDB queries for user history (past bookings, genre affinity) must be summarized by a server-side aggregation pipeline. The backend will return a condensed "User Persona Vector" (e.g., `["Sci-Fi Fan", "Prefers Aisle Seats", "Frequent Weekend Booker"]`).
- **Prompt Injection**: The Persona Vector and active AppState are injected into the LLM system prompt implicitly on the server side. The LLM response will be naturally aware of the user's past actions and current screen context without requiring large JSON dumps into the prompt.

## 3. UI Integration & Feedback
- **State-Driven Emissive Glow**: The Concierge UI node (Drawer/Floating Avatar) will reflect its internal processing states using Liquid Glass hardware-accelerated animations:
  - **Idle**: Subtle breathing animation (`box-shadow: 0 0 15px rgba(255,255,255,0.1)`).
  - **Listening/Thinking**: Rapid high-frequency border pulse with shifting cyan-violet gradients (`animate-pulse` on `border-image`).
  - **Proactive Suggestion Ready**: Amber/Gold emissive pulse indicating an urgent, high-value insight (e.g., "Flash offer on your favorite seat!").
- **Zero-Reflow Transitions**: All visual state changes must rely exclusively on CSS variables, `opacity`, and `transform`. Modifying structural layout boundaries (`top`, `left`, `margin`, `width`) inside the rendering loop is strictly prohibited.