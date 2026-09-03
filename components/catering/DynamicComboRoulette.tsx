"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { generateDynamicComboAction } from "@/app/actions/comboRouletteActions";
import { DynamicCombo } from "@/lib/validations/comboRoulette";
import { Sparkles, Check, Dices, Flame } from "lucide-react";
import { useBookingStore } from "@/lib/store";
import { FOOD_ITEMS } from "@/lib/constants";
import { playConcessionChime } from "@/lib/audio/concession-audio";

interface DynamicComboRouletteProps {
  movieTitle: string;
}

export function DynamicComboRoulette({ movieTitle }: DynamicComboRouletteProps) {
  const [combo, setCombo] = useState<DynamicCombo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [added, setAdded] = useState(false);
  const updateFoodQuantity = useBookingStore((state) => state.updateFoodQuantity);

  const fetchCombo = async () => {
    setLoading(true);
    const res = await generateDynamicComboAction(movieTitle);
    if (res.success && res.data) {
      setCombo(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCombo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieTitle]);

  const handleShuffle = async () => {
    setIsShuffling(true);
    await fetchCombo();
    setIsShuffling(false);
  };

  const handleAddCombo = () => {
    if (!combo) return;
    combo.items.forEach((id) => updateFoodQuantity(id, 1));
    playConcessionChime();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading && !combo) {
    return (
      <div className="w-full h-full min-h-[220px] rounded-[28px] bg-black/40 border border-white/10 animate-pulse flex flex-col items-center justify-center p-6 backdrop-blur-xl">
        <Sparkles className="text-[#0AEFFF] animate-spin-slow mb-2" size={24} />
        <span className="text-white/50 text-xs font-mono font-bold tracking-wider">AI מחשב קומבו בלעדי עם הנחת חבר...</span>
      </div>
    );
  }

  if (!combo || combo.items.length === 0) return null;

  const comboFoodItems = combo.items
    .map((id) => FOOD_ITEMS.find((f) => f.id === id))
    .filter((f): f is typeof FOOD_ITEMS[0] => Boolean(f));

  const originalPrice = comboFoodItems.reduce((acc, f) => acc + f.price, 0);
  const discountedPrice = Math.round(originalPrice * (1 - combo.discountPercent / 100));
  const savingsAmount = originalPrice - discountedPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full rounded-[28px] p-5 md:p-6 bg-gradient-to-b from-[#110c22]/85 via-[#0c0915]/90 to-[#07050c]/95 border border-[#7B61FF]/25 shadow-[0_20px_50px_rgba(0,0,0,0.6),_inset_0_1px_1px_rgba(123,97,255,0.2)] backdrop-blur-2xl overflow-hidden flex flex-col justify-between h-full transform-gpu group"
      dir="rtl"
    >
      {/* Ambient Radial Glow */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#7B61FF]/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#0AEFFF]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-black shadow-[0_0_15px_rgba(251,191,36,0.5)] flex items-center gap-1">
              <Flame size={13} className="fill-black" />
              {combo.discountPercent}% הנחה בלעדית
            </span>
            <button
              onClick={handleShuffle}
              disabled={isShuffling}
              title="ערבב קומבו חדש"
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Dices size={14} className={isShuffling ? "animate-spin" : ""} />
              <span>ערבב 🎲</span>
            </button>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-[#7B61FF]/15 border border-[#7B61FF]/30 text-[#7B61FF] text-[10px] font-black uppercase font-mono tracking-widest">
            DYNAMIC DEAL
          </span>
        </div>

        <h3 className="text-base md:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 font-['Outfit'] tracking-tight mb-1.5">
          {combo.name}
        </h3>

        <p className="text-white/70 text-xs md:text-sm font-['Inter'] leading-relaxed mb-4">
          {combo.description}
        </p>
      </div>

      {/* Middle Section: Items Avatars & Value Breakdown */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 mb-4">
        {/* Avatars Stack */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-3 space-x-reverse">
            {comboFoodItems.map((item, idx) => (
              <div key={idx} className="relative group/thumb">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&q=80&w=300";
                  }}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#100c22] shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover/thumb:scale-110 group-hover/thumb:z-20 transition-transform bg-white/5"
                  style={{ zIndex: 10 - idx }}
                />
              </div>
            ))}
          </div>
          <div className="text-[11px] text-white/60">
            {comboFoodItems.map((i) => i.name).join(" + ")}
          </div>
        </div>

        {/* Pricing Tags */}
        <div className="flex items-center gap-2 text-left dir-ltr">
          <span className="text-xs line-through text-white/40 font-mono">₪{originalPrice}</span>
          <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0AEFFF] to-white font-mono">
            ₪{discountedPrice}
          </span>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            -₪{savingsAmount}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="relative z-10">
        <button
          onClick={handleAddCombo}
          disabled={added}
          className={`w-full py-3 px-5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer relative overflow-hidden ${
            added
              ? "bg-[#00FF66] text-black shadow-[0_0_25px_rgba(0,255,102,0.6)] scale-105"
              : "bg-gradient-to-r from-[#7B61FF] via-[#0AEFFF] to-[#00F0FF] text-black hover:opacity-95 shadow-[0_0_25px_rgba(10,239,255,0.4)] hover:scale-[1.02] active:scale-95"
          }`}
        >
          {added ? (
            <>
              <Check size={16} />
              <span>הדיל נוסף למגש בהצלחה!</span>
            </>
          ) : (
            <>
              <Sparkles size={16} className="text-black" />
              <span>הוסף את כל הדיל עכשיו (₪{discountedPrice})</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
