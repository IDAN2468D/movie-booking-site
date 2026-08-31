#!/usr/bin/env python3
"""
Neon Card CSS Generator Helper
Outputs keyframe CSS rules for rotating conic gradients.
"""

import argparse

def main():
    parser = argparse.ArgumentParser(description="Generate neon card CSS snippet")
    parser.add_argument("--duration", type=float, default=4.0, help="Rotation duration in seconds")
    args = parser.parse_args()

    print(f"Rotation Duration: {args.duration}s")
    print(f"CSS Animation: animate-[spin_{args.duration}s_linear_infinite]")

if __name__ == "__main__":
    main()
