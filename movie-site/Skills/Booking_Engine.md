# 🎫 Booking & Transaction Engine

Coordinates seat reservations, real-time locking, and ticket generation with RTL support.

## 🪑 Real-Time Seat Selection

### Interactive SVG Map
The seat layouts are dynamically rendered using inline vector elements (`svg`), facilitating fast responsive resizing and absolute precision on mobile screens.

#### Seat Status Indicators:
- `Available` (`#0AEFFF` - Neon Cyan)
- `Selected` (`#FF9F0A` - Gold)
- `Booked` (Muted glass panel: `rgba(255, 255, 255, 0.03)` fill, `rgba(255, 255, 255, 0.12)` stroke, group `opacity-40`) to remain beautifully visible as a locked/disabled seat.

### Optimistic UI & Server Locks
1. **Client selection**: Instant feedback using Zustand stores.
2. **Optimistic booking**: Temporarily flags chosen seats in local memory.
3. **Database Guard**: Server actions verify seat availability one last time before executing MongoDB insertion.
4. **Legacy Date Fallback**: Database queries and availability checks handle legacy documents where `date` is undefined/missing by matching the day portion of `createdAt` formatted as `toLocaleDateString('he-IL')` against the selected query date.

---

## 🎟️ Ticket Generation & Exports

### Signed QR Collectibles
Tickets are structured like digital trading cards.
- **Glass Container Base**: Translucent panel layout.
- **QR Payloads**: Contains a JWT signed payload of `{ bookingId, userId, timestamp }` which can be validated by scanners at the theater.

### RTL PDF Rendering (Hebrew Support)
PDF generation uses `pdfkit`. To prevent Hebrew letters and phrases from printing backward in PDF documents:
1. Reverse directional text strings using a custom helper (`reverseHebrewString`).
2. Map lines correctly with right-to-left layout alignments.
3. Feed true-type Arabic/Hebrew fonts (`Rubik`/`Inter`) directly into the generator.
