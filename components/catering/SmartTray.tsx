"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSmartTrayRecommendations } from "@/app/actions/smartTrayActions";
import { Sparkles, Plus } from "lucide-react";
import { useBookingStore } from "@/lib/store";

export function SmartTray({ movieTitle, movieGenre }: { movieTitle: string, movieGenre: string }) {
  const [data, setData] = useState<{ items: any[], explanation: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const updateFoodQuantity = useBookingStore(state => state.updateFoodQuantity);

  useEffect(() => {
    getSmartTrayRecommendations(movieTitle, movieGenre).then(res => {
      if (res.success && res.data) {
        setData(res.data);
      }
      setLoading(false);
    });
  }, [movieTitle, movieGenre]);

  if (loading) {
    return (
      <div className="w-full h-24 rounded-[2rem] bg-white/5 border border-white/10 animate-pulse flex items-center justify-center backdrop-blur-md mb-6">
        <span className="text-white/40 font-['Outfit'] font-bold tracking-widest uppercase flex items-center gap-2 text-sm">
          <Sparkles size={16} /> AI מרכיב מגש מושלם...
        </span>
      </div>
    );
  }

  if (!data || data.items.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full overflow-hidden rounded-[2rem] bg-black/40 backdrop-blur-[40px] saturate-[250%] border border-white/[0.12] p-5 mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.5),_inset_0_0_0_1px_rgba(255,255,255,0.1)]"
      dir="rtl"
    >
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-gradient-to-br from-[#0AEFFF]/30 via-transparent to-[#FF1464]/30" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-[#0AEFFF]" size={18} />
            <h3 className="text-lg font-black text-white font-['Outfit'] tracking-tight">המלצת ה-AI לסרט</h3>
          </div>
          <p className="text-white/60 text-xs md:text-sm font-['Inter'] leading-relaxed max-w-md">
            {data.explanation}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {data.items.map((item, idx) => (
            <div key={item.id} className="relative group">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity" />
              <button 
                onClick={() => updateFoodQuantity(item.id, 1)}
                className="absolute -bottom-2 -left-2 w-7 h-7 rounded-full bg-[#FF1464] text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,20,100,0.5)] hover:scale-110 transition-transform"
                title={`הוסף ${item.name}`}
              >
                <Plus size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
