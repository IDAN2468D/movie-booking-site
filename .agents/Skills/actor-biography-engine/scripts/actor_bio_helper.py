#!/usr/bin/env python3
"""
Actor Bio & Career Timeline Helper
Formats actor filmography lists and estimates career milestones.
"""

import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description="Format actor career milestones")
    parser.add_argument("--actor-name", type=str, default="Timothee Chalamet", help="Actor name")
    parser.add_argument("--movie-count", type=int, default=15, help="Total movies in filmography")
    args = parser.parse_args()

    print(f"Actor: {args.actor_name}")
    print(f"Total Credited Roles: {args.movie_count}")
    print(f"Estimated Career Era: Modern Contemporary")

if __name__ == "__main__":
    main()
