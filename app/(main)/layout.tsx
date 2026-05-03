'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import RightPanel from "@/components/layout/RightPanel";
import MobileNav from "@/components/layout/MobileNav";
import { HeartbeatInit } from "@/components/utils/HeartbeatInit";
import ResolutionWrapper from "@/components/layout/ResolutionWrapper";
import MovieChatBot from "@/components/chat/MovieChatBot";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isERP = pathname?.startsWith('/erp');

  if (isERP) {
    return (
      <ResolutionWrapper>
        <div className="min-h-screen bg-[#0A0A0A] overflow-x-hidden" dir="rtl">
          {children}
          <HeartbeatInit />
        </div>
      </ResolutionWrapper>
    );
  }

  return (
    <ResolutionWrapper>
      <div className="flex h-screen overflow-hidden" dir="rtl">
        {/* Right Sidebar - Responsive */}
        <Sidebar />

        {/* Main Center Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto scrollbar-hide pb-44 md:pb-0">
            {children}
          </main>
        </div>

        {/* Left Panel - Live Cinema / Booking */}
        <RightPanel />

        {/* Mobile Navigation */}
        <MobileNav />

        {/* AI Chatbot */}
        <MovieChatBot />

        {/* Performance Optimization for Render */}
        <HeartbeatInit />
      </div>
    </ResolutionWrapper>
  );
}
