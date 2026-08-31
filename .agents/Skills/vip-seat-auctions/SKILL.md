---
name: vip-seat-auctions
description: >-
  Dynamic real-time last-minute VIP seat auctions with bid countdowns and MongoDB change streams. Use when user asks for "michraz moshavim", "vip auction", "bidding", "moshav acharon", or last-minute VIP screening auctions. Provides gavel strike sound effects, bid countdown timers, and HMAC verification. Do NOT use for standard fixed ticket booking (use cinedna-feature-suite instead).
license: MIT
---

# VIP Seat Auctions & Bidding Engine

Architecture and implementation guidelines for dynamic real-time last-minute VIP seat auctions with countdown timers, gavel sound synthesis, and optimistic locking in CinePulse.

## Instructions

### Step 1: Auction Lifecycle & Timer
Manage auction states: `upcoming` -> `active` -> `closing` (under 60s) -> `settled`.
Bids placed within the final 30 seconds automatically extend the auction clock by +30s (anti-sniping protection).

### Step 2: Gavel Sound Synthesis (Web Audio API)
Play a sharp spatial gavel strike on incoming bids:
- 120Hz rapid decay transient + high-frequency wood resonance at 2400Hz.

### Step 3: Zod Schema & Security Boundaries
Validate bid increments (minimum +₪10 above highest bid) and authenticate users with NextAuth session checks.

## Examples

### Example 1: Place Bid on Prime VIP Seat
User says: "Place a bid of ₪85 on VIP Seat D4"
Actions:
1. Check current highest bid (₪75).
2. Validate bid satisfies minimum step (+₪10).
3. Update auction ledger and trigger spatial gavel sound.
Result: Real-time bid registered with optimistic countdown reset.

## Bundled Resources

### Scripts
- `scripts/auction_bid_calculator.py` -- Calculates minimum bid steps and sniper extension windows. Run: `python scripts/auction_bid_calculator.py --help`

### References
- `references/auction-bid-lifecycle.md` -- Complete state machine and anti-sniping rules.

## Gotchas

- Never allow client-side bid amount manipulation without server-side validation.
- All monetary amounts must be denominated in ILS (`₪`).

## Troubleshooting

### Error: "Bid too low"
Cause: A higher bid was placed concurrently by another user.
Solution: Refresh highest bid and prompt for new bid amount.
