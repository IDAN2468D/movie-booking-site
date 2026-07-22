import React from 'react';
import NewsWidget from '@/components/home/NewsWidget';
import HolographicBackground from '@/components/ui/HolographicBackground';
import { SocialPulseRings } from '@/components/home/SocialPulseRings';

export default function NewsPage() {
  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden [transform:translateZ(0)]">
      <HolographicBackground />
      <SocialPulseRings />
      
      <div className="relative z-10 flex flex-col items-center justify-center pt-24 px-4 sm:px-6 lg:px-8 min-h-[80vh] w-full">
        <div className="w-full max-w-7xl">
          <NewsWidget fullWidth />
        </div>
      </div>
    </div>
  );
}
