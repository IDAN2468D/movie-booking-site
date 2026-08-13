import React from 'react';
import { HapticWavefrontModulator } from '@/components/audio/HapticWavefrontModulator';
import { VIPSeatAuctionStream } from '@/components/vip/VIPSeatAuctionStream';
import { NeuralSceneGraphModal } from '@/components/ai/NeuralSceneGraphModal';
import { AcousticActorBioPlayer } from '@/components/actor/AcousticActorBioPlayer';
import { ChronoNFCScannerModal } from '@/components/tickets/ChronoNFCScannerModal';
import { Interactive4ColorIndicator } from '@/components/ui/Interactive4ColorIndicator';
import { Sparkles, Layers, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'CinePulse - Master Upgrade Suite Phase 40 Showcase',
  description: 'תצוגה אינטראקטיבית של כל 5 הפיצ׳רים החדשים מ-Phase 40 (ספרינטים 102-106).',
};

export default function MasterSuiteShowcasePage() {
  return (
    <div dir="rtl" className="min-h-screen bg-neutral-950 text-white p-6 md:p-12 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4 border-b border-neutral-800 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>CinePulse Labs - סוויטת העתיד 🚀</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black font-outfit tracking-tight bg-gradient-to-r from-white via-neutral-200 to-cyan-400 bg-clip-text text-transparent">
            מרכז התצוגה האינטראקטיבי למודולים החדשים באתר
          </h1>

          <p className="text-sm md:text-base text-neutral-400 max-w-2xl mx-auto">
            ממשקי Liquid Glass 4.0, מנועי אקוסטיקה תלת-ממדיים, ניתוחי בינה מלאכותית Gemini, ואבטחת NFC ביומטרית בלייב.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
          <section className="w-full lg:col-span-2 flex justify-center">
            <Interactive4ColorIndicator size={140} />
          </section>

          <section className="w-full flex justify-center">
            <HapticWavefrontModulator />
          </section>

          <section className="w-full flex justify-center">
            <VIPSeatAuctionStream />
          </section>

          <section className="w-full flex justify-center">
            <NeuralSceneGraphModal />
          </section>

          <section className="w-full flex justify-center">
            <AcousticActorBioPlayer />
          </section>

          <section className="w-full lg:col-span-2 flex justify-center">
            <ChronoNFCScannerModal />
          </section>
        </main>

        <footer className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Agent Stack Framework v9.5 SDD</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>120Hz GPU Performance & 200 LOC Isolated Components</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
