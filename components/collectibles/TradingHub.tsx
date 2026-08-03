'use client';

import React, { useState } from 'react';
import { ShieldCheck, Coins, RefreshCw, Sparkles, ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CollectibleShard {
  id: string;
  titleHe: string;
  movieTitle: string;
  rarity: 'rare' | 'epic' | 'legendary';
  pricePoints: number;
  signedHmac: string;
}

export const TradingHub: React.FC = () => {
  const [shards] = useState<CollectibleShard[]>([
    { id: 's1', titleHe: 'שבר זיכרון: פתיחת IMAX', movieTitle: 'Interstellar IMAX', rarity: 'legendary', pricePoints: 1200, signedHmac: 'a3f9e8...7b2c' },
    { id: 's2', titleHe: 'פוסטר AI מוגבל #42', movieTitle: 'Cyberpunk 2099', rarity: 'epic', pricePoints: 850, signedHmac: 'c81b4e...9d3f' },
    { id: 's3', titleHe: 'שבר כרטיס בכורה', movieTitle: 'Avatar: Fire & Ash', rarity: 'rare', pricePoints: 500, signedHmac: 'e72c5a...1a8b' }
  ]);

  const rarityStyles = {
    legendary: 'from-amber-500/20 via-purple-500/20 to-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    epic: 'from-purple-500/20 via-pink-500/20 to-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.2)]',
    rare: 'from-cyan-500/20 via-blue-500/20 to-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]',
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-3xl bg-black/85 border border-pink-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(236,72,153,0.15)] text-white" dir="rtl">
      <div className="flex items-center justify-between mb-4 border-b border-pink-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/40">
            <ArrowLeftRight className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-['Outfit'] text-lg font-bold text-pink-300">Cine-Collectibles Trading Hub</h3>
            <p className="text-xs text-gray-400">מסחר P2P בשברי כרטיסים, פוסטרים וזיכרונות קולנועיים</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          <Coins className="w-4 h-4" />
          <span>2,450 נקודות נאמנות</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shards.map(shard => (
          <motion.div
            key={shard.id}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`p-4 rounded-2xl bg-gradient-to-b border flex flex-col justify-between space-y-3 ${rarityStyles[shard.rarity]}`}
          >
            <div>
              <div className="flex justify-between items-center text-[10px] uppercase font-bold mb-1">
                <span className="px-2 py-0.5 rounded bg-black/50 border border-white/10">{shard.rarity}</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>HMAC חתום</span>
                </span>
              </div>
              <h4 className="font-bold text-white text-sm mt-2">{shard.titleHe}</h4>
              <p className="text-xs text-gray-300 font-['Inter']">{shard.movieTitle}</p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="font-bold text-amber-300 text-sm">{shard.pricePoints} נק׳</span>
              <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all">
                רכוש עכשיו
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
