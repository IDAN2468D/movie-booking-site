#!/usr/bin/env python3
"""
Hebrew RTL & Unicode RLM Wrapper Helper
Wraps text blocks with Unicode RLM (\\u200F) marks and RTL container tags.
"""

import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description="Wrap text in Hebrew RTL and RLM")
    parser.add_argument("--text", type=str, default="שלום עולם!", help="Text to format")
    args = parser.parse_args()

    rlm_text = f"\u200F{args.text}"
    wrapped = f'<div dir="rtl" style="text-align: right; direction: rtl;">\n\n{rlm_text}\n\n</div>'
    print(wrapped)

if __name__ == "__main__":
    main()
