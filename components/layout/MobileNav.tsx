'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Clapperboard, Utensils, Bell, Settings } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'בית', href: '/' },
  { icon: Clapperboard, label: 'הכרטיסים שלי', href: '/tickets' },
  { icon: Utensils, label: 'אוכל', href: '/food' },
  { icon: Bell, label: 'התראות', href: '/notifications' },
  { icon: Settings, label: 'פרופיל', href: '/profile' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#1A1A1A]/95 backdrop-blur-lg border-t border-white/5 px-6 flex items-center justify-between z-50 flex-row-reverse">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? 'text-[#FF9F0A]' : 'text-slate-500'
            }`}
          >
            <div className={`p-1 rounded-lg transition-all ${isActive ? 'bg-[#FF9F0A]/10 scale-110' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
