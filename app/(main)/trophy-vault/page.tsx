import React from 'react';
import HolographicBackground from '@/components/ui/HolographicBackground';
import { GenerativeTrophyVault } from '@/components/rewards/GenerativeTrophyVault';

export const metadata = {
  title: 'Generative WebGL Trophy Vault | MovieBook',
  description: 'Interactive 3D holographic trophy vault displaying user achievements and cinephile awards',
};

export default function TrophyVaultPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-16 px-4 text-white font-['Inter']" dir="rtl">
      <HolographicBackground />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-6xl font-['Outfit'] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-300 to-purple-400 mb-4">
            Generative WebGL Trophy Vault
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto">
            כספת ההישגים ההולוגרפית המציגה את עיטורי הקולנוע והפרסים שצברת במערכת!
          </p>
        </div>

        <GenerativeTrophyVault />
      </div>
    </div>
  );
}
