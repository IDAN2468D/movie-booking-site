import React from 'react';
import HolographicBackground from '@/components/ui/HolographicBackground';
import { CoopVsSwipeDeck } from '@/components/discovery/CoopVsSwipeDeck';

export const metadata = {
  title: 'Co-op VS Movie Matcher | MovieBook',
  description: 'Dual-player movie swipe matching for couples and friends',
};

export default function CoopMatchPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-16 px-4 text-white font-['Inter']" dir="rtl">
      <HolographicBackground />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-6xl font-['Outfit'] font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 mb-4">
            Co-op VS Movie Matcher
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto">
            בחרו סרט ביחד בזמן אמת! שני שחקנים הצביעו במקביל וכאשר תהיה התאמה — יופעל אפקט הניצחון!
          </p>
        </div>

        <CoopVsSwipeDeck />
      </div>
    </div>
  );
}
