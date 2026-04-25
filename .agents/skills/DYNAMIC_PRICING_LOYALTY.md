# 💰 Dynamic Pricing & Loyalty Skill (v1.0)

This skill governs the financial logic, discounts, and user reward systems.

## 🗝️ Core Principles
1. **Transparency**: Always show the "Original Price" vs "Discounted Price" clearly.
2. **Atomic Points**: User points must be updated via ACID transactions (MongoDB).
3. **Urgency without Dark Patterns**: Use countdowns for expiring offers ethically.

## 🛠️ Implementation Specs

### 1. Dynamic Pricing Logic
Prices should vary based on metadata:
- **Morning/Matinee**: -20%
- **Weekend/Prime Time**: +15%
- **Member Discount**: -10%

### 2. Loyalty Points System
- **Earn Rate**: 1 point per 10 NIS spent.
- **Redemption**: 100 points = 10 NIS discount.
- **Validation**: Server-side check before applying any discount to prevent client-side manipulation.

### 3. Coupon Engine
- Use Zod to validate coupon strings.
- Support for: `PERCENT_OFF`, `FIXED_AMOUNT`, `BUY_1_GET_1`.

## 🔍 Audit Checklist
- [ ] Is the final total calculated server-side? (MANDATORY)
- [ ] Does the user get a "Points Earned" animation after checkout?
- [ ] Are expired coupons handled with a helpful error message?
