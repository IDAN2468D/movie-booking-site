---
name: spatial-acoustic-wavefront
description: >-
  Web Audio API 3D spatial acoustics, 35Hz-50Hz sub-bass sound synthesis, StereoPanner, and haptic vibration sync. Use when user asks for "spatial audio", "akustika 3D", "sub-bass", "haptic feedback", "shmea merchavi", or seat sound previews. Implements Binaural HRTF panners, lowpass filters, and haptic vibration. Do NOT use for concession or ticket pricing (use cinedna-feature-suite instead).
license: MIT
---

# Spatial Acoustic Wavefront Engine

Architecture and implementation guide for Web Audio API 3D spatial acoustics, 35Hz-50Hz sub-bass synthesis, and synchronized haptic vibrations in CinePulse.

## Instructions

### Step 1: AudioContext Initialization & User Gesture
Always resume or initialize the `AudioContext` within an explicit user click/touch event handler to comply with browser autoplay restrictions.

### Step 2: Spatial Graph Wiring
Construct the Web Audio routing chain:
```
[Oscillator / Buffer] -> [BiquadFilter (Lowpass)] -> [PannerNode (HRTF)] -> [Master Gain] -> [Destination]
```
For Subwoofer synthesis, route a parallel 35Hz-50Hz sine oscillator through a dedicated Sub-Gain into Master Gain.

### Step 3: Haptic Feedback Synchronization
Trigger `navigator.vibrate([40, 60, 80])` on bass drops or spatial seat transitions when supported.

## Examples

### Example 1: Preview Seat Acoustic Tone
User says: "Preview the audio profile for VIP Seat D4"
Actions:
1. Initialize AudioContext at 432Hz spatial root.
2. Set HRTF Panner position (x=0, y=0.5, z=0).
3. Synthesize 42Hz sub-bass pulse with 0.35 gain.
Result: 3D binaural acoustic sweep with subtle haptic vibration.

## Bundled Resources

### Scripts
- `scripts/frequency_synthesizer.py` -- Generates test tone calculations and filter cutoff values. Run: `python scripts/frequency_synthesizer.py --help`

### References
- `references/webaudio-node-spec.md` -- Detailed Web Audio node graph and safety practices.

## Gotchas

- Never connect an active oscillator without a ramping gain node to prevent popping/clicks.
- Always check `typeof navigator !== 'undefined' && 'vibrate' in navigator` before calling haptics.

## Troubleshooting

### Error: "AudioContext is not allowed to start"
Cause: Autoplay blocked by browser security.
Solution: Wrap `.resume()` inside a `PointerDown` or `Click` event listener.
