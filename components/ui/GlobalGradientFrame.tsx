'use client';

import React, { useRef } from 'react';

interface GlobalGradientFrameProps {
  children: React.ReactNode;
  className?: string;
}

export const GlobalGradientFrame: React.FC<GlobalGradientFrameProps> = ({ children, className = '' }) => {
  const frameRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    frameRef.current.style.setProperty('--x', `${x}px`);
    frameRef.current.style.setProperty('--y', `${y}px`);
    
    // Also update all nested gradient border cards if present
    const cards = frameRef.current.querySelectorAll<HTMLElement>('.gradient-border-card');
    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - cardRect.left}px`);
      card.style.setProperty('--y', `${e.clientY - cardRect.top}px`);
    });
  };

  return (
    <div
      ref={frameRef}
      onPointerMove={handlePointerMove}
      className={`relative w-full h-full min-h-screen overflow-hidden group/frame ${className}`}
    >
      {/* Outer Application Frame Glowing Gradient Border Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[9999] p-[2px] opacity-80 group-hover/frame:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(650px circle at var(--x, 50%) var(--y, 50%), rgba(255, 159, 10, 0.95), rgba(59, 130, 246, 0.8), rgba(168, 85, 247, 0.7), transparent 65%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {children}
    </div>
  );
};
