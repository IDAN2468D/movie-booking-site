'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gift, Utensils, Bell, Settings, LogOut, Clapperboard, MapPin, RefreshCw, Sparkles, Heart } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useBookingStore } from '@/lib/store';

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
    <aside className="hidden md:flex h-screen w-64 bg-[#1A1A1A] border-l border-white/5 flex-col py-8 px-6 z-50 flex-shrink-0">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-[#FF9F0A] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,159,10,0.3)]">
          <Clapperboard className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">MOVIEBOOK</span>
      </div>

      <nav className="flex-1 space-y-2">
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
                  // Dispatch a custom event to open the chat
                  window.dispatchEvent(new CustomEvent('open-movie-chat'));
                }
              }}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-[#FF9F0A] text-white shadow-[0_8px_20px_rgba(255,159,10,0.2)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Futuristic Location Card */}
      <div className="mb-6 p-4 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF9F0A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <button 
              onClick={handleGPS}
              disabled={isUpdating}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors group/btn"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 group-hover/btn:text-primary transition-all ${isUpdating ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">מוקד פעיל</p>
            <p className="text-sm font-black text-white truncate">{location}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">מערכת מסונכרנת</span>
          </div>
        </div>
        
        {/* Animated Background Decor */}
        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
      </div>

      <button 
        onClick={() => signOut()}
        className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
      >
        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">התנתקות</span>
      </button>
    </aside>
  );
}
