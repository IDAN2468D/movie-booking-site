---
name: actor-biography-engine
description: >-
  Interactive actor profile, filmography timeline, AI-narrated audio biographies, and biometric fan badges. Use when user asks to explore actor profiles, "biografia shel sachkan", "filmgrafia", "kol sachkan", or inspect cast details. Provides TMDB filmography, emotion graphs, and Web Speech narration. Do NOT use for movie showtimes or ticket booking (use cinedna-feature-suite instead).
license: MIT
---

# Actor Biography Engine

Comprehensive guide for building and integrating AI-narrated acoustic actor biographies, TMDB filmography exploration, role emotion analysis, and biometric fan collectibles.

## Instructions

### Step 1: TMDB Actor Data Resolution
Fetch actor bio and credits from TMDB API v3 endpoints:
- Primary bio: `/person/{person_id}`
- Combined movie credits: `/person/{person_id}/combined_credits`
- Actor imagery: `getImageUrl(profile_path, 'h632')`

### Step 2: AI Narration & Emotion Graph Generation
Use Gemini AI (`gemini-3.5-flash-lite`) to summarize the actor's career arc, iconic roles, and emotional range.
Format the output into chronological milestones and key personality archetypes.

### Step 3: Web Audio Narration & Speech Synthesis
Initialize `window.speechSynthesis` with `he-IL` locale or synthesize background cinematic ambiance using Web Audio API:
- `SpeechSynthesisUtterance` configured with rate `0.95` and pitch `1.0`.
- 432Hz ambient chord tone played in the background.

## Examples

### Example 1: Explore Actor Profile
User says: "Show me Timothee Chalamet's biography and top movies"
Actions:
1. Fetch TMDB person data for person ID `1190668`.
2. Render filmography carousel with release dates and character names.
3. Provide 1-click audio biography voice-over.
Result: Interactive glassmorphic actor profile with live audio reel.

## Bundled Resources

### Scripts
- `scripts/actor_bio_helper.py` -- Fetches and formats actor filmography metrics. Run: `python scripts/actor_bio_helper.py --help`

### References
- `references/actor-filmography-spec.md` -- Complete schema and layout patterns for actor profile cards.
- `references/actor-audio-narration.md` -- Speech synthesis settings and acoustic ambiance.

## Gotchas

- TMDB person IDs are numeric strings; always validate with integer parsing.
- Speech synthesis requires user interaction (click/touch) to start without browser permission blocks.
- Ensure Hebrew character names align properly in RTL mode.

## Troubleshooting

### Error: "Actor credits not found"
Cause: TMDB API returned an empty crew/cast array.
Solution: Fallback to cached demo actor profile.
