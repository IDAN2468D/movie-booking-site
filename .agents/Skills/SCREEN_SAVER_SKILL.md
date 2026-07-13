# Specular Netflix-Style Eco Screen Saver (v4.5)

## 1. Cinematic Netflix Transitions
- The system must display a rotating carousel of featured movies (Posters, Titles, and Tags).
- Transitions between movies must utilize a slow, high-depth Crossfade & Ken Burns effect (subtle scaling up of the background image).

## 2. Zero-CPU Eco Mandate (Green Computing)
- **Eliminate Main-Thread Overhead**: Continuous Javascript loops (like frame-by-frame requestAnimationFrame calculations) are strictly forbidden. 
- **GPU-Only Animation Pipeline**: All visual transitions, opacity fades, and scaling effects must run entirely on the GPU Compositor thread using CSS Keyframes with `will-change: transform, opacity`.
- **DOM Freezing**: When `isScreenSaverActive` is true, the background application DOM layers should receive `content-visibility: hidden` or be visually detached from layout recalculations to drop CPU utilization to 0%.