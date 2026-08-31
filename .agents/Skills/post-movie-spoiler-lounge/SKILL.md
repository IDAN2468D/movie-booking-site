---
name: post-movie-spoiler-lounge
description: >-
  Post-screening digital memory shard vault and spoiler-free discussion lounge. Use when user asks for "spoiler lounge", "homer leachar hakrana", "sikhei sratim", "diyon sratim", or afterglow discussions. Provides spoiler blur masks, verified ticket attendee badges, and quote soundwaves. Do NOT use for active live booking or seat maps (use cinedna-feature-suite instead).
license: MIT
---

# Post-Movie Spoiler Lounge & Community Discussion

Architecture and implementation guidelines for post-screening community lounges, spoiler-protected discussion threads, and verified viewer reactions in CinePulse.

## Instructions

### Step 1: Spoiler Masking & Verification Gate
Blur discussion messages containing plot twists and require user confirmation before unmasking:
- Verified ticket badge displayed next to verified attendees.
- Toggleable spoiler shield filter.

### Step 2: Emoji Reactions & Rating Harmonics
Allow viewers to vote on scene impacts, emotional resonance, and soundtrack favorites.

### Step 3: Soundwave Quote Minting
Integrate with the Memory Capsule system to mint audio quote echoes from standout movie moments.

## Examples

### Example 1: Join Post-Screening Discussion
User says: "Open the discussion lounge for Dune Part 2"
Actions:
1. Load Afterglow Lounge for movie ID `693134`.
2. Apply spoiler mask on ending analysis threads.
3. Display verified community ratings.
Result: Interactive spoiler-safe discussion lounge.

## Bundled Resources

### Scripts
- `scripts/spoiler_analyzer.py` -- Scans text for spoiler keywords and calculates spoiler risk scores. Run: `python scripts/spoiler_analyzer.py --help`

### References
- `references/spoiler-guard-protocol.md` -- Rules for spoiler keyword filtering and attendee verification.

## Gotchas

- Never display ending details in unmasked previews.
- Ensure Hebrew right-to-left layout for community comments and author badges.

## Troubleshooting

### Error: "Comment not verified"
Cause: User has not booked a ticket for this movie screening.
Solution: Allow unverified comment with "Community Guest" badge.
