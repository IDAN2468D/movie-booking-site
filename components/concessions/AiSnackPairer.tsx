'use client';

import React, { useState } from 'react';
import { HoloConcessionItem, FlavorProfile } from '@/lib/types/concession';
import { getAiConcessionPairing } from '@/lib/actions/concession-actions';
import { Sparkles, Utensils, ShieldCheck, Flame } from 'lucide-react';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

interface AiSnackPairerProps {
  currentFlavor: FlavorProfile;
  onSelectRecommended: (item: HoloConcessionItem) => void;
}

const GENRES = [
  { id: 'Sci-Fi', label: 'מדע בדיוני' },
  { id: 'Action', label: 'פעולה' },
  { id: 'Drama', label: 'דרמה' },
  { id: 'Animation', label: 'אנימציה' },
  { id: 'Horror', label: 'אימה' },
];

export const AiSnackPairer: React.FC<AiSnackPairerProps> = ({ currentFlavor, onSelectRecommended }) => {
  const [genre, setGenre] = useState('Sci-Fi');
  const [loading, setLoading] = useState(false);
  const [pairingResult, setPairingResult] = useState<{ item: HoloConcessionItem; explanation: string } | null>(null);

  const handleFetchPairing = async (selectedGenre: string) => {
    setGenre(selectedGenre);
    setLoading(true);

    const res = await getAiConcessionPairing({
      movieGenre: selectedGenre,
      preferredSweetness: currentFlavor.sweet,
      preferredSaltiness: currentFlavor.salty,
    });

    setLoading(false);

    if (res.success && res.data) {
      setPairingResult({
        item: res.data.recommendedItem,
        explanation: res.data.explanation,
      });
    }
  };

  return (
    <div className="w-full rounded-3xl backdrop-blur-2xl bg-black/60 border border-white/10 p-6 space-y-5 shadow-2xl text-right" dir="rtl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Utensils size={16} />
          </div>
          <h3 className="text-sm font-black text-white font-rubik">התאמת מזנון ופופקורן AI לפי ז&apos;אנר</h3>
        </div>

        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
          15% הנחת קומבו
        </span>
      </div>

      {/* Genre Chips */}
      <div className="flex flex-wrap gap-2">
        {GENRES.map((g) => {
          const isActive = genre === g.id;
          return (
            <button
              key={g.id}
              onClick={() => handleFetchPairing(g.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-amber-500 text-black font-black shadow-[0_0_12px_rgba(255,159,10,0.4)]'
                  : 'bg-white/5 hover:bg-white/10 text-off-white/70 border border-white/10'
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      {/* Result Display */}
      {loading ? (
        <div className="py-6 flex items-center justify-center">
          <LoadingIndicator variant="spinner" size={20} color="#FF9F0A" label="מתאים קומבו סינמטי..." />
        </div>
      ) : pairingResult ? (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{pairingResult.item.icon}</span>
              <div>
                <h4 className="text-sm font-black text-white font-rubik">{pairingResult.item.name}</h4>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                  <span>₪{pairingResult.item.price}</span>
                  <span className="text-[10px] text-off-white/40 font-sans">(כולל 18% מע״מ)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectRecommended(pairingResult.item)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-90 text-black font-black text-xs shadow-lg transition-all active:scale-95"
            >
              הוסף למגש החכם
            </button>
          </div>

          <p className="text-xs text-off-white/80 leading-relaxed font-medium">{pairingResult.explanation}</p>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-off-white/50">
            <span className="flex items-center gap-1"><Flame size={12} className="text-amber-400" /> ~480 קלוריות</span>
            <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-400" /> כשרות מהודרת</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
