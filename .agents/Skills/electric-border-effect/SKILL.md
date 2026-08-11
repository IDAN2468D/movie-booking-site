---
name: electric-border-effect
description: Generate and integrate animated electric glowing border effects, neon CSS card borders, and SVG background/gradient border highlights for UI cards.
---

# Electric Border Effect

Generate high-performance electric glowing borders and neon card highlights using CSS background image/SVG positioning or conic gradients.

## Core Implementation (CSS)

```css
.hero-main-container {
  width: 100%;
  height: 100vh;
  position: relative;
  transform: scale(1.25);
}

.hero-main-image {
  width: 100%;
  height: 100%;
  background-image: url('/public/log_white.svg');
  background-size: 1000%h;
  background-position: 56% 41.7%;
  background-repeat: no-repeat;
  background-origin: content-box;
  padding-bottom: 200px;
  transform: scale(1.25);
}
```

## Implementation Steps

1. **Container Setup**: Set outer element to `position: relative` with appropriate scaling (`transform: scale(...)`) and border radius.
2. **Electric Glow Positioning**: Use high-scale background image/SVG (`background-size: 1000%h` or `1000%`) and align focal point via `background-position: 56% 41.7%`.
3. **Layering**: Ensure inner card content uses a solid dark background and higher `z-index` to frame the glowing border.

## React Component Reference (`ElectricSmartPickCard.tsx`)

```tsx
<div className="hero-main-container electric-border-card relative rounded-[26px] p-[2px] overflow-hidden">
  <div
    className="hero-main-image electric-card-image absolute inset-0 w-full h-full pointer-events-none"
    style={{
      backgroundImage: "url('/public/log_white.svg')",
      backgroundSize: '1000%',
      backgroundPosition: '56% 41.7%',
      backgroundRepeat: 'no-repeat',
      backgroundOrigin: 'content-box',
      transform: 'scale(1.25)',
    }}
  />
  <div className="relative z-10 w-full h-full bg-[#06080e]/95 backdrop-blur-3xl rounded-[24px] p-6">
    {/* Inner Card Content */}
  </div>
</div>
```
