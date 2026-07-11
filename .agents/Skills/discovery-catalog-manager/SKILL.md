---
name: Discovery Catalog Manager
description: Instructs the agent on how to architect, design, and style the Semantic Discovery Catalog leveraging Persona Vectors.
---
# Skill: Discovery Catalog Manager (Sprint 11)

## Objective
Implement a personalized Discovery Catalog leveraging the `Persona Vector` and `CognitiveContext` established in Sprint 10. The catalog must visually reflect the "Liquid Glass 4.0" style and dynamically filter movies using semantic/persona-based logic rather than generic sorting.

## 1. Data Architecture
- **Server Route**: Implement `app/api/movies/semantic-catalog/route.ts`.
- **Validation**: Utilize Zod for validating the incoming persona request payload.
- **Logic**: Simulate or run semantic filtering over movie catalogs to map movies to the Persona Vector (e.g. prioritizing Sci-Fi).

## 2. Component Architecture
- **Context/Store**: Implement `hooks/useDiscoveryContext.ts` to manage the catalog state and intercept `DiscoveryJump` events triggered by the Concierge.
- **MovieCarousel**: Implement `components/discovery/MovieCarousel.tsx` (or `src/components/discovery/MovieCarousel.tsx`).
- **Liquid Glass 4.0 Layout**: The carousel must support fluid 120Hz swiping gestures using `framer-motion` (`drag="x"`). Must include `backdrop-blur-xl`, `border-white/10`, and morphing box-shadows on hover.

## 3. Integration & Flow
- The Cognitive Concierge (`MovieCriticDrawer`) should emit a CustomEvent (`DiscoveryJump`) carrying the suggested category payload.
- `MovieCarousel` listens for this event and snaps into view or highlights the correct genre tab automatically.
