'use client';

import React, { useState } from 'react';
import { Box, Sparkles, Flame, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConcessionItem {
  id: string;
  nameHe: string;
  category: string;
  price: number;
  aiPairingGenre: string;
  aiNoteHe: string;
  color: string;
}

export const AR3DMenuViewer: React.FC = () => {
  const [items] = useState<ConcessionItem[]>([
    { id: 'c1', nameHe: 'פופקורן כמהין ופרמזן VIP', category: 'פופקורן פרימיום', price: 36, aiPairingGenre: 'סייברפאנק / מתח', aiNoteHe: 'המלצת AI: משתווה באופן מושלם לאווירה האפלה ולמתח המתמשך.', color: 'from-amber-400 to-amber-600' },
    { id: 'c2', nameHe: 'נאצ׳וס עם גוואקמולי טרי', category: 'מזנון חם', price: 34, aiPairingGenre: 'אקשן / קומדיה', aiNoteHe: 'המלצת AI: חריפות עדינה המעוררת את החושים בקטעי האקשן.', color: 'from-emerald-400 to-green-600' },
    { id: 'c3', nameHe: 'קוקטייל ניאון סייבר-סודה', category: 'משקאות ייחודיים', price: 28, aiPairingGenre: 'מדע בדיוני 3D', aiNoteHe: 'המלצת AI: חוויית טעם זוהרת המותאמת לאפקטים הוויזואליים.', color: 'from-cyan-400 to-blue-600' }
  ]);

  const [selectedId, setSelectedId] = useState<string>('c1');
  const selectedItem = items.find(i => i.id === selectedId) || items[0];

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-slate-950/90 border border-amber-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] text-white" dir="rtl">
      <div className="flex items-center justify-between mb-4 border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Box className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="font-['Outfit'] text-lg font-bold text-amber-300">תפריט AR 3D & התאמת טעמים AI</h3>
            <p className="text-xs text-gray-400">תצוגה בתלת-ממד והמלצות קולינריות לפי ז׳אנר הסרט</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* 3D Visualizer Simulation Box */}
        <div className="relative w-full h-48 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-center overflow-hidden perspective-1000">
          <motion.div
            key={selectedItem.id}
            initial={{ scale: 0.8, rotateY: -30 }}
            animate={{ scale: 1, rotateY: 0 }}
            className={`w-32 h-32 rounded-2xl bg-gradient-to-tr ${selectedItem.color} flex flex-col items-center justify-center p-4 shadow-[0_0_40px_rgba(255,255,255,0.2)] transform-gpu`}
          >
            <Box className="w-12 h-12 text-white mb-2" />
            <span className="text-xs font-bold text-center text-white line-clamp-1">{selectedItem.nameHe}</span>
          </motion.div>

          <div className="absolute bottom-3 right-3 text-[10px] px-3 py-1 bg-black/70 rounded-full border border-white/20 text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>תצוגת AR 3D פעילה</span>
          </div>
        </div>

        {/* AI Flavor Pairing Card */}
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-2">
          <div className="flex justify-between items-center text-xs text-amber-300 font-bold">
            <span>ז׳אנר מותאם: {selectedItem.aiPairingGenre}</span>
            <span className="text-white text-sm font-bold">₪{selectedItem.price}</span>
          </div>
          <p className="text-xs text-gray-300 font-['Inter']">{selectedItem.aiNoteHe}</p>
        </div>

        {/* Item Selector list */}
        <div className="grid grid-cols-3 gap-2">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-right ${
                selectedId === item.id
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-white/5 border-white/10 hover:border-amber-500/30 text-gray-400'
              }`}
            >
              <p className="truncate">{item.nameHe}</p>
              <span className="text-[10px] text-gray-400 block mt-0.5">₪{item.price}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
