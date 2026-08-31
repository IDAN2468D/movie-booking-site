# VIP Auction Lifecycle Specification

## Auction States
1. `upcoming`: Pre-auction announcement with base price.
2. `active`: Bidding open, 10-minute master clock.
3. `closing`: Final 60 seconds with pulsing warning indicators.
4. `settled`: Winner determined, seat locked, payment authorized.

## Anti-Sniping Window
If a bid is registered with `timeRemainingSec < 30`, `timeRemainingSec` resets to `30`.
