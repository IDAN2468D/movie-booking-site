---
type: skill
status: active
tags: [ui, video, autoplay, nextjs15, framer-motion, stories]
project: movie-booking-site
---

# SKILL: Stories Autoplay Trailer Experience

## 🎯 Executive Overview
Build a premium, high-performance **Instagram/Snapchat-style Stories component** for `movie-booking-site`. When a user opens a movie story, the official movie trailer must **auto-play instantly** in the background, matching the signature cinematic **Liquid Glass / Neon** aesthetic.

## 🛡️ Strict Boundaries & Rules
- **No REST APIs:** Exclusively built using client-side video streaming elements and integrated seamlessly into Next.js 15 layout structures.
- **RTL & Logical Utilities:** The stories navigation indicator bars (progress bars) and gesture taps must map perfectly to right-to-left flow (`flex-row-reverse`, `space-x-reverse`).
- **Autoplay Resilience:** Gracefully handle mobile/desktop browser autoplay restrictions with an auto-mute loop fallback and a distinct floating glow overlay code for unmuting.

---

## 🛠️ Feature Design Specifications

### 📱 1. Layout & Glassmorphism Envelope
- **Container:** Fullscreen or modal envelope wrapped in pure cinematic obsidian backdrop (`bg-[#05070B]/95` or `backdrop-blur-2xl`).
- **Header Layer:** Top overlay displaying the movie poster thumbnail (rounded circle), movie title, and a crisp, minimalist close icon.
- **Liquid Progress Trackers:** Top horizontal segment bars tracking story duration (e.g., 15 seconds per story). Segment fill animation must flow smoothly from right to left (RTL native execution).

### 🎬 2. Zero-Friction Video Streaming (Autoplay Engine)
- Use HTML5 `<video>` or embedded video layer fine-tuned for streaming.
- **Autoplay Strategy:** - Mount video with `autoPlay`, `playsInline`, `muted`, and `loop`.
  - Try to unmute programmatically. If blocked by browser policy, keep video playing muted and display an animated glassmorphic tooltip: `"לחץ להפעלת סאונד 🔊 / Tap for Sound"`.

### ⚡ 3. Navigation & Interaction Timeline (Framer Motion)
- **Tap Right Side (RTL Context):** Move to the *Previous* story slide.
- **Tap Left Side (RTL Context):** Move to the *Next* story slide.
- **Hold Screen:** Pause both the video element playback and the top Framer Motion progress tracking bar instantly.
- **Transitions:** Smooth 3D cube-flip or slide animations between movie story cards (`stiffness: 100, damping: 15`).

---

## 🏗️ Technical Target Mapping
- **File Target Location:** `@/src/components/stories/MovieStoryView.tsx`
- **Typography:** Locked to `Rubik` or `Assistant` fonts with `leading-relaxed` parameters to prevent character clipping.
- **State Cleanup:** Ensure unmounting the story component explicitly cuts the HTML5 Audio/Video context to avoid memory leaks.

## 🛑 Validation Checklist for AI Agent
- [V] Changing stories completely kills the previous video track and loads the next trailer immediately.
- [V] Progress bars at the top sync perfectly with the real-time video duration or a hard timeout (15s).
- [V] Tailwind code uses strictly logical properties (`border-s`, `pe-`, `space-x-reverse`) ensuring native Hebrew alignment.
- [V] TypeScript compiles cleanly with 0 errors (`npx tsc --noEmit`).