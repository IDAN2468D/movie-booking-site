#!/usr/bin/env python3
"""
Agent Stack Framework - State and LOC Validator
Validates the presence of the 4 state files and verifies the 200 LOC ceiling rule.
"""

import argparse
import os
import sys

STATE_FILES = [
    ".agents/state/task.md",
    ".agents/state/latest.md",
    ".agents/state/ARCHITECTURE_STATE.md",
    ".agents/state/SPRINTS.md",
]

def check_state_files(root_dir: str) -> bool:
    print(f"Checking state files in {root_dir}...")
    all_ok = True
    for sf in STATE_FILES:
        full_path = os.path.join(root_dir, sf)
        if os.path.isfile(full_path):
            size = os.path.getsize(full_path)
            print(f"  [OK] {sf} ({size} bytes)")
        else:
            print(f"  [MISSING] {sf}")
            all_ok = False
    return all_ok

def check_file_loc(file_path: str, max_loc: int = 200) -> bool:
    if not os.path.isfile(file_path):
        print(f"Error: file {file_path} does not exist.")
        return False
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()
    count = len(lines)
    status = "OK" if count <= max_loc else "EXCEEDED"
    print(f"  [{status}] {file_path}: {count} lines (max {max_loc})")
    return count <= max_loc

def main():
    parser = argparse.ArgumentParser(
        description="Agent Stack Framework validator for state files and LOC ceiling."
    )
    parser.add_argument("--root", default=".", help="Root directory of the project (default: current directory)")
    parser.add_argument("--check-file", help="Check LOC of a specific file against the 200 LOC rule")
    parser.add_argument("--max-loc", type=int, default=200, help="Maximum allowed LOC per file (default: 200)")
    
    args = parser.parse_args()
    success = True

    if args.check_file:
        success = check_file_loc(args.check_file, args.max_loc)
    else:
        success = check_state_files(args.root)

    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
