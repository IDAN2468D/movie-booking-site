'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Clapperboard, Utensils, Bell, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'בית', href: '/' },
  { icon: Clapperboard, label: 'הכרטיסים', href: '/tickets' },
  { icon: Utensils, label: 'אוכל', href: '/food' },
  { icon: Bell, label: 'התראות', href: '/notifications' },
  { icon: Settings, label: 'פרופיל', href: '/profile' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-8 inset-x-0 mx-auto w-[92%] max-w-md h-16 bg-black/40 backdrop-blur-[50px] saturate-[250%] brightness-110 rounded-[32px] border-[0.5px] border-white/20 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.1)] flex items-center justify-around z-50 flex-row-reverse overflow-hidden transition-all duration-500">
      {/* Holographic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9F0A]/5 via-transparent to-[#0AEFFF]/5 pointer-events-none" />
      
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`relative flex flex-col items-center gap-1 transition-all duration-500 py-2 px-3 rounded-xl ${
              isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="mobileNavActive"
                className="absolute inset-0 bg-white/[0.05] rounded-xl"
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            
            <div className={`relative z-10 transition-transform duration-500 ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>
              <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_12px_rgba(255,159,10,0.6)]' : ''}`} />
            </div>
            <span className={`relative z-10 text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-500 font-outfit ${isActive ? 'opacity-100 text-glow' : 'opacity-40'}`}>
              {item.label}
            </span>

            {isActive && (
              <motion.div 
                layoutId="activeDot"
                className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(255,159,10,0.8)]"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
