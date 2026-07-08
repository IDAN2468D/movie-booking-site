"use client";

import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '@/hooks/useThemeStore';

export default function AmbientThemeProvider({ children }: { children: React.ReactNode }) {
  const { activeColor, activeShadow, luminance } = useThemeStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.setProperty('--ambient-theme-glow', activeColor);
      wrapperRef.current.style.setProperty('--ambient-theme-shadow', activeShadow);
      
      // Liquid Glass 4.0 Contrast Guards
      // If luminance is high (bright background), apply a darker text shadow / contrast filter
      const contrastMode = luminance > 0.5 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.4)';
      wrapperRef.current.style.setProperty('--ambient-contrast-shadow', contrastMode);
    }
  }, [activeColor, activeShadow, luminance]);

  return (
    <div 
      ref={wrapperRef}
      className="relative min-h-screen w-full ambient-theme-wrapper"
    >
      <div className="fixed inset-0 pointer-events-none z-[-1] ambient-bg-layer" />
      <div className="relative z-0 w-full h-full">
        {children}
      </div>
    </div>
  );
}
