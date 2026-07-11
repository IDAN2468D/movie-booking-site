---
name: Loyalty Manager
description: Instructs the agent on how to architect, design, and style the Pulse Gamification layer.
---
# Skill: Loyalty Manager (Sprint 13)

## Objective
Implement a gamification and loyalty layer that rewards users based on their booking patterns, utilizing the existing "Cognitive Context" from Sprint 10 and the One-Tap Bookings from Sprint 12.

## 1. Gamification Logic (Pulse Points)
- **Algorithm**: A user gains "Pulse Points" upon completing a booking (e.g. via `processSecureBooking`). 
- **Tiers**: Bronze -> Silver -> Gold -> Liquid Elite.
- **UI Reflection**: The more points/higher tier, the Concierge's emissive glow shifts from standard cyan/violet to vibrant Gold/Liquid Elite styling.

## 2. Schema Architecture
- **TicketVault Schema**: Store finalized bookings representing secure digital tickets that can be retrieved in an offline-ready format. Includes mock QR code paths or UUIDs.
- **Loyalty Sync**: Update the existing `Loyalty.ts` schema/logic if needed to bind Pulse Points directly to the ticket engine.

## 3. UI Components
- **LoyaltyBadge**: A Liquid Glass 4.0 status badge component that indicates the active tier.
- **TicketVaultWidget**: A high-performance card displaying active user bookings safely.
