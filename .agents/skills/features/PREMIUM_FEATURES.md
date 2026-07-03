# Premium Liquid Glass 3.0 Features - Core Specification

## 1. Global Architectural Constraints
- **Atomic Structural Isolation**: No single component file may exceed 200 lines. Break down matrix rows, particle emitters, and visual shards into isolated sub-components.
- **Zero-Reflow Animation Policy**: Layout modifications using `top`, `left`, `margin`, or dynamic CSS custom variable invalidations during rendering loops are strictly forbidden. All mouse tracking, cascading drops, and spatial expansions must utilize hardware-accelerated GPU transforms via Framer Motion (`style={{ x, y, rotateX, rotateY }}`).
- **Strict State Consumption**: Zustand store objects must be accessed exclusively through shallow-baked atomic selectors to eliminate parent-to-child layout re-renders.
- **Boundary Schema Protocols**: Every client-server interaction or external data ingestion layer must validate structures via Zod schemas and wrap the response payload inside the Result Pattern: `{ success: boolean; data?: any; error?: string }`.

## 2. Component Specifications

### Feature 1: "Aura" Mood-Based Discovery (`NeuralMoodOrbit.tsx`)
- **Objective**: Converts the search mechanism into a fluid, morphing liquid orb with deep refractive depth responding to user mood manipulation.
- **Mechanics**: Implements a continuous SVG path warping matrix using Framer Motion combined with dynamic `border-radius` morphing configurations. Dragging nodes toward the central gravity well applies an optimistic visual squish effect without blocking UI threads.

### Feature 2: "Prism" Spatial Seat Selection (`SeatMap.tsx`)
- **Objective**: Transforms the theater layout into a 3D perspective glass canopy floor with interactive light gradients.
- **Mechanics**: 
  - Projects the theater map grid via 3D matrix transforms (`rotateX(30deg) rotateZ(-5deg)`).
  - Implements seat cursor tracking using Framer Motion `useMotionValue` directly updating inline transforms instead of standard layout recalculations.
  - Selecting a seat fires a concentric scale wave propagation using Framer Motion to adjacent matrix elements. Occupied seats remain legible but muted using `opacity-40` with an explicit stroke.

### Feature 3: "The Kinetic Ticket" (`QuantumTicket.tsx`)
- **Objective**: A premium, generative 3D collectible asset tailored dynamically to movie metadata streams.
- **Mechanics**: Leverages 3D mouse parallax tracking through `useTransform` vectors. The entrance sequence initializes a "shatter-to-assemble" phase where independent structural vector shards translate from random screen points into a single glass-frost container enclosing a hidden QR code.

### Feature 4: "Specular Currency Cascade Engine" (`CurrencyCascade.tsx`)
- **Objective**: A high-performance, GPU-accelerated particle explosion running on successful checkout settlement.
- **Mechanics**: Bound to the Zustand transaction completion state. Instantiates a dynamic matrix of falling glass currency bills formatted with `backdrop-blur-md saturate-[150%] bg-white/10 border border-white/20` transitioning exclusively on hardware-accelerated x/y tracks.