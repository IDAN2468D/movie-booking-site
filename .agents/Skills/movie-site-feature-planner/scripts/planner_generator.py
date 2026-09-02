#!/usr/bin/env python3
"""
Movie Site Feature Planner - Feature Scaffold Generator
Generates a standard markdown scaffold for a cinema platform feature spec.
"""

import argparse
import sys

TEMPLATE = """# Feature Blueprint: {title}

## 1. Overview
- **Feature Name:** {title}
- **Category:** {category}
- **Target Sprint:** {sprint}

## 2. Requirements & Acceptance Criteria
- [ ] Conforms to 200 LOC per file
- [ ] Full Hebrew RTL localization
- [ ] 120Hz GPU motion & zero reflow

## 3. Architecture & Components
- Component: `components/{folder}/{title_slug}.tsx`
- Action: `app/actions/{title_slug}Actions.ts`
- Schema: `lib/schemas/{title_slug}Schema.ts`
"""

def generate_scaffold(title: str, category: str, sprint: str):
    slug = title.lower().replace(" ", "-")
    output = TEMPLATE.format(
        title=title,
        category=category,
        sprint=sprint,
        folder=category.lower().replace(" ", "-"),
        title_slug=slug
    )
    print(output)

def main():
    parser = argparse.ArgumentParser(description="Generate a cinema feature scaffold.")
    parser.add_argument("--title", required=True, help="Feature title (e.g., 'VIP Seat Auction')")
    parser.add_argument("--category", default="booking", help="Feature category (default: booking)")
    parser.add_argument("--sprint", default="Sprint 162", help="Target sprint number")
    
    args = parser.parse_args()
    generate_scaffold(args.title, args.category, args.sprint)

if __name__ == "__main__":
    main()
