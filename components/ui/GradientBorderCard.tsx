'use client';

import React from 'react';

interface GradientBorderCardProps {
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
  buttonText?: string;
  onAction?: () => void;
  radius?: number;
  cardBlur?: number;
  glowColor1?: string;
  glowColor2?: string;
  className?: string;
}

export const GradientBorderCard: React.FC<GradientBorderCardProps> = ({
  title,
  description,
  badge,
  icon,
  buttonText,
  onAction,
  radius = 16,
  cardBlur = 8,
  glowColor1 = 'rgba(59, 130, 246, 0.9)',
  glowColor2 = 'rgba(147, 51, 234, 0.75)',
  className = '',
}) => {
  return (
    <article
      className={`gradient-border-card group relative grid grid-rows-[1fr_auto] aspect-[3/4] w-[280px] p-6 gap-4 rounded-2xl bg-slate-900/80 backdrop-blur-md shadow-2xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden text-right ${className}`}
      style={{
        '--radius': radius,
        '--cardblur': cardBlur,
        '--x': '50%',
        '--y': '50%',
        '--opacity': '0',
      } as React.CSSProperties}
    >
      {/* Radial Gradient Glowing Border Overlay */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(500px circle at var(--x, 50%) var(--y, 50%), ${glowColor1}, ${glowColor2}, transparent 65%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Background Ambient Aura */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 rounded-[inherit]"
        style={{
          background: `radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), ${glowColor1}, transparent 70%)`,
        }}
      />

      {/* Card Content Body */}
      <div className="flex flex-col justify-between z-10">
        <div className="flex items-center justify-between gap-2">
          {icon ? (
            <div className="p-3 w-fit rounded-xl bg-slate-800/90 text-blue-400 border border-slate-700/60 shadow-inner">
              {icon}
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
              CINEPULSE
            </div>
          )}
          {badge && (
            <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-sm">
              {badge}
            </span>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-slate-100 mb-2 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed opacity-90">
            {description}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      {buttonText && (
        <div className="z-10 pt-3 border-t border-slate-800/80">
          <button
            onClick={onAction}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-blue-600 text-slate-100 font-medium text-xs border border-slate-700/80 hover:border-blue-400/80 transition-all duration-200 shadow-md hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            {buttonText}
          </button>
        </div>
      )}
    </article>
  );
};
