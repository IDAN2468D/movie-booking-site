---
name: gradient-border-effect
description: Create interactive gradient border effects, glow borders, and mouse-following gradient cards in React, Next.js, and CSS. Use when building dark-mode glowing cards, interactive UI components, mouse-tracked border animations, or glassmorphic gradient card borders.
---

# Gradient Border Effect

A skill for implementing mouse-tracked, glowing gradient border effects and interactive cards in web applications. It uses a single container-level mouse listener to drive dynamic radial gradient masks and CSS custom variables across multiple elements efficiently.

## When to Use

Use this skill when asked to:

- Build interactive cards with glowing borders that follow the cursor (`Wherever you go, the cursor follows`).  
- Implement dynamic CSS gradient border effects on hover/mouse move.  
- Create glassmorphic cards with animated border highlights in dark mode.  
- Develop performance-optimized cursor tracking across card grids using CSS custom properties (`--x`, `--y`).

## Technical Architecture & Core Mechanism

### 1. The Single Event Listener Pattern

Instead of attaching mousemove listeners to every card, attach one `pointermove` or `mousemove` listener to the parent container (`main` or `grid`). This updates CSS variables `--x` and `--y` relative to each card's bounding box or relative to the container.

### 2. Radial Gradient Border Mask Trick

To illuminate only the 1px card border without filling the background:

- Apply a pseudo-element (`::before`) with `position: absolute; inset: 0; padding: 1px; border-radius: inherit;`.  
- Use a `radial-gradient` centered at `var(--x) var(--y)`.  
- Use CSS Masking (`mask` / `-webkit-mask`) with `mask-composite: exclude` to clip out the inner content area, leaving only the 1px border visible.

```css
article {
  aspect-ratio: 3 / 4;
  border-radius: calc(var(--radius, 16) * 1px);
  width: 240px;
  position: relative;
  display: grid;
  grid-template-rows: 1fr auto;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.5);
  padding: 1rem;
  gap: 1rem;
  background: rgba(15, 23, 42, 0.75);
  -webkit-backdrop-filter: blur(calc(var(--cardblur, 5) * 1px));
  backdrop-filter: blur(calc(var(--cardblur, 5) * 1px));
}

article::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: radial-gradient(
    600px circle at var(--x, 50%) var(--y, 50%),
    rgba(59, 130, 246, 0.8),
    rgba(168, 85, 247, 0.6),
    transparent 70%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

## React / Next.js Implementation

### Component 1: Container with Mouse Listener (`GradientBorderContainer.tsx`)

```tsx
'use client';

import React, { useRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const GradientBorderContainer: React.FC<Props> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll<HTMLElement>('.gradient-border-card');

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  };

  return (
    <main
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className={`relative flex flex-wrap items-center justify-center gap-8 max-w-[120ch] mx-auto p-6 ${className}`}
    >
      {children}
    </main>
  );
};
```

### Component 2: Card Item (`GradientBorderCard.tsx`)

```tsx
'use client';

import React from 'react';

interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  buttonText?: string;
  onAction?: () => void;
  radius?: number;
  cardBlur?: number;
}

export const GradientBorderCard: React.FC<CardProps> = ({
  title,
  description,
  icon,
  buttonText = 'Follow',
  onAction,
  radius = 16,
  cardBlur = 8,
}) => {
  return (
    <article
      className="gradient-border-card group relative grid grid-rows-[1fr_auto] aspect-[3/4] w-[260px] p-6 gap-4 rounded-2xl bg-slate-900/80 backdrop-blur-md shadow-2xl transition-transform duration-300 hover:-translate-y-1 overflow-hidden"
      style={{
        '--radius': radius,
        '--cardblur': cardBlur,
      } as React.CSSProperties}
    >
      {/* Dynamic Gradient Border Overlay */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(500px circle at var(--x, 50%) var(--y, 50%), rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.7), transparent 60%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Card Body */}
      <div className="flex flex-col justify-between z-10">
        <div className="p-3 w-fit rounded-xl bg-slate-800/80 text-blue-400 border border-slate-700/50">
          {icon || <span className="text-2xl">✨</span>}
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-bold text-slate-100 mb-2">{title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Card Action */}
      <div className="z-10 pt-2 border-t border-slate-800/80">
        <button
          onClick={onAction}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700/60 hover:border-blue-500/50 transition-all duration-200 shadow-sm hover:shadow-blue-500/20"
        >
          {buttonText}
        </button>
      </div>
    </article>
  );
};
```

## Gotchas & Best Practices

1. **Performance**: Use `pointermove` instead of `mousemove` to support touch and stylus input gracefully.  
2. **GPU Acceleration**: Always add `pointer-events-none` on the border overlay layer to prevent mouse jittering and event bubbling issues.  
3. **CSS Mask Support**: Always provide both `-webkit-mask-composite: xor` and `mask-composite: exclude` for cross-browser support (Chrome, Safari, Firefox).  
4. **Initial Off-screen State**: Initialize `--x` and `--y` outside the card rect or hide opacity when `group-hover` is inactive so gradient doesn't stick to top-left corner before first mouse interaction.  
5. **RTL Compatibility**: Ensure flex layouts and text alignments use logical properties (`text-start`, `space-x-reverse` for Hebrew RTL).
