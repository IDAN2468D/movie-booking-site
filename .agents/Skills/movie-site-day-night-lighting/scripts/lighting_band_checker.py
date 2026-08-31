#!/usr/bin/env python3
"""
Day/Night Lighting Band Checker Helper
Outputs the active cinema lighting theme for a given hour.
"""

import argparse
import sys

def get_band(hour: int) -> str:
    if 5 <= hour < 8:
        return "dawn"
    elif 8 <= hour < 18:
        return "day"
    elif 18 <= hour < 21:
        return "sunset"
    else:
        return "night"

def main():
    parser = argparse.ArgumentParser(description="Check cinema lighting band")
    parser.add_argument("--hour", type=int, default=12, help="Current hour (0-23)")
    args = parser.parse_args()

    band = get_band(args.hour)
    print(f"Hour: {args.hour:02d}:00")
    print(f"Active Theme Band: {band.upper()}")

if __name__ == "__main__":
    main()
