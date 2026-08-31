#!/usr/bin/env python3
"""
CineDNA & Acoustic Metric Calculator Helper Script
Calculates acoustic immersion scores and stylistic match coefficients.
"""

import argparse
import sys
import math

def calculate_immersion(norm_x: float, norm_y: float) -> int:
    center_dist = math.hypot(norm_x * 1.2, (norm_y - 0.55) * 1.5)
    return max(40, min(99, round(99 - center_dist * 45)))

def main():
    parser = argparse.ArgumentParser(description="Calculate CineDNA immersion scores")
    parser.add_argument("--seat-x", type=float, default=0.0, help="Normalized X coordinate (-1 to 1)")
    parser.add_argument("--seat-y", type=float, default=0.5, help="Normalized Y coordinate (0 to 1)")
    args = parser.parse_args()

    score = calculate_immersion(args.seat_x, args.seat_y)
    rating = "EXCELLENT" if score >= 92 else "OPTIMAL" if score >= 80 else "GOOD"
    print(f"Immersion Score: {score}% | SweetSpot Rating: {rating}")

if __name__ == "__main__":
    main()
