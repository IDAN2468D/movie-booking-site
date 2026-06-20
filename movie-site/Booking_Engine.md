# 🎫 Booking & Transaction Engine

Coordinates seat reservations, real-time locking, and ticket generation with RTL support.

## 🪑 Real-Time Seat Selection

### Interactive SVG Map
The seat layouts are dynamically rendered using inline vector elements (`svg`), facilitating fast responsive resizing and absolute precision on mobile screens.

#### Seat Status Indicators:
- `Available` (`#0AEFFF` - Neon Cyan)
- `Selected` (`#FF9F0A` - Gold)
- `Booked` (`#2D2D2D` - Muted Charcoal)

### Optimistic UI & Server Locks
1. **Client selection**: Instant feedback using Zustand stores.
2. **Optimistic booking**: Temporarily flags chosen seats in local memory.
3. **Database Guard**: Server actions verify seat availability one last time inside a transaction lock before executing MongoDB insertion.

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
