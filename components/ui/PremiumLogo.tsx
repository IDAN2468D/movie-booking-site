import React from 'react';

interface PremiumLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const PremiumLogo: React.FC<PremiumLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: {
      container: 'gap-3',
      icon: 'w-16 h-16',
      text: 'text-2xl',
      subtitle: 'text-[9px]',
    },
    md: {
      container: 'gap-4',
      icon: 'w-24 h-24',
      text: 'text-3xl',
      subtitle: 'text-[11px]',
    },
    lg: {
      container: 'gap-5',
      icon: 'w-32 h-32',
      text: 'text-5xl',
      subtitle: 'text-[14px]',
    },
    hero: {
      container: 'gap-6',
      icon: 'w-32 h-32 md:w-48 md:h-48',
      text: 'text-[48px] md:text-[64px]',
      subtitle: 'text-[12px] mt-4',
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center justify-center group transition-all duration-500 ${currentSize.container} ${className}`}>
      {/* Animated SVG Icon */}
      <div className={`${currentSize.icon} drop-shadow-[0_0_15px_rgba(255,184,0,0.4)] group-hover:drop-shadow-[0_0_25px_rgba(255,184,0,0.6)] transition-all duration-500 shrink-0`}>
        <div className="w-full h-full text-[#ffb800]" style={{ display: 'block' }}>
          <svg height="100%" width="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="glassGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.2)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.05)', stopOpacity: 1 }} />
              </linearGradient>
              <filter id="goldGlow" height="140%" width="140%" x="-20%" y="-20%">
                <feGaussianBlur result="blur" stdDeviation="3" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="tealGlow" height="140%" width="140%" x="-20%" y="-20%">
                <feGaussianBlur result="blur" stdDeviation="4" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="shimmer" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="100%" stopColor="transparent" />
                <animate attributeName="x1" dur="3s" from="-100%" to="100%" repeatCount="indefinite" />
                <animate attributeName="x2" dur="3s" from="0%" to="200%" repeatCount="indefinite" />
              </linearGradient>
            </defs>
            <rect fill="url(#glassGradient)" height="120" rx="24" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" width="120" x="40" y="40" />
            <path d="M60 70C60 70 80 65 100 70C120 65 140 70 140 70V130C140 130 120 125 100 130C80 125 60 130 60 130V70Z" fill="none" filter="url(#goldGlow)" stroke="#FFB800" strokeWidth="3">
              <animateTransform attributeName="transform" dur="4s" repeatCount="indefinite" type="scale" values="1;1.02;1" />
            </path>
            <line stroke="white" strokeDasharray="4 2" strokeWidth="1.5" x1="100" x2="100" y1="70" y2="130">
              <animate attributeName="stroke-dashoffset" dur="1s" from="0" to="12" repeatCount="indefinite" />
            </line>
            <path d="M92 90L112 100L92 110V90Z" fill="#00F0FF" filter="url(#tealGlow)">
              <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="0.8;1;0.8" />
            </path>
            <rect fill="url(#shimmer)" height="120" pointerEvents="none" rx="24" width="120" x="40" y="40" />
          </svg>
        </div>
      </div>

      {/* Typographic Logo */}
      <div className="flex flex-col items-center text-center">
        <h1 className={`font-outfit ${currentSize.text} flex items-center gap-0.5 md:gap-1 font-black transition-all duration-500 leading-none`}>
          <span className="text-white drop-shadow-md">MOVIE</span>
          <span className="text-[#ffb800] drop-shadow-[0_0_10px_rgba(255,184,0,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(255,184,0,0.8)]">BOOK</span>
        </h1>
        {size === 'hero' && (
          <h2 className={`font-outfit ${currentSize.subtitle} text-white/70 tracking-[0.4em] uppercase`}>
            Premium Cinema
          </h2>
        )}
      </div>
    </div>
  );
};
