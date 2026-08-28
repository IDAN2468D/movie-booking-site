'use client';

import React from 'react';
import FilterModal from './FilterModal';
import NeuralSearch from './TopBar/NeuralSearch';
import UserProfile from './TopBar/UserProfile';
import { useBookingStore } from '@/lib/store';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from 'next/image';
import Link from 'next/link';
import { Search, Bell, Keyboard, Film, Subtitles } from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MarkerHighlight } from '@/components/fx/MarkerHighlight';
import { PremiumLogo } from '@/components/ui/PremiumLogo';
import LiveActivityPulse from '@/components/ui/LiveActivityPulse';
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer';
import { useNotificationStore } from '@/lib/store/notification-store';
import VoiceOrb from '@/components/ai/VoiceOrb';
import SpotlightSearchModal from '@/components/search/SpotlightSearchModal';
import DayNightLightingPill from '@/components/home/DayNightLightingPill';
import CineSubTranscriberModal from '@/components/movie/CineSubTranscriberModal';


export default function TopBar() {
  const { filters, setFilters } = useBookingStore();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = React.useState(false);
  const [isCineSubOpen, setIsCineSubOpen] = React.useState(false);
  const unreadCount = useNotificationStore(
    React.useCallback((state) => state.notifications.filter((n) => n.unread).length, [])
  );

  React.useEffect(() => {
    const handleOpenSpotlight = () => setIsSpotlightOpen(true);
    const handleOpenCineSub = () => setIsCineSubOpen(true);
    window.addEventListener('open-spotlight-search', handleOpenSpotlight);
    window.addEventListener('open-cinesub-transcriber', handleOpenCineSub);
    return () => {
      window.removeEventListener('open-spotlight-search', handleOpenSpotlight);
      window.removeEventListener('open-cinesub-transcriber', handleOpenCineSub);
    };
  }, []);

  const genres = ['הכל', 'פעולה', 'מדע בדיוני', 'דרמה', 'אימה', 'קומדיה'];
  const years = ['הכל', '2024', '2025', '2026'];

  return (
    <>
      <header className="h-16 md:h-24 flex items-center justify-between px-4 md:px-10 bg-black/40 backdrop-blur-[40px] saturate-[200%] brightness-110 sticky top-0 z-40 border-b-[0.5px] border-white/20 shadow-[0_15px_45px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-700">
        {/* Holographic Subtle Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />

        {/* Mobile Logo - Hidden when searching */}
        {!isMobileSearchOpen && (
          <Link href="/" className="flex md:hidden items-center relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <PremiumLogo size="sm" />
          </Link>
        )}

        <div className={`flex items-center gap-4 md:gap-10 flex-1 ${isMobileSearchOpen ? 'w-full' : 'max-w-[1600px] justify-end md:justify-start'} relative z-10 transition-all duration-500`}>
          {/* Search Bar - Desktop: Always visible, Mobile: Conditional */}
          <div className={`${isMobileSearchOpen ? 'block w-full animate-in slide-in-from-left-4 duration-500' : 'hidden'} md:block flex-1`}>
            <NeuralSearch 
              onOpenFilter={() => setIsFilterOpen(true)} 
              isMobile={isMobileSearchOpen}
              onCloseMobile={() => setIsMobileSearchOpen(false)}
            />
          </div>
          
          {/* Mobile Search Toggle Button */}
          {!isMobileSearchOpen && (
            <button 
              onClick={() => setIsMobileSearchOpen(true)}
              aria-label="פתח חיפוש קולי וחכם"
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-2xl border border-white/10 text-white shadow-xl active:scale-90 transition-all group animate-in fade-in zoom-in duration-500"
            >
              <Search className="w-5 h-5 group-hover:text-primary transition-colors" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* User Profile & Actions - Hidden on mobile search */}
        {!isMobileSearchOpen && (
          <div className="flex items-center gap-2.5 md:gap-4 relative z-10 md:mr-0 mr-2 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Dynamic Day/Night Lighting Pill */}
            <DayNightLightingPill />

            {/* AI Concierge Trigger */}
            <VoiceOrb />

            {/* CineSub AI Live Trigger */}
            <button
              onClick={() => setIsCineSubOpen(true)}
              title="כתוביות חיות CineSub AI (לחץ C)"
              aria-label="פתח כתוביות חיות CineSub AI"
              className="relative h-10 px-2.5 sm:px-3 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/15 hover:from-cyan-500/25 hover:to-indigo-500/25 border border-cyan-400/30 hover:border-cyan-400/60 text-cyan-300 transition-all shadow-lg active:scale-95 shrink-0 group cursor-pointer"
            >
              <Subtitles size={17} className="text-cyan-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <span className="hidden xl:inline text-[11px] font-bold tracking-tight text-white/90">CineSub AI</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>


            {/* Trailer Library Picker Trigger */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-trailer-picker'))}
              title="ספריית טריילרים קולנועית (לחץ T / א)"
              aria-label="פתח ספריית טריילרים קולנועית"
              className="hidden sm:flex relative w-10 h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 text-white/70 hover:text-primary transition-all shadow-xl active:scale-95 shrink-0 group"
            >
              <Film size={18} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
              <span className="absolute -bottom-1 -left-1 px-1 rounded bg-black/80 text-primary font-mono text-[9px] border border-primary/30">T</span>
            </button>

            {/* Keyboard Shortcuts Trigger */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-shortcuts-modal'))}
              title="לוח קיצורי מקלדת (לחץ ?)"
              aria-label="הצג לוח קיצורי מקלדת"
              className="hidden sm:flex relative w-10 h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 text-white/70 hover:text-primary transition-all shadow-xl active:scale-95 shrink-0 group"
            >
              <Keyboard size={18} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
            </button>

            <button
              onClick={() => setIsNotificationsOpen(true)}
              aria-label={unreadCount > 0 ? `התראות - יש ${unreadCount} התראות חדשות` : "פתח מרכז התראות"}
              title="התראות"
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white/80 hover:text-white transition-all shadow-xl active:scale-95 shrink-0"
            >
              <Bell size={18} aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-black text-[9px] font-black rounded-full flex items-center justify-center border-2 border-black animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="hidden sm:block">
              <LiveActivityPulse />
            </div>
          </div>
        )}
      </header>

      <FilterModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedGenre={filters.genre}
        setSelectedGenre={(genre) => setFilters({ genre })}
        minRating={filters.rating}
        setMinRating={(rating) => setFilters({ rating })}
        year={filters.year}
        setYear={(year) => setFilters({ year })}
        genres={genres}
        years={years}
      />

      <NotificationDrawer 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />

      <SpotlightSearchModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />

      <CineSubTranscriberModal
        isOpen={isCineSubOpen}
        onClose={() => setIsCineSubOpen(false)}
        movieTitle="שידור קולנועי חי - CinePulse Live"
      />
    </>
  );
}
