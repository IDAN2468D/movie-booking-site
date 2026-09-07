'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Plus, Flame } from 'lucide-react';
import { EXPRESS_BUNDLES } from '@/lib/data/productiveConcessionCatalog';
import { useProductiveConcessionStore } from '@/lib/store/productiveConcessionStore';

export const ConcessionExpressBar: React.FC = () => {
  const addBundle = useProductiveConcessionStore((state) => state.addBundle);

  return (
    <section className="w-full space-y-3" aria-label="מארזי אקספרס מהירים">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap size={16} />
          </div>
          <h2 className="text-base md:text-lg font-bold font-outfit text-white flex items-center gap-2">
            <span>מארזי בזק קולנועיים</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
              1-Tap Express
            </span>
          </h2>
        </div>
        <span className="text-xs text-neutral-400 font-inter hidden sm:inline">
          הוספה מהירה למגש בפחות משנייה ⚡
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {EXPRESS_BUNDLES.map((bundle) => (
          <motion.div
            key={bundle.id}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative rounded-2xl p-4 bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-amber-500/50 transition-all duration-200 backdrop-blur-xl shadow-lg flex flex-col justify-between overflow-hidden"
          >
            {/* Glowing Refraction Highlight */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{bundle.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white font-outfit leading-snug">
                      {bundle.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-inter line-clamp-1">
                      {bundle.description}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 whitespace-nowrap">
                  {bundle.savingsBadge}
                </span>
              </div>
            </div>

            <div className="relative z-10 pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-amber-400 font-outfit">
                  ₪{bundle.price}
                </span>
                <span className="text-xs text-neutral-500 line-through font-mono">
                  ₪{bundle.originalPrice}
                </span>
                <span className="text-[10px] text-neutral-400 font-inter me-1">
                  ({bundle.caloriesTotal} קלוריות)
                </span>
              </div>

              <button
                type="button"
                onClick={() => addBundle(bundle)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold text-xs font-outfit flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
              >
                <Plus size={14} className="stroke-[3]" />
                <span>הוסף למגש</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
