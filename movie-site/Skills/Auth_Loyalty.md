# 🔐 User Authentication & Loyalty Points

Secures user access and rewards engagement via automated point calculation ledgers.

## 🔑 Authentication Architecture
- **Provider**: NextAuth.js (configured inside `/app/api/auth/[...nextauth]`).
- **Strategy**: JSON Web Tokens (JWT) for secure session persistence.
- **Database Adapter**: `@next-auth/mongodb-adapter` connecting to the native MongoDB collection.
- **Form Validation**: Zod guards registration inputs (email syntax, password requirements).

---

## 💎 Loyalty Point Ledger

### Points Formula
Points are calculated and awarded automatically on successful booking transactions:
- **Accrual**: 10% of total price is converted to loyalty points (e.g., ₪100 purchase = 10 points).
- **VIP multiplier**: Users with a VIP membership receive a `1.5x` point multiplier.

### Ledger Collection Schema
```json
{
  "_id": "ObjectId",
  "userId": "string",
  "pointsDelta": "number", // positive for accrual, negative for redemption
  "reason": "string", // "TICKET_PURCHASE", "CONCESSION_UPGRADE", etc.
  "bookingId": "string (optional)",
  "timestamp": "Date"
}
```

### Concessions & Upgrades
Points can be redeemed during checkout for food and drinks:
- **Popcorn**: 50 points.
- **Soft Drink**: 30 points.
- **Seat Upgrade (Standard -> VIP)**: 100 points.
