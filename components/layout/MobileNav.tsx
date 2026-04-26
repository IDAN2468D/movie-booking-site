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
    <div className="md:hidden fixed bottom-10 inset-x-0 z-50 flex justify-center px-6 pointer-events-none">
      <nav className="pointer-events-auto relative h-20 w-full max-w-[420px] bg-black/40 backdrop-blur-[60px] saturate-[280%] brightness-110 rounded-[40px] border-[0.5px] border-white/20 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.15)] flex items-center justify-around flex-row-reverse overflow-hidden px-2">
        {/* Holographic Interior Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-cyan-500/10 opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center justify-center h-full flex-1 transition-all duration-500"
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavActivePill"
                  className="absolute inset-x-1 inset-y-2 bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-[24px] shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className={`relative transition-all duration-500 ${isActive ? 'scale-125 -translate-y-0.5' : 'opacity-40 hover:opacity-100'}`}>
                  <Icon 
                    size={24} 
                    className={`${isActive ? 'text-primary drop-shadow-[0_0_20px_rgba(255,159,10,0.8)]' : 'text-white'}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  
                  {/* Active Aura */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeAura"
                      className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10"
                    />
                  )}
                </div>
              </div>

              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute bottom-2.5 w-6 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
