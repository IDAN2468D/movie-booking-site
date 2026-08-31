'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Trophy, Gem } from 'lucide-react';
import { mintMemoryShard } from '@/lib/actions/memoryCapsuleActions';
import { MemoryShard } from '@/lib/schemas/memoryCapsule.schema';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { MemoryShardCard } from './MemoryShardCard';

interface ShardMintModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string;
  movieTitle: string;
  onMinted?: (shard: MemoryShard) => void;
}

export function ShardMintModal({ isOpen, onClose, movieId, movieTitle, onMinted }: ShardMintModalProps) {
  const [isMinting, setIsMinting] = useState(false);
  const [mintedShard, setMintedShard] = useState<MemoryShard | null>(null);

  const handleMint = async () => {
    setIsMinting(true);
    const res = await mintMemoryShard({
      movieId,
      movieTitle,
      seatLabel: 'D4 (VIP)',
      hallName: 'אולם אקוסטי ראשי 1',
    });
    if (res.success && res.data) {
      setMintedShard(res.data);
      if (onMinted) onMinted(res.data);
    }
    setIsMinting(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg p-6 md:p-8 rounded-[36px] bg-black/70 border border-purple-500/30 shadow-[0_25px_70px_rgba(168,85,247,0.25)] text-right space-y-6"
          dir="rtl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-purple-400 font-black">
              <Gem size={22} />
              <h3 className="text-xl font-rubik text-white">הנפקת שבר זיכרון דיגיטלי</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"
            >
              <X size={18} />
            </button>
          </div>

          {mintedShard ? (
            <div className="space-y-4">
              <p className="text-sm text-emerald-400 font-bold">🎉 שבר הזיכרון הונפק בהצלחה ונשמר בכספת שלך!</p>
              <MemoryShardCard shard={mintedShard} />
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-off-white/80 leading-relaxed font-medium">
                צפית בסרט <span className="text-white font-bold">{movieTitle}</span>?
                הנפק כעת שבר זיכרון דיגיטלי אספני הכולל גל קול של ציטוט נבחר, נתוני הקרנה ורמת נדירות רנדומלית.
              </p>

              <button
                disabled={isMinting}
                onClick={handleMint}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:opacity-90 text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all active:scale-95"
              >
                {isMinting ? (
                  <LoadingIndicator variant="spinner" size={20} color="#FFFFFF" label="מנפיק שבר זיכרון..." />
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>הנפק שבר זיכרון עכשיו (Free Claim)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
