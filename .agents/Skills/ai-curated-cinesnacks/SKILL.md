---
name: ai-curated-cinesnacks
description: >-
  AI movie vibe matching for popcorn combos, concession pairings, and luxury cinema dining. Use when user asks for "hazmanat popcorn", "miznon", "concession combo", "ochel bakolnoa", or food recommendations matched to movie genres. Provides calorie estimates, dietary tags, and smart snack bundles. Do NOT use for seat selection or booking tickets (use cinedna-feature-suite instead).
license: MIT
---

# AI Curated CineSnacks & Cinema Dining Pairings

Architecture and implementation guidelines for AI-curated concession pairings, mood-based popcorn blends, and luxury cinema dining for CinePulse.

## Instructions

### Step 1: Movie Genre & Mood Analysis
Analyze the active movie's genre, intensity rating, and duration to select optimal snack categories:
- Action / Sci-Fi: High-energy spicy popcorn, nachos, chilled energy drinks.
- Drama / Romance: Gourmet truffle popcorn, artisan wine, hand-crafted chocolates.
- Family / Animation: Sweet caramel popcorn, fruit gummies, slushies.

### Step 2: Zod Schema Validation
Validate all concession orders through strict Zod contracts with ILS currency formatting (`₪`).

### Step 3: Liquid Glass 4.0 Pro Smart Tray UI
Display items with dynamic 3D cards, real-time total updates, and 1-click cart addition.

## Examples

### Example 1: Match Snacks for Sci-Fi Epic
User says: "What snacks pair best with Dune Part 2?"
Actions:
1. Identify movie genre: Sci-Fi / Epic (Intense, 166 min).
2. Recommend Spice-infused Popcorn Combo + Large Cold Brew.
3. Calculate bundle discount (-15%).
Result: Smart CineSnack pairing card with 1-click booking addition.

## Bundled Resources

### Scripts
- `scripts/concession_calculator.py` -- Calculates combo discounts and dietary calories. Run: `python scripts/concession_calculator.py --help`

### References
- `references/concession-pairing-matrix.md` -- Complete genre to snack pairing table.

## Gotchas

- Concession items must always state Kosher certification (Kashrut) and allergen info.
- Prices must be displayed in Israeli Shekels (`₪`) including 18% VAT.

## Troubleshooting

### Error: "Combo out of stock"
Cause: A bundle item is unavailable at the selected cinema branch.
Solution: Automatically substitute with the closest equivalent item.
