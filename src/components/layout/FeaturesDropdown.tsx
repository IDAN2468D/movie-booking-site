'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

export interface FeatureNavItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
}

interface FeaturesDropdownProps {
  pathname: string;
  items: FeatureNavItem[];
}

export const FeaturesDropdown: React.FC<FeaturesDropdownProps> = ({ pathname, items }) => {
  const isAnyFeatureActive = items.some((item) => item.href === pathname);
  const [isOpen, setIsOpen] = useState(isAnyFeatureActive);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAnyFeatureActive) {
      setIsOpen(true);
    }
  }, [isAnyFeatureActive]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll<HTMLElement>('.gradient-border-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
  };

  return (
    <div ref={containerRef} onPointerMove={handlePointerMove} className="space-y-1 my-2">
      {/* Dropdown Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`gradient-border-card group relative w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 border overflow-hidden ${
          isAnyFeatureActive
            ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
            : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/5 hover:text-white'
        }`}
      >
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(180px circle at var(--x, 50%) var(--y, 50%), rgba(6, 182, 212, 0.95), rgba(168, 85, 247, 0.8), transparent 70%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        <div className="flex items-center gap-3 relative z-10">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="font-bold text-sm font-inter">פיצ'רים מתקדמים</span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
            {items.length}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </button>

      {/* Collapsible Submenu */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden space-y-1.5 pr-3 pl-1 pt-1.5 border-r border-cyan-400/20 mr-3"
          >
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`gradient-border-card group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold font-inter transition-all duration-300 border overflow-hidden ${
                    isActive
                      ? 'bg-primary border-primary text-background shadow-[0_10px_20px_rgba(255,159,10,0.25)]'
                      : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div
                    className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(150px circle at var(--x, 50%) var(--y, 50%), rgba(255, 159, 10, 0.9), rgba(6, 182, 212, 0.75), transparent 70%)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                  />

                  <Icon className={`w-4 h-4 relative z-10 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
