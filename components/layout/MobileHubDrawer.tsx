'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Clapperboard, Bookmark, Heart, Crown, Dna, Volume2, Subtitles, Mic, Gem, Users, Trophy, MapPin, Settings, Headphones } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { useSession } from 'next-auth/react';

interface HubItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  badge?: string;
  color: string;
}

const PERSONAL_ITEMS: HubItem[] = [
  { icon: Clapperboard, label: 'הכרטיסים שלי', href: '/tickets', color: 'text-amber-400' },
  { icon: Bookmark, label: 'רשימת צפייה', href: '/watchlist', color: 'text-cyan-400' },
  { icon: Heart, label: 'מועדפים', href: '/favorites', color: 'text-rose-400' },
  { icon: Crown, label: 'מועדון VIP', href: '/vip', color: 'text-yellow-400', badge: 'PRO' },
];

const AI_SENSORY_ITEMS: HubItem[] = [
  { icon: Dna, label: 'גנום קולנועי CineDNA', href: '/cinedna', color: 'text-cyan-400' },
  { icon: Volume2, label: 'אקוסטיקה 3D SweetSpot', href: '/sweetspot', color: 'text-primary' },
  { icon: Subtitles, label: 'כתוביות חיות CineSub', href: '/cinesub', color: 'text-indigo-400', badge: 'LIVE' },
  { icon: Mic, label: 'פקודות קוליות AI', href: '/voice-shell', color: 'text-purple-400' },
  { icon: Gem, label: 'כספת שברי זיכרון', href: '/memory-capsules', color: 'text-pink-400' },
  { icon: Headphones, label: 'פרשנות במאי קולית', href: '/directors-cut', color: 'text-emerald-400' },
];

const SOCIAL_TOOLS_ITEMS: HubItem[] = [
  { icon: Users, label: 'הקרנות קהילה CineCrowd', href: '/cinecrowd', color: 'text-blue-400' },
  { icon: Users, label: 'הזמנה קבוצתית ופיצול', href: '/cinesquad', color: 'text-violet-400' },
  { icon: Trophy, label: 'כספת גביעים והישגים', href: '/trophy-vault', color: 'text-amber-300' },
  { icon: MapPin, label: 'סניפים ואיתור אולמות', href: '/branches', color: 'text-emerald-400' },
  { icon: Settings, label: 'הגדרות ופרופיל', href: '/profile', color: 'text-slate-300' },
];

export default function MobileHubDrawer() {
  const { isMobileHubOpen, setMobileHubOpen } = useUIStore();
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === 'idankzm@gmail.com' || session?.user?.email === 'test@example.com';

  const close = () => setMobileHubOpen(false);

  const openSearch = () => {
    close();
    window.dispatchEvent(new CustomEvent('open-spotlight-search'));
  };

  return (
    <AnimatePresence>
      {isMobileHubOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end" dir="rtl">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Sheet Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 w-full max-h-[88vh] bg-[#0A0D14]/95 backdrop-blur-3xl saturate-[240%] border-t border-white/15 rounded-t-[36px] shadow-[0_-20px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden"
          >
            {/* Grab Bar & Header */}
            <div className="pt-3 pb-2 px-6 flex flex-col items-center border-b border-white/10 shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-white/20 mb-3" />
              <div className="w-full flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white font-outfit">מרכז פעולות CinePulse</h3>
                  <p className="text-[11px] text-slate-400 font-medium">כל חוויות הקולנוע, ה-AI והכרטיסים במקום אחד</p>
                </div>
                <button
                  onClick={close}
                  aria-label="סגור תפריט"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 pb-28">
              {/* Quick Search Shortcut */}
              <button
                onClick={openSearch}
                className="w-full h-12 rounded-2xl bg-white/[0.04] border border-white/10 px-4 flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
              >
                <Search size={16} className="text-primary" />
                <span className="text-xs font-bold">חיפוש סרטים, שחקנים וז׳אנרים...</span>
              </button>

              {/* 1. אישי וכרטיסים */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">כרטיסים ואישי</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {PERSONAL_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.07] transition-all relative overflow-hidden"
                      >
                        <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}>
                          <Icon size={18} />
                        </div>
                        <span className="text-xs font-black text-white truncate">{item.label}</span>
                        {item.badge && (
                          <span className="absolute top-2 left-2 text-[8px] font-black px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* 2. AI וחוויות קולנוע סנסוריות */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">AI וקולנוע סנסורי</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {AI_SENSORY_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.07] transition-all relative overflow-hidden"
                      >
                        <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}>
                          <Icon size={18} />
                        </div>
                        <span className="text-xs font-black text-white truncate">{item.label}</span>
                        {item.badge && (
                          <span className="absolute top-2 left-2 text-[8px] font-black px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* 3. קהילה, סניפים וכלים */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">קהילה וסניפים</p>
                <div className="grid grid-cols-1 gap-2">
                  {SOCIAL_TOOLS_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.07] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}>
                            <Icon size={18} />
                          </div>
                          <span className="text-xs font-black text-white">{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                  {isAdmin && (
                    <Link
                      href="/erp"
                      onClick={close}
                      className="flex items-center justify-between p-3 rounded-2xl bg-primary/10 border border-primary/30 text-primary"
                    >
                      <span className="text-xs font-black">ניהול מערכת ERP</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
