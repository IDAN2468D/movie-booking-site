# 👥 Skill: Social Cinema (Social-01)

## Overview
Social Cinema enables group planning and collaborative booking. It allows users to invite friends to a movie and automatically split costs.

## Core Directives
1. **Frictionless Sharing**: Generate unique, refractive QR codes for individual tickets within a group booking.
2. **Split Pay Logic**:
   - Primary user initiates the booking.
   - Secondary users receive "payment pending" notifications.
   - Integration with mock digital wallets (Apple Pay / Google Pay style).
3. **Group Chat**: A lightweight, ephemeral chat for the group during the planning phase.

## Implementation Standards
- **Store**: `lib/store.ts` must track `groupMembers` and `paymentStatus`.
- **UI**: Use "Glass Panels" with frosted glass borders for group selection.
- **Privacy**: Individual seat numbers are hidden until payment is confirmed.

## Design Tokens
- **Connected State**: Cyan pulsing border for group avatars.
- **Payment Success**: Gold "Confetti" particles (using `canvas-confetti` or CSS).
