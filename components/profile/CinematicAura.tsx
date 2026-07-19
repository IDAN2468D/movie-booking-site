"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { type CinematicAura as CinematicAuraType } from "@/lib/validations/aura";
import { generateAuraAction } from "@/app/actions/auraActions";

export default function CinematicAura({ userId }: { userId: string }) {
  const [aura, setAura] = useState<CinematicAuraType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateAuraAction(userId).then(res => {
      if (res.success && res.data) {
        setAura(res.data);
      }
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full h-32 rounded-[2rem] bg-white/5 border border-white/10 animate-pulse flex items-center justify-center backdrop-blur-md">
        <span className="text-white/40 font-['Outfit'] font-bold tracking-widest uppercase">מתחבר לתודעה הקולנועית...</span>
      </div>
    );
  }

  if (!aura) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] bg-black/40 backdrop-blur-[40px] saturate-[250%] border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_0_0_40px_rgba(0,0,0,0.5),_inset_0_0_0_1px_rgba(255,255,255,0.15)] p-8">
      {/* Dynamic Background */}
      <motion.div 
        className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
        animate={{
          background: [
            `radial-gradient(circle at 0% 0%, ${aura.colors.primary} 0%, transparent 50%)`,
            `radial-gradient(circle at 100% 100%, ${aura.colors.secondary} 0%, transparent 50%)`,
            `radial-gradient(circle at 50% 50%, ${aura.colors.accent} 0%, transparent 50%)`,
            `radial-gradient(circle at 0% 0%, ${aura.colors.primary} 0%, transparent 50%)`,
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "background" }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6" dir="rtl">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center relative"
          style={{ boxShadow: `0 0 40px ${aura.colors.primary}80, inset 0 0 20px ${aura.colors.secondary}80` }}
        >
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-transparent mix-blend-color-dodge"
            style={{ borderTopColor: aura.colors.accent, borderBottomColor: aura.colors.primary }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">✨</span>
        </div>
        
        <div className="text-right flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-['Inter'] px-3 py-1 rounded-full border border-white/20 bg-white/10" style={{ color: aura.colors.secondary }}>
              עוצמה: {aura.intensity}%
            </span>
            <h2 className="text-3xl font-black font-['Outfit'] tracking-tight" style={{ color: aura.colors.primary, textShadow: `0 0 20px ${aura.colors.primary}40` }}>
              {aura.mood}
            </h2>
          </div>
          <p className="text-white/70 font-['Inter'] text-lg">
            {aura.description}
          </p>
        </div>
      </div>
    </div>
  );
}
