#!/usr/bin/env python3
"""
Electric Border SVG Scale & Padding Helper
Calculates container padding and SVG scale factors.
"""

import argparse

def main():
    parser = argparse.ArgumentParser(description="Calculate electric border parameters")
    parser.add_argument("--border-width", type=int, default=2, help="Border width in px")
    parser.add_argument("--glow-color", type=str, default="#06B6D4", help="Glow hex color")
    args = parser.parse_args()

    print(f"Border Width: {args.border_width}px")
    print(f"Glow Color: {args.glow_color}")
    print(f"Recommended Drop-Shadow: shadow-[0_0_25px_{args.glow_color}40]")

if __name__ == "__main__":
    main()
