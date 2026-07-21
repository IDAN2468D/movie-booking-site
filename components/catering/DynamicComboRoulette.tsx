"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { generateDynamicComboAction } from "@/app/actions/comboRouletteActions";
import { DynamicCombo } from "@/lib/validations/comboRoulette";
import { Sparkles, Plus, Percent } from "lucide-react";
import { useBookingStore } from "@/lib/store";
import { FOOD_ITEMS } from "@/lib/constants";

export function DynamicComboRoulette({ movieTitle }: { movieTitle: string }) {
  const [combo, setCombo] = useState<DynamicCombo | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const updateFoodQuantity = useBookingStore(state => state.updateFoodQuantity);

  useEffect(() => {
    generateDynamicComboAction(movieTitle).then(res => {
      if (res.success && res.data) {
        setCombo(res.data);
      }
      setLoading(false);
    });
  }, [movieTitle]);

  const handleAddCombo = () => {
    if (!combo) return;
    // Add all items in the combo
    combo.items.forEach(id => {
      updateFoodQuantity(id, 1);
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="w-full h-32 rounded-[2rem] bg-white/5 border border-white/10 animate-pulse flex items-center justify-center backdrop-blur-md mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
        <span className="text-white/40 font-['Outfit'] font-bold tracking-widest uppercase flex items-center gap-2 text-sm">
          <Sparkles size={16} className="animate-spin-slow" /> AI מחשב דיל דינמי...
        </span>
      </div>
    );
  }

  if (!combo || combo.items.length === 0) return null;

  const comboFoodItems = combo.items.map(id => FOOD_ITEMS.find(f => f.id === id)).filter(Boolean);

  return (
    <motion.div 
      initial={{ opacity: 0, rotateX: 90 }}
      animate={{ opacity: 1, rotateX: 0 }}
      transition={{ type: "spring", damping: 15, stiffness: 100 }}
      className="relative w-full overflow-hidden rounded-[2rem] bg-black/60 backdrop-blur-[40px] saturate-[200%] border border-white/[0.15] p-5 mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.6),_inset_0_1px_1px_rgba(255,255,255,0.2)] transform-gpu"
      style={{ perspective: 1000 }}
      dir="rtl"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-gradient-to-tr from-[#7B61FF]/40 via-transparent to-[#0AEFFF]/40" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-gradient-to-r from-[#7B61FF] to-[#0AEFFF] p-1.5 rounded-xl shadow-[0_0_15px_rgba(123,97,255,0.4)]">
              <Sparkles className="text-white" size={16} />
            </div>
            <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 font-['Outfit'] tracking-tight">
              {combo.name}
            </h3>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-[#FF1464]/20 text-[#FF1464] border border-[#FF1464]/30 text-xs font-bold flex items-center gap-1">
              <Percent size={12} /> {combo.discountPercent} הנחה
            </span>
          </div>
          <p className="text-white/70 text-sm font-['Inter'] leading-relaxed max-w-md">
            {combo.description}
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 rounded-[1.5rem] p-3 border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          <div className="flex -space-x-4 space-x-reverse">
            {comboFoodItems.map((item, idx) => (
              item && (
                <img 
                  key={idx}
                  src={item.image} 
                  alt={item.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#1a1a24] shadow-lg relative"
                  style={{ zIndex: 10 - idx }}
                />
              )
            ))}
          </div>
          <button 
            onClick={handleAddCombo}
            disabled={added}
            className={`h-12 px-6 rounded-xl flex items-center gap-2 font-black transition-all ${
              added 
              ? 'bg-[#00FF66] text-black shadow-[0_0_20px_rgba(0,255,102,0.4)]' 
              : 'bg-white text-black hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
            }`}
          >
            {added ? 'נוסף בהצלחה!' : <><Plus size={18} /> הוסף דיל</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
