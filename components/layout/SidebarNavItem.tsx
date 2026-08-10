'use client';

import React from 'react';
import Link from 'next/link';

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive: boolean;
  glowColor1?: string;
  glowColor2?: string;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  href,
  label,
  icon: Icon,
  isActive,
  glowColor1 = 'rgba(255, 159, 10, 0.9)',
  glowColor2 = 'rgba(168, 85, 247, 0.75)',
}) => {
  return (
    <Link
      href={href}
      className={`gradient-border-card group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 border overflow-hidden ${
        isActive
          ? 'bg-primary/90 border-primary text-background font-black shadow-[0_10px_25px_rgba(255,159,10,0.3)]'
          : 'text-slate-300 border-white/5 bg-white/[0.02] hover:bg-white/10 hover:text-white'
      }`}
    >
      {/* Dynamic Cursor-Tracked Radial Gradient Mask */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(180px circle at var(--x, 50%) var(--y, 50%), ${glowColor1}, ${glowColor2}, transparent 70%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <Icon className="w-5 h-5 relative z-10 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
      <span className="font-bold text-sm font-inter relative z-10 truncate">{label}</span>
    </Link>
  );
};
