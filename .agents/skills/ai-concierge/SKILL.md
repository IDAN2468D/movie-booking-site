# 💎 Skill: AI Concierge (Concierge-01)

## Overview
The AI Concierge is a persistent, floating UI element that serves as a natural language interface for the movie booking platform. It handles seat selection, snacks, and personalized recommendations.

## Core Directives
1. **Visual Identity**: The Concierge must be rendered as a **Refractive Glass Orb**. 
   - Use `backdrop-filter: blur(40px)`.
   - Apply a rotating conic-gradient for the "thinking" state.
   - Use `framer-motion` for organic, floating movement.
2. **Proactive Assistance**: The agent should suggest actions based on the current page (e.g., "Would you like to add popcorn?" on the Checkout page).
3. **Natural Interaction**: Supports voice-to-text (simulated) and natural language queries for movie discovery.

## Implementation Standards
- **Component**: `components/ai/AIConcierge.tsx`.
- **State**: Persistent across routes using a global Zustand store.
- **NLP**: Uses a simple heuristic engine for now, but architected for future LLM integration.

## Design Tokens
- **Idle State**: Subtle breathing animation, 20% opacity.
- **Active State**: Glowing cyan/gold border, 100% opacity, intense refraction.
