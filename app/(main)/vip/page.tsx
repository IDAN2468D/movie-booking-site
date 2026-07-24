'use client';

import React from 'react';
import { VIPHero } from '@/components/vip/VIPHero';
import { ScrollytellingTour } from '@/components/vip/ScrollytellingTour';
import { SubscriptionMatrix } from '@/components/vip/SubscriptionMatrix';
import { DirectSavingsCalculator } from '@/components/vip/DirectSavingsCalculator';
import { QuantumStakingContainer } from '@/components/vip/QuantumStakingContainer';

export default function VipPage() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden text-right pb-32">
      {/* Dynamic Background Glows */}
      <div className="absolute top-10 left-10 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />

      {/* --- HERO HEADER --- */}
      <VIPHero />

      {/* --- SECTION 1: LOYALTY TOUR (STICKY SCROLLYTELLING) --- */}
      <ScrollytellingTour />

      {/* --- SECTION 2: CINEMATIC SUBSCRIPTION TIERS --- */}
      <SubscriptionMatrix />

      {/* --- SECTION: QUANTUM LOYALTY STAKING & NFT VAULT --- */}
      <div className="max-w-5xl mx-auto my-16 px-4">
        <QuantumStakingContainer />
      </div>

      {/* --- SECTION 3: DTC VALUE CALCULATOR --- */}
      <DirectSavingsCalculator />
    </div>
  );
}
