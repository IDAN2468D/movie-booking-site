#!/usr/bin/env python3
"""
Web Audio Frequency & Filter Calculator Helper
Calculates distance roll-off and lowpass filter frequencies based on seat coordinates.
"""

import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description="Calculate audio filter cutoff for cinema hall")
    parser.add_argument("--distance-y", type=float, default=0.5, help="Normalized distance from screen (0=front, 1=back)")
    args = parser.parse_args()

    cutoff_hz = round(18000 - args.distance_y * 7000)
    reverb_rt60 = round(0.45 + args.distance_y * 0.25, 2)

    print(f"Distance Y: {args.distance_y}")
    print(f"Recommended LowPass Filter Cutoff: {cutoff_hz}Hz")
    print(f"Estimated Reverb RT60: {reverb_rt60}s")

if __name__ == "__main__":
    main()
