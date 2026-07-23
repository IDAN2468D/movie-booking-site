import React from 'react';
import HolographicBackground from '@/components/ui/HolographicBackground';
import { VoiceAiCommandShell } from '@/components/ai/VoiceAiCommandShell';

export const metadata = {
  title: 'Voice AI Command Shell | MovieBook',
  description: 'Hands-free voice AI natural language site navigation assistant',
};

export default function VoiceShellPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-16 px-4 text-white font-['Inter']" dir="rtl">
      <HolographicBackground />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-6xl font-['Outfit'] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 mb-4">
            Voice AI Command Shell
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto">
            עזר קולי נוירוני לניווט חופשי וללא מגע ידים באתר הסרטים בעזרת זיהוי דיבור בעברית ו-AI!
          </p>
        </div>

        <VoiceAiCommandShell />
      </div>
    </div>
  );
}
