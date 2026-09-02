'use client';

import React, { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useScroll } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import RightPanel from "@/components/layout/RightPanel";
import MobileNav from "@/components/layout/MobileNav";
import { HeartbeatInit } from "@/components/utils/HeartbeatInit";
import ResolutionWrapper from "@/components/layout/ResolutionWrapper";
import { useBookingStore } from '@/lib/store';
import { ParticleUniverse } from "@/components/fx/ParticleUniverse";
import { GlobalGradientFrame } from "@/components/ui/GlobalGradientFrame";
import FloatingTrailerPlayer from "@/components/media/FloatingTrailerPlayer";
import KeyboardShortcutsModal from "@/components/ui/KeyboardShortcutsModal";
import TrailerPickerModal from "@/components/trailer/TrailerPickerModal";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { StealthTrayOverlay } from "@/components/concessions/StealthTrayOverlay";
import { WhisperTrackBar } from "@/components/audio/WhisperTrackBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useGlobalShortcuts();
  const pathname = usePathname();
  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: mainRef });
  
  const auraColor = useBookingStore((state) => state.auraColor);
  const syncFavorites = useBookingStore((state) => state.syncFavorites);
  const { data: session, status } = useSession();
  const isERP = pathname?.startsWith('/erp');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      syncFavorites(session.user.id);
    }
  }, [status, session, syncFavorites]);

  if (isERP) {
    return (
      <ResolutionWrapper>
        <GlobalGradientFrame>
          <div ref={mainRef} className="min-h-screen bg-[#0A0A0A] overflow-x-hidden" dir="rtl">
            {children}
            <HeartbeatInit />
          </div>
        </GlobalGradientFrame>
      </ResolutionWrapper>
    );
  }

  return (
    <ResolutionWrapper>
      <GlobalGradientFrame>
        <ParticleUniverse />
        <div 
          className="flex h-screen overflow-hidden transition-colors duration-1000 relative z-0" 
          dir="rtl"
          style={{
            '--primary': auraColor,
          } as React.CSSProperties}
        >
          {/* Right Sidebar */}
          <Sidebar />

          {/* Main Center Area */}
          <div className="flex-1 flex flex-col min-w-0 relative">
            <TopBar />
            {/* Global Scroll Progress Bar */}
            <motion.div 
              style={{ scaleX: scrollYProgress, transformOrigin: 'right' }}
              className="absolute top-16 md:top-24 left-0 right-0 h-[3px] bg-gradient-to-l from-primary via-[#FF1464] to-cyan-400 z-50 shadow-[0_0_12px_rgba(255,20,100,0.8)] pointer-events-none"
            />
            <main ref={mainRef} className="flex-1 overflow-y-auto scrollbar-hide pb-44 md:pb-0">
              {children}
            </main>
          </div>

          {/* Left Panel - Live Cinema / Booking */}
          <RightPanel />

          {/* Mobile Navigation */}
          <MobileNav />

          {/* Global Floating Cinema Trailer Player */}
          <FloatingTrailerPlayer />

          {/* Global Keyboard Shortcuts Cheat Sheet Modal */}
          <KeyboardShortcutsModal />

          {/* Global Trailer Picker Library Hub */}
          <TrailerPickerModal />

          {/* In-Theater Stealth Tray Mode (Ultra-Dark Concessions) */}
          <StealthTrayOverlay />

          {/* WhisperTrack In-Seat Audio Stream Bar */}
          <WhisperTrackBar />
        </div>
      </GlobalGradientFrame>
    </ResolutionWrapper>
  );
}
