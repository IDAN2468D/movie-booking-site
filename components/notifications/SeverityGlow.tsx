'use client';

import React from 'react';

interface SeverityGlowProps {
  type: 'booking' | 'offer' | 'food' | 'info';
}

export const SeverityGlow: React.FC<SeverityGlowProps> = ({ type }) => {
  const getGlowColor = () => {
    switch (type) {
      case 'booking':
        return 'from-green-500/10 to-emerald-500/0';
      case 'offer':
        return 'from-[#FF1464]/10 to-pink-500/0';
      case 'food':
        return 'from-cyan-500/10 to-blue-500/0';
      default:
        return 'from-slate-500/10 to-slate-500/0';
    }
  };

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-tr ${getGlowColor()} pointer-events-none opacity-60 transition-opacity duration-500`}
    />
  );
};
