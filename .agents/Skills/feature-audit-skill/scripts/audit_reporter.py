#!/usr/bin/env python3
"""
Feature Audit Skill - Architecture State Auditor & Reporter
Parses ARCHITECTURE_STATE.md to report total modules and active capabilities.
"""

import argparse
import os
import re
import sys

def audit_architecture_state(file_path: str):
    if not os.path.isfile(file_path):
        print(f"Error: file not found at {file_path}")
        sys.exit(1)

    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    modules = re.findall(r"\|\s*\*\*Module\s+([A-Z]+)\*\*\s*\|\s*([^\|]+)\|\s*([^\|]+)\|\s*([^\|]+)\|\s*`([^`]+)`\s*\|", content)
    
    print(f"=== CinePulse Feature Audit Report ===")
    print(f"Source: {file_path}")
    print(f"Total Registered Modules: {len(modules)}\n")
    
    active_count = sum(1 for m in modules if m[4].strip() == "ACTIVE")
    print(f"Active Capabilities: {active_count}/{len(modules)} ({(active_count/len(modules)*100):.1f}%)" if modules else "No modules found.")
    
    print("\nSample Audited Capabilities:")
    for mod in modules[:5]:
        print(f"  - Module {mod[0]}: {mod[1].strip()} [{mod[4].strip()}]")
    print("=======================================")

def main():
    parser = argparse.ArgumentParser(description="Audit CinePulse architecture state and capabilities matrix.")
    parser.add_argument(
        "--file",
        default=".agents/state/ARCHITECTURE_STATE.md",
        help="Path to ARCHITECTURE_STATE.md (default: .agents/state/ARCHITECTURE_STATE.md)"
    )
    args = parser.parse_args()
    audit_architecture_state(args.file)

if __name__ == "__main__":
    main()
