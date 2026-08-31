# Technical Specification: CineSquad Smart Split & Sync

## 1. Objective & Flow
Real-time collaborative group booking room allowing friends to vote on movie showtimes, lock adjacent seats in sync, and split ticket payments automatically.

## 2. Zod Data Schema

```typescript
import { z } from "zod";

export const SquadMemberSchema = z.object({
  userId: z.string(),
  name: z.string(),
  avatarUrl: z.string().optional(),
  selectedSeat: z.string().nullable(),
  paymentStatus: z.enum(["pending", "authorized", "completed", "failed"]),
  shareAmount: z.number().positive(),
});

export const SquadRoomSchema = z.object({
  roomId: z.string().uuid(),
  hostUserId: z.string(),
  movieId: z.string(),
  showtimeId: z.string(),
  members: z.array(SquadMemberSchema),
  expiresAt: z.date(),
  status: z.enum(["lobby", "seats_selected", "payment_pending", "confirmed"]),
});

export type SquadRoom = z.infer<typeof SquadRoomSchema>;
```

## 3. Real-time Communication Architecture
- Server-Sent Events (SSE) or WebSockets channel per `roomId`.
- Optimistic UI seat locking with 120-second timeout lock.
