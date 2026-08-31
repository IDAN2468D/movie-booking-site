#!/usr/bin/env python3
"""
CineSnack Combo Discount & VAT Calculator
Calculates combo total prices with bundle discount and 18% Israeli VAT.
"""

import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description="Calculate CineSnack combo prices")
    parser.add_argument("--popcorn-price", type=float, default=32.0, help="Popcorn price in ILS")
    parser.add_argument("--drink-price", type=float, default=18.0, help="Drink price in ILS")
    parser.add_argument("--discount-rate", type=float, default=0.15, help="Bundle discount rate (0.15 = 15%)")
    args = parser.parse_args()

    subtotal = args.popcorn_price + args.drink_price
    discount_amount = subtotal * args.discount_rate
    final_price = round(subtotal - discount_amount, 2)
    vat_amount = round(final_price * (18 / 118), 2)

    print(f"Subtotal: ₪{subtotal:.2f}")
    print(f"Discount ({args.discount_rate * 100:.0f}%): -₪{discount_amount:.2f}")
    print(f"Final Total (incl. 18% VAT): ₪{final_price:.2f} (VAT: ₪{vat_amount:.2f})")

if __name__ == "__main__":
    main()
