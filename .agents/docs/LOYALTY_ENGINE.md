# Loyalty Integration: Automated Scratch Card Reward Engine (v4.8)

This document describes the architectural details of the Scratch Card Reward Engine and its integration with the platform's loyalty systems.

## Overview

The Automated Scratch Card Reward Engine is designed to incentivize user engagement and reward customer loyalty. When users complete specific actions (such as booking a ticket or reaching a new loyalty tier), they are granted a temporary scratch card containing a randomized premium reward.

## Schema Configuration

To support scratch card rewards without introducing race conditions or double-spending, the `Users` database schema includes the `pendingScratchReward` field:

```typescript
pendingScratchReward: z.object({
  rewardId: z.string(),
  type: z.enum(['discount_percentage', 'fixed_discount', 'free_ticket']),
  value: z.number(),
  applied: z.boolean().default(false),
  expiresAt: z.date()
}).optional()
```

## Concurrency and Security Safeguards

1. **Atomic Mutations**: Claims and application of rewards must use MongoDB atomic operator checks (e.g. `{ $set: { "pendingScratchReward.applied": true } }` on filters matching `applied: false` and matching `rewardId`).
2. **Expiration Enforcement**: Queries that retrieve or evaluate active rewards must explicitly verify `expiresAt > new Date()`.
3. **Validation Bound**: Zod models ensure data integrity and type-safe schema bounds.
