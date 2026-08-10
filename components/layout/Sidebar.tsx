'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Gift, Utensils, Bell, Settings, LogOut, Clapperboard, MapPin, RefreshCw,
  Heart, ShieldCheck, Crown, Sparkles, CalendarDays, Star, Activity, Shield,
  Disc3, Users, Volume2, Languages, Trophy, Mic, Zap, Compass, Newspaper, Share2, Gamepad2
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useBookingStore } from '@/lib/store';
import { PremiumLogo } from "@/components/ui/PremiumLogo";
import { FeaturesDropdown, FeatureNavItem } from '@/src/components/layout/FeaturesDropdown';
import { SidebarNavItem } from './SidebarNavItem';

interface NavItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
}

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
  const sidebarRef = useRef<HTMLElement>(null);

  const isAdmin = session?.user?.email === 'idankzm@gmail.com' || session?.user?.email === 'test@example.com';
  const mainNav = isAdmin ? [...basicNavItems, ...ADMIN_ITEMS] : basicNavItems;

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!sidebarRef.current) return;
    const cards = sidebarRef.current.querySelectorAll<HTMLElement>('.gradient-border-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
  };

  const handleGPS = () => {
    if ("geolocation" in navigator) {
      setIsUpdating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || "עיר לא ידועה";
            setLocation(`${city}, ${data.address.country_code?.toUpperCase() || "??"}`);
          } catch {
            setLocation(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`);
          } finally { setIsUpdating(false); }
        },
        () => { setIsUpdating(false); alert("הגישה למיקום נדחתה."); }
      );
    }
  };

  return (
    <aside
      ref={sidebarRef}
      onPointerMove={handlePointerMove}
      className="hidden md:flex h-screen w-64 bg-black/10 backdrop-blur-3xl saturate-[200%] brightness-110 border-l border-white/10 flex-col py-10 px-6 z-50 flex-shrink-0 shadow-[0_0_40px_rgba(0,0,0,0.5),_inset_0_0_0_1px_rgba(255,255,255,0.1)] relative overflow-y-auto custom-scrollbar font-inter dir-rtl"
    >
      <Link href="/" className="mb-8 block">
        <PremiumLogo size="sm" />
      </Link>

      <nav className="flex-1 space-y-2 relative">
        {mainNav.slice(0, 1).map((item) => (
          <SidebarNavItem key={item.label} href={item.href} label={item.label} icon={item.icon} isActive={pathname === item.href} />
        ))}

        <FeaturesDropdown pathname={pathname || ''} items={featureNavItems} />

        {mainNav.slice(1).map((item) => (
          <SidebarNavItem key={item.label} href={item.href} label={item.label} icon={item.icon} isActive={pathname === item.href} />
        ))}
      </nav>

      <div className="space-y-4 mt-6 relative">
        <div
          onClick={() => router.push('/branches')}
          className="gradient-border-card group p-4 rounded-2xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 relative overflow-hidden shadow-2xl cursor-pointer active:scale-95 transition-transform"
        >
          <div
            className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(180px circle at var(--x, 50%) var(--y, 50%), rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.75), transparent 70%)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
          <div className="flex items-center justify-between relative z-10">
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
