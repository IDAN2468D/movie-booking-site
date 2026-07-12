# Phantom Presence Remote Sync - Agent Stack Blueprint (v1.0)

## 1. PRD Layer: Core Objectives & Remote Co-Watching
- **Synchronized Cinematic Session**: Establishes a low-latency peer-to-peer WebRTC connection allowing users to co-watch movie trailers and sync playback controls simultaneously.
- **Holographic Grid Presence**: Renders an iridescent dynamic "ghost avatar" overlay on the interactive seat selection layout, broadcasting cursor coordinates and active selection bounding boxes to the remote peer in real-time.
- **Optimistic State Merging**: Merges remote cursor updates instantly into the rendering tree using performance-isolated components to prevent interrupting the local user's primary selection interaction loop.

## 2. Spec Layer: Technical Boundaries & Contracts
- **Atomic Line Constraint**: All remote state stores, WebRTC signal hooks, and display canvas nodes must strictly remain below the **200 Lines of Code (LOC)** limit.
- **Hardware Layer Locking**: Remote cursor trackers and halo glow animations must rely exclusively on `transform-gpu` and `will-change: transform, opacity` to guarantee fluid 120Hz tracking with zero browser page layout reflows.
- **Signaling Schema Validation**: Enforces exact structural contracts for ICE candidates, SDP session descriptions, and coordinates payload data.

### Zod WebRTC Signaling Validation Boundary (`lib/validations/phantom.ts`)
```typescript
import { z } from 'zod';

export const PeerSignalPayloadSchema = z.object({
  type: z.enum(['offer', 'answer', 'candidate', 'cursor_move']),
  sdp: z.string().optional(),
  candidate: z.any().optional(),
  coordinates: z.object({
    row: z.number(),
    col: z.number(),
    x: z.number(),
    y: z.number(),
  }).optional(),
});

export const SessionSyncSchema = z.object({
  sessionId: z.string().min(1),
  remoteUserId: z.string().min(1),
  playbackPosition: z.number().nonnegative(),
  isPlaying: z.boolean(),
});