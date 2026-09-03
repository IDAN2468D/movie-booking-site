"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSmartTrayRecommendations, SmartTrayItemData } from "@/app/actions/smartTrayActions";
import { Sparkles, Plus, Check, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useBookingStore } from "@/lib/store";
import { playConcessionChime } from "@/lib/audio/concession-audio";

interface SmartTrayProps {
  movieTitle: string;
  movieGenre: string;
}

export function SmartTray({ movieTitle, movieGenre }: SmartTrayProps) {
  const [data, setData] = useState<{
    items: SmartTrayItemData[];
    explanation: string;
    totalPrice: number;
    genreHebrew: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedAll, setAddedAll] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);
  const updateFoodQuantity = useBookingStore((state) => state.updateFoodQuantity);

  useEffect(() => {
    let active = true;
    getSmartTrayRecommendations(movieTitle, movieGenre).then((res) => {
      if (active && res.success && res.data) {
        setData(res.data);
      }
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [movieTitle, movieGenre]);

  const handleAddItem = (item: SmartTrayItemData) => {
    updateFoodQuantity(item.id, 1);
    playConcessionChime();
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleAddAll = () => {
    if (!data?.items) return;
    data.items.forEach((item) => updateFoodQuantity(item.id, 1));
    playConcessionChime();
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2000);
  };

  if (loading) {
    return (
      <div className="w-full h-full min-h-[220px] rounded-[28px] bg-black/40 border border-white/10 animate-pulse flex flex-col items-center justify-center p-6 backdrop-blur-xl">
        <Sparkles className="text-[#FF1464] animate-spin-slow mb-2" size={24} />
        <span className="text-white/50 text-xs font-mono font-bold tracking-wider">AI אוצר עבורך מגש טעמים קולנועי...</span>
      </div>
    );
  }

  if (!data || data.items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full rounded-[28px] p-5 md:p-6 bg-gradient-to-b from-[#140a14]/85 via-[#0d070d]/90 to-[#070407]/95 border border-[#FF1464]/25 shadow-[0_20px_50px_rgba(0,0,0,0.6),_inset_0_1px_1px_rgba(255,20,100,0.2)] backdrop-blur-2xl overflow-hidden flex flex-col justify-between h-full transform-gpu group"
      dir="rtl"
    >
      {/* Ambient Radial Refraction Glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF1464]/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#FF7B00]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF1464] to-[#FF7B00] flex items-center justify-center shadow-[0_0_15px_rgba(255,20,100,0.5)]">
              <Sparkles className="text-white" size={16} />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-white font-['Outfit'] tracking-tight flex items-center gap-2">
                המלצת ה-AI לסרט
              </h3>
              <span className="text-[10px] text-[#FF7B00] font-mono font-bold tracking-wider">
                מותאם ל-{data.genreHebrew}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#FF1464]/15 border border-[#FF1464]/30 text-[#FF1464] text-[10px] font-black uppercase font-mono tracking-widest">
            AI TASTE PAIRING
          </span>
        </div>

        <p className="text-white/70 text-xs md:text-sm font-['Inter'] leading-relaxed mb-4">
          {data.explanation}
        </p>
      </div>

      {/* Recommended Items Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-4">
        {data.items.map((item) => {
          const isJustAdded = addedId === item.id;
          return (
            <div
              key={item.id}
              className="group/item flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#FF1464]/40 transition-all duration-300"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&q=80&w=300";
                  }}
                  className="w-11 h-11 rounded-xl object-cover border border-white/10 shadow-inner flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate group-hover/item:text-[#FF7B00] transition-colors">
                    {item.name}
                  </h4>
                  <span className="text-xs font-mono font-black text-white/60">
                    ₪{item.price}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAddItem(item)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                  isJustAdded
                    ? "bg-[#00FF66] text-black scale-110 shadow-[0_0_15px_rgba(0,255,102,0.6)]"
                    : "bg-[#FF1464]/20 hover:bg-[#FF1464] text-[#FF1464] hover:text-white border border-[#FF1464]/40 hover:scale-105 shadow-[0_0_10px_rgba(255,20,100,0.3)]"
                }`}
                title={`הוסף ${item.name} למזנון`}
              >
                {isJustAdded ? <Check size={14} /> : <Plus size={14} />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer / Add All Button */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] text-white/50">סה״כ למגש:</span>
          <span className="text-base font-black text-white font-mono">₪{data.totalPrice}</span>
        </div>

        <button
          onClick={handleAddAll}
          disabled={addedAll}
          className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
            addedAll
              ? "bg-[#00FF66] text-black shadow-[0_0_20px_rgba(0,255,102,0.5)] scale-105"
              : "bg-gradient-to-r from-[#FF1464] to-[#FF7B00] text-white hover:opacity-95 shadow-[0_0_20px_rgba(255,20,100,0.4)] hover:scale-[1.02] active:scale-95"
          }`}
        >
          {addedAll ? (
            <>
              <Check size={15} />
              <span>כל המגש נוסף!</span>
            </>
          ) : (
            <>
              <ShoppingBag size={15} />
              <span>הוסף את כל המגש</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
