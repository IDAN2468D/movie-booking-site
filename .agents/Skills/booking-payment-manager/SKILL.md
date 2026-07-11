---
name: Booking Payment Manager
description: Instructs the agent on how to architect, design, and style the One-Tap Transaction Workflow for frictionless booking.
---
# Skill: Booking Payment Manager (Sprint 12)

## Objective
Implement an AI-driven, frictionless booking and payment flow. The user should be able to complete a booking entirely through the Concierge interface.

## 1. State Machine Schema
- **Transitions**: 
  - `IDLE` -> `SEAT_SELECT` -> `ADD_ONS` -> `PAYMENT_PENDING` -> `SUCCESS` or `FAILED`.
- **Backend Enforcements**: Zod payload validations must secure every state transition via Server Actions.

## 2. Server Action: processSecureBooking
- **Logic**: Simulates a Stripe-ready payment gateway interaction.
- **Rollback Mechanism**: If payment fails, encounters an error, or times out, the backend must instantly delete the corresponding `SeatLock` document (or change status back to `held` if in a group setting) via MongoDB, clearing the TTL lock.

## 3. UX Implementation (Concierge Integration)
- **BookingConfirmationWidget**: A Liquid Glass overlay that appears *inside* the Concierge UI upon a successful transaction.
- **Haptic & Visual Pulse**: Upon transition to `SUCCESS`, the UI must trigger a localized kinetic explosion (Framer Motion) and emit a deep amber/emerald success pulse on the component boundary.
