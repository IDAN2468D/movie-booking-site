'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Gift, Utensils, Bell, Settings, LogOut, Clapperboard, MapPin, RefreshCw,
  Heart, ShieldCheck, Crown, Compass, Zap, CalendarDays, Star, Share2, Newspaper,
  Disc3, Users, Mic, Trophy, Languages, Volume2, Sparkles, Activity, Shield, Gamepad2
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useBookingStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PremiumLogo } from "@/components/ui/PremiumLogo";
import { FeaturesDropdown, FeatureNavItem } from '@/src/components/layout/FeaturesDropdown';

interface NavItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  isChat?: boolean;
}

// Basic core navigation items
const basicNavItems: NavItem[] = [
  { icon: Home, label: 'בית', href: '/' },
  { icon: CalendarDays, label: 'בקרוב', href: '/coming-soon' },
  { icon: Star, label: 'החזון שלנו', href: '/vision' },
  { icon: Clapperboard, label: 'הכרטיסים שלי', href: '/tickets' },
  { icon: Heart, label: 'מועדפים', href: '/favorites' },
  { icon: Utensils, label: 'אוכל ושתייה', href: '/food' },
  { icon: Bell, label: 'התראות', href: '/notifications' },
  { icon: Crown, label: 'מועדון VIP', href: '/vip' },
  { icon: Gift, label: 'בונוסים', href: '/vip/bonuses' },
  { icon: Sparkles, label: 'עוזר AI', href: '/concierge' },
  { icon: Settings, label: 'הגדרות', href: '/profile' },
];

// Advanced feature items grouped inside the Dropdown
const featureNavItems: FeatureNavItem[] = [
  { icon: Gamepad2, label: 'Seating Matcher Game', href: '/booking/seating-game' },
  { icon: Sparkles, label: 'האופק התחושתי', href: '/sensory-horizon' },
  { icon: Activity, label: 'מרכז התהודה ההפטי', href: '/haptic' },
  { icon: Shield, label: 'תא האורה הביומטרי', href: '/aura-chamber' },
  { icon: Disc3, label: 'סנתזטור פסקול קוונטי', href: '/soundtrack-synth' },
  { icon: Users, label: 'מרכז הסנכרון הקבוצתי', href: '/nexus' },
  { icon: Volume2, label: 'כיול תהודה אקוסטית', href: '/prelude' },
  { icon: Sparkles, label: 'חוויה טרנסצנדנטלית', href: '/transcendent' },
  { icon: Languages, label: 'AI Subtitle Pitcher', href: '/subtitles' },
  { icon: Trophy, label: 'Trophy Vault', href: '/trophy-vault' },
  { icon: Mic, label: 'Voice AI Shell', href: '/voice-shell' },
  { icon: Users, label: 'Co-op Matcher', href: '/discover/coop' },
  { icon: Disc3, label: 'פסקולי סרטים', href: '/soundtracks' },
  { icon: Zap, label: 'Movie Matcher', href: '/showcase' },
  { icon: Compass, label: 'גילוי נוירוני', href: '/discovery' },
  { icon: Newspaper, label: 'חדשות קולנוע', href: '/news' },
  { icon: Share2, label: 'פיצול כרטיסים', href: '/splinter-demo' },
];



const ADMIN_ITEMS: NavItem[] = [
  { icon: ShieldCheck, label: 'מערכת ERP', href: '/erp' },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { location, setLocation } = useBookingStore();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const isAdmin = session?.user?.email === 'idankzm@gmail.com' || session?.user?.email === 'test@example.com';
  const mainNav = isAdmin ? [...basicNavItems, ...ADMIN_ITEMS] : basicNavItems;

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
    <aside className="hidden md:flex h-screen w-64 bg-black/10 backdrop-blur-3xl saturate-[200%] brightness-110 border-l border-white/10 flex-col py-10 px-6 z-50 flex-shrink-0 shadow-[0_0_40px_rgba(0,0,0,0.5),_inset_0_0_0_1px_rgba(255,255,255,0.1)] relative overflow-y-auto custom-scrollbar font-inter">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <Link href="/" className="mb-8 block">
        <PremiumLogo size="sm" />
      </Link>

      <nav className="flex-1 space-y-2 relative">
        {/* Core Basic Nav Items */}
        {mainNav.slice(0, 1).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative border ${
                isActive
                  ? 'bg-primary border-primary text-background shadow-[0_15px_30px_rgba(255,159,10,0.25)]'
                  : 'text-slate-300 border-transparent hover:bg-white/5 hover:text-white hover:border-white/10'
              }`}
            >
              <Icon className="w-5 h-5 relative z-10" />
              <span className="font-bold text-sm font-inter relative z-10">{item.label}</span>
            </Link>
          );
        })}

        {/* Feature Dropdown Section */}
        <FeaturesDropdown pathname={pathname || ''} items={featureNavItems} />


        {/* Remaining Basic Nav Items */}
        {mainNav.slice(1).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative border ${
                isActive
                  ? 'bg-primary border-primary text-background shadow-[0_15px_30px_rgba(255,159,10,0.25)]'
                  : 'text-slate-300 border-transparent hover:bg-white/5 hover:text-white hover:border-white/10'
              }`}
            >
              <Icon className="w-5 h-5 relative z-10" />
              <span className="font-bold text-sm font-inter relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Location Card & Logout */}
      <div className="space-y-4 mt-6 relative">
        <div
          onClick={() => router.push('/branches')}
          className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 relative overflow-hidden group shadow-2xl cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-white truncate max-w-[120px]">{location || 'בחר סניף...'}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleGPS(); }}
              disabled={isUpdating}
              className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isUpdating ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs font-bold border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>התנתקות מהמערכת</span>
        </button>
      </div>
    </aside>
  );
}
