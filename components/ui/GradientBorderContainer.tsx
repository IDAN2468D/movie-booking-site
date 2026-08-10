'use client';

import React, { useRef } from 'react';

interface GradientBorderContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientBorderContainer: React.FC<GradientBorderContainerProps> = ({
  children,
  className = '',
}) => {
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
      card.style.setProperty('--opacity', '1');
    });
  };

  const handlePointerLeave = () => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll<HTMLElement>('.gradient-border-card');
    cards.forEach((card) => {
      card.style.setProperty('--opacity', '0');
    });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative flex flex-wrap items-center justify-center gap-6 p-4 dir-rtl ${className}`}
    >
      {children}
    </div>
  );
};
