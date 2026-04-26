# 🏆 Skill: Dynamic Pricing & Loyalty (Feat-03)

Governs rewards, dynamic discounts, and user tiers.

## 🗝️ Core Principles
1. **Value Transparency**: Show users exactly how much they save.
2. **Gamification**: Use "Liquid Progress Bars" to show tier advancement.
3. **Dynamic Logic**: Pricing shifts based on demand, time, and loyalty level.

## 🛠️ Implementation Specs

### 1. Loyalty Tiers
- `Silver`: Base level.
- `Gold`: 10% discount + early access.
- `Diamond`: 20% discount + free snacks.

### 2. Pricing Engine
- Formula: `BasePrice * TierDiscount * DemandMultiplier`.
- Demand Multiplier: High (>1.2) for opening weekends; Low (<0.9) for Tuesday mornings.

### 3. Rewards Dashboard
- Use gold/silver gradients with holographic overlays.
- Interactive "Claim" buttons with particle effects.

## 🔍 Audit Checklist
- [ ] Is the final price calculation clearly broken down for the user?
- [ ] Does the "Points" counter increment with a smooth rolling animation?
- [ ] Is the "Diamond" tier UI sufficiently premium (intense refraction + gold glow)?
