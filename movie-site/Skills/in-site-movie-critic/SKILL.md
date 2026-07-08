---
name: "InSite Movie Critic Agent"
description: "Live Audio Narration & Speaker Overlay orchestration."
---

# Skill: InSiteMovieCriticAgent
## Context: Live Audio Narration & Speaker Overlay

## Technical & Architectural Bounds
1. **User Gesture Activation**: To guarantee zero browser blocks on `window.speechSynthesis.speak()`, an explicit speaker icon button (`<Volume2 />` or equivalent vector node) must be embedded into the UI. Clicking this button must explicitly unlock the browser's audio context and initiate text synthesis.
2. **Contextual Text Synthesis**: Clicking the speaker icon on a specific text card/message bubble must pass that block's exact inner string token directly to the sentence-buffered `useMovieCriticSpeech` hook.
3. **Audio Lifecycle Management**: If the text speech is actively playing, clicking the speaker button a second time must act as a pause/cancel toggle (`window.speechSynthesis.cancel()`), smoothly switching the icon asset visual state.

## Design Rules (Liquid Glass 4.0 Layout)
- **Speaker Trigger Node**: The speaker control element must render as a premium micro-frosted glass circular node (`backdrop-blur-md bg-white/5 border border-white/10 p-2 rounded-full hover:bg-white/15 active:scale-95 transition-all duration-200`).
- **Acoustic Wave Feedback**: When audio playback is actively synthesizing, the speaker node must radiate a soft glowing ultraviolet pulse halo effect (`animate-pulse shadow-[0_0_12px_rgba(139,92,246,0.4)]`).