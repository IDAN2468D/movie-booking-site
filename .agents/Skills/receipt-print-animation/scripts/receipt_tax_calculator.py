#!/usr/bin/env python3
"""
Receipt Tax & Subtotal Breakdown Helper
Calculates receipt line items with Israeli 18% VAT included.
"""

import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description="Calculate receipt tax breakdown")
    parser.add_argument("--gross-total", type=float, default=155.0, help="Total payment amount in ILS")
    args = parser.parse_args()

    net_subtotal = round(args.gross_total / 1.18, 2)
    vat_18 = round(args.gross_total - net_subtotal, 2)

    print(f"Gross Total (לתשלום): ₪{args.gross_total:.2f}")
    print(f"Net Subtotal (לפני מע״מ): ₪{net_subtotal:.2f}")
    print(f"18% Israeli VAT (מע״מ 18%): ₪{vat_18:.2f}")

if __name__ == "__main__":
    main()
