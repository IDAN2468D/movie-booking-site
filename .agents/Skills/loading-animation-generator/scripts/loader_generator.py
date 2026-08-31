#!/usr/bin/env python3
"""
Loading Animation Snippet Generator
Outputs Tailwind CSS classes and props for the chosen loader variant.
"""

import argparse

def main():
    parser = argparse.ArgumentParser(description="Generate loading indicator config")
    parser.add_argument("--variant", choices=["spinner", "orbit", "pulse", "dots"], default="spinner")
    parser.add_argument("--color", type=str, default="#FF9F0A")
    parser.add_argument("--size", type=int, default=24)
    args = parser.parse_args()

    print(f"Variant: {args.variant}")
    print(f"Props: size={args.size}, color='{args.color}'")
    print(f"Component: <LoadingIndicator variant=\"{args.variant}\" size={{{args.size}}} color=\"{args.color}\" />")

if __name__ == "__main__":
    main()
