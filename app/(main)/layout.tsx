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

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <div ref={mainRef} className="min-h-screen bg-[#0A0A0A] overflow-x-hidden" dir="rtl">
          {children}
          <HeartbeatInit />
        </div>
      </ResolutionWrapper>
    );
  }

  return (
    <ResolutionWrapper>
      <ParticleUniverse />
      <div 
        className="flex h-screen overflow-hidden transition-colors duration-1000 relative z-0" 
        dir="rtl"
        style={{
          '--primary': auraColor,
        } as React.CSSProperties}
      >
        {/* Right Sidebar - Responsive */}
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

        {/* Performance Optimization for Render */}
      </div>
    </ResolutionWrapper>
  );
}
