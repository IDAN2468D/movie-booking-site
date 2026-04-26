# 🎫 Skill: Ticketing & Transaction Engine (Eng-02)

Governs the core booking logic, seat selection, QR generation, and PDF export.

## 🗝️ Core Principles
1. **Real-time Integrity**: Prevent double-booking with optimistic UI + server-side locks.
2. **Premium Visuals**: Tickets must look like high-end collectibles (Liquid Glass).
3. **Robust RTL**: PDF and QR metadata must handle Hebrew correctly.

## 🛠️ Implementation Specs

### 1. Seat Selection
- Use `SVG` for seat maps to ensure scalability.
- States: `available` (cyan), `selected` (gold), `booked` (muted grey).

### 2. QR & PDF Generation
- **QR**: Store a JWT-signed booking ID.
- **PDF**: Use high-quality fonts (`Outfit`) and ensure Hebrew text isn't reversed.

### 3. Payment Flow
- **Simulation**: Handle `pending`, `success`, and `failed` states with distinct animations.
- **Confetti**: Trigger on success for positive reinforcement.

## 💎 Liquid Glass Audit
- [ ] Does the ticket have a refractive "cutout" or "perforation" effect?
- [ ] Is the QR code overlayed on a glass panel?
- [ ] Are animations between selection steps smooth and spring-based?

---
> [!IMPORTANT]
> Always verify seat availability one last time at the moment of payment execution.
