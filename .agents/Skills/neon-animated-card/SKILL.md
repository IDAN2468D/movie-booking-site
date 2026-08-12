---
name: neon-animated-card
description: Generate and integrate Next.js and Tailwind CSS neon animated card components with glowing borders and gradient animations. Use when creating React card components with rotating glowing borders or CSS hover glow effects in Next.js.
---

# Neon Animated Card (Next.js & Tailwind CSS)

Generate modern Next.js React components featuring animated neon gradient borders, glowing drop-shadows, and dark Tailwind card layouts.

## When to Use

- Creating React/Next.js UI cards with glowing animated gradient borders in Tailwind CSS.
- Implementing dark-mode UI components with glowing gradient hover effects.

## Next.js + Tailwind Implementation

### `components/NeonCard.tsx`

```tsx
import React from 'react';

interface NeonCardProps {
  title: string;
  description: string;
  buttonText?: string;
  gradient?: string;
}

export default function NeonCard({
  title,
  description,
  buttonText = 'Read More',
  gradient = 'from-pink-500 to-purple-600',
}: NeonCardProps) {
  return (
    <div className="relative w-72 h-96 flex items-center justify-center bg-black/50 overflow-hidden rounded-2xl group">
      {/* Neon Gradient Layer */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr ${gradient} transition-opacity duration-500 group-hover:opacity-100 opacity-80`}
      />
      {/* Blurred Glow Layer */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr ${gradient} blur-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100`}
      />
      {/* Inner Mask Container */}
      <div className="absolute inset-[6px] bg-slate-950/90 z-10 rounded-[14px]" />
      {/* Content */}
      <div className="relative z-20 p-6 flex flex-col justify-between h-full text-white">
        <div>
          <h2 className="text-xl font-bold mb-2 tracking-wide">{title}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
        </div>
        <a
          href="#"
          className="inline-block text-center font-semibold text-xs text-black bg-white py-2.5 px-5 rounded-full hover:bg-slate-200 transition-colors w-fit"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
}
```
