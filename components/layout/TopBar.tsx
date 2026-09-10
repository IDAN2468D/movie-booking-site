'use client';

import React from 'react';
import FilterModal from './FilterModal';
import NeuralSearch from './TopBar/NeuralSearch';
import CinemaExperienceMenu from './TopBar/CinemaExperienceMenu';
import { useBookingStore } from '@/lib/store';
import Link from 'next/link';
import { Search, Bell, Keyboard, Film } from 'lucide-react';
import { PremiumLogo } from '@/components/ui/PremiumLogo';
import LiveActivityPulse from '@/components/ui/LiveActivityPulse';
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer';
import { useNotificationStore } from '@/lib/store/notification-store';
import VoiceOrb from '@/components/ai/VoiceOrb';
import SpotlightSearchModal from '@/components/search/SpotlightSearchModal';
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
      <header 
        style={{ transform: 'translate3d(0, 0, 0)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
        className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 bg-black/60 backdrop-blur-xl md:backdrop-blur-[40px] saturate-[180%] sticky top-0 z-40 border-b border-white/10 shadow-[0_15px_45px_rgba(0,0,0,0.6)] transform-gpu"
      >
        {/* Holographic Subtle Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />

        {/* Mobile Logo - Hidden when searching */}
        {!isMobileSearchOpen && (
          <Link href="/" className="flex md:hidden items-center relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <PremiumLogo size="sm" />
          </Link>
        )}

        <div className={`flex items-center gap-4 md:gap-8 flex-1 ${isMobileSearchOpen ? 'w-full' : 'max-w-[1600px] justify-end md:justify-start'} relative z-10 transition-all duration-500`}>
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
          <div className="flex items-center gap-2 md:gap-3 relative z-10 md:mr-0 mr-2 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Consolidated Cinema Experience Hub */}
            <div className="hidden sm:flex items-center">
              <CinemaExperienceMenu onOpenCineSub={() => setIsCineSubOpen(true)} />
            </div>

            {/* Subtle Divider */}
            <div className="hidden lg:block w-px h-5 bg-white/10 mx-0.5" />

            {/* AI & Media Suite */}
            <div className="flex items-center gap-2">
              <VoiceOrb />

              {/* Trailer Library Picker Trigger */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-trailer-picker'))}
                title="ספריית טריילרים קולנועית (לחץ T / א)"
                aria-label="פתח ספריית טריילרים קולנועית"
                className="hidden sm:flex relative w-10 h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 text-white/70 hover:text-primary transition-all shadow-md active:scale-95 shrink-0 group cursor-pointer"
              >
                <Film size={18} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span className="absolute -bottom-1 -left-1 px-1 rounded bg-black/80 text-primary font-mono text-[9px] border border-primary/30">T</span>
              </button>
            </div>

            {/* Subtle Divider */}
            <div className="hidden sm:block w-px h-5 bg-white/10 mx-0.5" />

            {/* System Utilities: Shortcuts, Notifications, Live Activity */}
            <div className="flex items-center gap-2">
              {/* Keyboard Shortcuts Trigger */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-shortcuts-modal'))}
                title="לוח קיצורי מקלדת (לחץ ?)"
                aria-label="הצג לוח קיצורי מקלדת"
                className="hidden sm:flex relative w-10 h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 text-white/70 hover:text-primary transition-all shadow-md active:scale-95 shrink-0 group cursor-pointer"
              >
                <Keyboard size={18} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
              </button>

              <button
                onClick={() => setIsNotificationsOpen(true)}
                aria-label={unreadCount > 0 ? `התראות - יש ${unreadCount} התראות חדשות` : "פתח מרכז התראות"}
                title="התראות"
                className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white/80 hover:text-white transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
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
