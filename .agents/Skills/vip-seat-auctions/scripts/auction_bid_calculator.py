#!/usr/bin/env python3
"""
VIP Auction Bid & Anti-Sniping Calculator
Calculates minimum acceptable next bid and anti-sniping extension windows.
"""

import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description="Calculate auction next minimum bid")
    parser.add_argument("--current-bid", type=float, default=75.0, help="Current highest bid in ILS")
    parser.add_argument("--min-step", type=float, default=10.0, help="Minimum bid increment in ILS")
    parser.add_argument("--time-left", type=int, default=25, help="Seconds remaining on clock")
    args = parser.parse_args()

    min_next = args.current_bid + args.min_step
    new_time = max(args.time_left, 30) if args.time_left < 30 else args.time_left

    print(f"Current Bid: ₪{args.current_bid:.2f}")
    print(f"Next Minimum Bid: ₪{min_next:.2f}")
    print(f"Anti-Sniping Clock Reset: {new_time}s remaining")

if __name__ == "__main__":
    main()
