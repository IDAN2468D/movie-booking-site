import React from 'react';
import HolographicBackground from '@/components/ui/HolographicBackground';
import { SubBassSubtitlePitcher } from '@/components/media/SubBassSubtitlePitcher';

export const metadata = {
  title: 'Live AI Subtitle Translator & Pitcher | MovieBook',
  description: 'Real-time AI multi-lingual subtitle translation and Web Audio pitch shifter',
};

export default function SubtitlesPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-16 px-4 text-white font-['Inter']" dir="rtl">
      <HolographicBackground />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-6xl font-['Outfit'] font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 mb-4">
            Live AI Subtitle Translator & Pitcher
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto">
            מנוע תרגום כתוביות AI בזמן אמת והתאמת גובה צליל אקוסטי (Pitch Shift) לחוויה קולנועית רב-לשונית!
          </p>
        </div>

        <SubBassSubtitlePitcher />
      </div>
    </div>
  );
}
