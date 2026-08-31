#!/usr/bin/env python3
"""
Liquid Glass Token Helper
Outputs optimal Tailwind CSS classes for Liquid Glass 4.0 Pro cards.
"""

import argparse

def main():
    parser = argparse.ArgumentParser(description="Generate Liquid Glass Tailwind classes")
    parser.add_argument("--accent", choices=["cyan", "amber", "purple", "emerald"], default="cyan")
    args = parser.parse_args()

    color_map = {
        "cyan": "border-cyan-500/30 shadow-[0_20px_60px_rgba(6,182,212,0.25)]",
        "amber": "border-amber-500/30 shadow-[0_20px_60px_rgba(245,158,11,0.25)]",
        "purple": "border-purple-500/30 shadow-[0_20px_60px_rgba(168,85,247,0.25)]",
        "emerald": "border-emerald-500/30 shadow-[0_20px_60px_rgba(16,185,129,0.25)]",
    }

    base = "p-6 rounded-[32px] bg-black/60 backdrop-blur-3xl"
    print(f"Tailwind: {base} {color_map[args.accent]}")

if __name__ == "__main__":
    main()
