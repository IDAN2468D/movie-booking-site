#!/usr/bin/env python3
"""
Cinema Orders & Revenue Analytics Helper
Calculates Gross Revenue, 18% Israeli VAT, Net Revenue, and AOV.
"""

import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description="Calculate cinema revenue metrics")
    parser.add_argument("--total-orders", type=int, default=120, help="Total completed orders")
    parser.add_argument("--gross-total", type=float, default=14400.0, help="Total gross revenue in ILS")
    args = parser.parse_args()

    net = round(args.gross_total / 1.18, 2)
    vat = round(args.gross_total - net, 2)
    aov = round(args.gross_total / (args.total_orders or 1), 2)

    print(f"Total Completed Orders: {args.total_orders}")
    print(f"Gross Revenue: ₪{args.gross_total:,.2f}")
    print(f"Net Revenue (excl. 18% VAT): ₪{net:,.2f}")
    print(f"Israeli VAT (18%): ₪{vat:,.2f}")
    print(f"AOV (ממוצע להזמנה): ₪{aov:.2f}")

if __name__ == "__main__":
    main()
