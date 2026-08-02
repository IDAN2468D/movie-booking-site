#!/usr/bin/env python3
import os
import sys

def verify_agents_structure():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    required_files = [
        "AGENTS.md",
        "state/task.md",
        "state/latest.md",
        "state/ARCHITECTURE_STATE.md",
        "docs/DATA_SCHEMA.md",
        "templates/PLAN_TEMPLATE.md",
        "templates/PRD_TEMPLATE.md",
        "templates/SPEC_TEMPLATE.md",
        "skills/token-optimization/SKILL.md",
        "skills/code-quality-and-testing/SKILL.md",
        "skills/security-and-rbac/SKILL.md",
        "skills/rtl-and-i18n/SKILL.md",
        "skills/database-and-prisma/SKILL.md",
        "skills/ai-integration/SKILL.md"
    ]
    
    missing = []
    for f in required_files:
        full_path = os.path.join(base_dir, f)
        if not os.path.isfile(full_path):
            missing.append(f)
            
    if missing:
        print(f"FAILED: Missing files: {missing}")
        sys.exit(1)
    else:
        print("SUCCESS: All .agents files, skills, templates, and state files verified cleanly!")

if __name__ == "__main__":
    verify_agents_structure()
