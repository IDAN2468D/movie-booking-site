#!/usr/bin/env python3
"""
Spoiler Risk Analyzer Helper
Checks text content for high-risk spoiler terms in Hebrew and English.
"""

import argparse
import sys

SPOILER_KEYWORDS = [
    "סוף", "מת", "מתה", "הרוצח", "בסוף מסתבר", "הסוף", "cameo", "death", "dies", "ending", "killer", "plot twist"
]

def main():
    parser = argparse.ArgumentParser(description="Analyze text for spoiler risk")
    parser.add_argument("--text", type=str, required=True, help="Text to analyze")
    args = parser.parse_args()

    found = [kw for kw in SPOILER_KEYWORDS if kw in args.text.lower()]
    risk = "HIGH" if len(found) > 1 else "MEDIUM" if len(found) == 1 else "SAFE"

    print(f"Spoiler Risk: {risk}")
    print(f"Detected Keywords: {found if found else 'None'}")
    print(f"Mask Recommended: {'YES' if risk != 'SAFE' else 'NO'}")

if __name__ == "__main__":
    main()
