'use client';

import React, { useState } from 'react';
import { Gavel, BrainCircuit, Users, Diamond, Wind, Coffee, Lock, Ghost, Activity } from 'lucide-react';
import { SeatAuctions } from './SeatAuctions';
import { OracleBets } from './OracleBets';
import { SquadBudgets } from './SquadBudgets';
import { CineCollectibles } from './CineCollectibles';
import { MovieHaptics } from './MovieHaptics';
import { NeuralCatering } from './NeuralCatering';
import { TemporalVaults } from './TemporalVaults';
import { PhantomPresence } from './PhantomPresence';
import { QuantumLoyalty } from './QuantumLoyalty';

export const LiquidHubTabs = ({ 
  auctions, predictions, squads, collectibles, catering, vaults, phantom, loyalty
}: { 
  auctions: any[], predictions: any[], squads: any[], collectibles: any[],
  catering: any[], vaults: any[], phantom: any[], loyalty: any[]
}) => {
  const [activeTab, setActiveTab] = useState('loyalty');

  const tabs = [
    { id: 'loyalty', label: 'VIP Status', icon: Activity },
    { id: 'phantom', label: 'Cine-Ghosting', icon: Ghost },
    { id: 'vaults', label: '8K Vaults', icon: Lock },
    { id: 'catering', label: 'BiteMatrix', icon: Coffee },
    { id: 'oracle', label: 'הימורי אורקל', icon: BrainCircuit },
    { id: 'squad', label: 'קופת חברים', icon: Users },
    { id: 'collectibles', label: 'אספנות', icon: Diamond },
    { id: 'haptics', label: '4DX', icon: Wind },
    { id: 'auctions', label: 'מכרזים', icon: Gavel },
  ];

  return (
    <div className="w-full mt-4">
      <div className="flex overflow-x-auto pb-4 gap-2 border-b border-white/10 mb-8 hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white/10 text-white border-b-2 border-[#fbbf24]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white/80'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="w-full relative min-h-[400px]">
        {activeTab === 'loyalty' && <QuantumLoyalty initialLoyalty={loyalty} />}
        {activeTab === 'phantom' && <PhantomPresence initialInvites={phantom} />}
        {activeTab === 'vaults' && <TemporalVaults initialVaults={vaults} />}
        {activeTab === 'catering' && <NeuralCatering initialCatering={catering} />}
        {activeTab === 'oracle' && <OracleBets initialPredictions={predictions} />}
        {activeTab === 'squad' && <SquadBudgets initialSquads={squads} />}
        {activeTab === 'collectibles' && <CineCollectibles initialCollectibles={collectibles} />}
        {activeTab === 'haptics' && <MovieHaptics initialHaptics={null} />}
        {activeTab === 'auctions' && <SeatAuctions initialAuctions={auctions} />}
      </div>
    </div>
  );
};
