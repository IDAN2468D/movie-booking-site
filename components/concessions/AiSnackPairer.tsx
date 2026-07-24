'use client';

import React, { useState } from 'react';
import { HoloConcessionItem, FlavorProfile } from '@/lib/types/concession';
import { getAiConcessionPairing } from '@/lib/actions/concession-actions';

interface AiSnackPairerProps {
  currentFlavor: FlavorProfile;
  onSelectRecommended: (item: HoloConcessionItem) => void;
}

export const AiSnackPairer: React.FC<AiSnackPairerProps> = ({ currentFlavor, onSelectRecommended }) => {
  const [genre, setGenre] = useState('Sci-Fi');
  const [loading, setLoading] = useState(false);
  const [pairingResult, setPairingResult] = useState<{ item: HoloConcessionItem; explanation: string } | null>(null);

  const genres = ['Sci-Fi', 'Action', 'Thriller', 'Animation', 'Drama', 'Horror'];

  const handleFetchPairing = async (selectedGenre: string) => {
    setGenre(selectedGenre);
    setLoading(true);

    const res = await getAiConcessionPairing({
      movieGenre: selectedGenre,
      preferredSweetness: currentFlavor.sweet,
      preferredSaltiness: currentFlavor.salty
    });

    setLoading(false);

    if (res.success && res.data) {
      setPairingResult({
        item: res.data.recommendedItem,
        explanation: res.data.explanation
      });
    }
  };

  return (
    <div className="w-full rounded-3xl backdrop-blur-[40px] saturate-[250%] bg-neutral-950/40 border border-white/10 p-5 space-y-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transform-gpu">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-outfit text-white flex items-center gap-2">
          <span>🤖</span> התאמת AI למצב רוח סינמטי
        </h3>

        {pairingResult && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            תואם ז'אנר
          </span>
        )}
      </div>

      {/* Genre Chips Selection */}
      <div className="flex flex-wrap gap-2">
        {genres.map((g) => {
          const isActive = genre === g;
          return (
            <button
              key={g}
              onClick={() => handleFetchPairing(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-inter transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* Result Display */}
      {loading ? (
        <div className="py-4 text-center text-xs text-neutral-400 animate-pulse font-inter">
          מחשב התאמה הולוגרפית אופטימלית... 🔮
        </div>
      ) : pairingResult ? (
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{pairingResult.item.icon}</span>
              <div>
                <div className="text-xs font-bold text-white font-outfit">{pairingResult.item.name}</div>
                <div className="text-[10px] text-amber-400 font-mono">₪{pairingResult.item.price}</div>
              </div>
            </div>
            <button
              onClick={() => onSelectRecommended(pairingResult.item)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-outfit border border-cyan-500/40 transition-all"
            >
              הצג בהולוגרמה
            </button>
          </div>
          <p className="text-[11px] text-neutral-400 font-inter leading-relaxed">{pairingResult.explanation}</p>
        </div>
      ) : null}
    </div>
  );
};
