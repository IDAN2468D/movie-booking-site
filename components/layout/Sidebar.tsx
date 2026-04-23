'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gift, Utensils, Bell, Settings, LogOut, Clapperboard, MapPin, RefreshCw, Sparkles, Heart } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useBookingStore } from '@/lib/store';

import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'בית', href: '/' },
  { icon: Clapperboard, label: 'הכרטיסים שלי', href: '/tickets' },
  { icon: Heart, label: 'מועדפים', href: '/favorites' },
  { icon: Gift, label: 'בונוסים', href: '/rewards' },
  { icon: Utensils, label: 'אוכל ושתייה', href: '/food' },
  { icon: Bell, label: 'התראות', href: '/notifications' },
  { icon: Sparkles, label: 'עוזר AI', href: '#chat', isChat: true },
  { icon: Settings, label: 'הגדרות', href: '/profile' },
];


export default function Sidebar() {
  const pathname = usePathname();
  const { location, setLocation } = useBookingStore();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleGPS = () => {
    if ("geolocation" in navigator) {
      setIsUpdating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "עיר לא ידועה";
            const country = data.address.country_code?.toUpperCase() || "??";
            setLocation(`${city}, ${country}`);
          } catch {
            setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          } finally {
            setIsUpdating(false);
          }
        },
        () => {
          setIsUpdating(false);
          alert("הגישה למיקום נדחתה.");
        }
      );
    }
  };

  return (
    <aside className="hidden md:flex h-screen w-64 bg-white/[0.02] backdrop-blur-3xl border-l border-white/10 flex-col py-10 px-6 z-50 flex-shrink-0 shadow-[20px_0_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-14 px-2 relative group">
        <div className="w-12 h-12 bg-primary/20 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(255,159,10,0.15)] group-hover:scale-110 transition-transform duration-700">
          <Clapperboard className="text-primary w-6 h-6 drop-shadow-[0_0_10px_rgba(255,159,10,0.5)]" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-white tracking-tighter font-outfit leading-none">MOVIEBOOK</span>
          <span className="text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] mt-1">Premium Cinema</span>
        </div>
      </div>

      <nav className="flex-1 space-y-3 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (item.isChat) {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open-movie-chat'));
                }
              }}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden border ${
                isActive 
                  ? 'bg-primary border-primary text-background shadow-[0_15px_30px_rgba(255,159,10,0.25)]' 
                  : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white hover:border-white/10'
              }`}
            >
              {/* Hover Glow Effect */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}
              
              <Icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 relative z-10 ${isActive ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]' : ''}`} />
              <span className="font-bold text-sm tracking-tight font-inter relative z-10">{item.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-1.5 w-1 h-6 bg-background/30 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-6 relative">
        {/* Futuristic Location Card */}
        <div className="p-5 rounded-[32px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 backdrop-blur-xl border border-primary/20 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <button 
                onClick={handleGPS}
                disabled={isUpdating}
                className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 group/btn active:scale-90"
              >
                <RefreshCw className={`w-4 h-4 text-slate-400 group-hover/btn:text-primary transition-all ${isUpdating ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">מוקד פעיל</p>
              <p className="text-sm font-black text-white truncate font-outfit">{location}</p>
            </div>

            <div className="mt-5 pt-5 border-t border-white/5 flex items-center gap-2.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">מערכת מסונכרנת</span>
            </div>
          </div>
          
          {/* Animated Background Decor */}
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/25 transition-all duration-1000" />
        </div>

        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-500 group border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-500" />
          <span className="font-bold text-sm">התנתקות מהמערכת</span>
        </button>
      </div>
    </aside>
  );
}
