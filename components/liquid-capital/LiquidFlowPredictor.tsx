"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function LiquidFlowPredictor() {
  const [months, setMonths] = useState(6);
  const baseAmount = 10000;
  const monthlyYield = 0.015; // 1.5%

  const projectedAmount = baseAmount * Math.pow(1 + monthlyYield, months);
  const profit = projectedAmount - baseAmount;

  return (
    <div className="glass-panel p-6 w-full flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">הדמיית משיכה (Liquid Flow)</h2>
          <p className="text-sm text-white/50">תחזית תשואות Staking לחודשים הבאים</p>
        </div>
        <div className="text-left" dir="ltr">
          <div className="text-2xl font-bold text-gold-gradient">
            ${projectedAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-sm text-green-400">
            +${profit.toLocaleString(undefined, { maximumFractionDigits: 0 })} רווח משוער
          </div>
        </div>
      </div>

      <div className="h-40 flex items-end gap-2 mt-4" dir="ltr">
        {Array.from({ length: 12 }).map((_, i) => {
          const isFuture = i >= months;
          const heightPercent = 20 + (i * 6);
          return (
            <motion.div
              key={i}
              className={`flex-1 rounded-t-sm ${isFuture ? 'bg-white/10' : 'bg-[#F5A623]'}`}
              initial={{ height: "0%" }}
              animate={{ height: `${heightPercent}%`, opacity: isFuture ? 0.3 : 1 }}
              transition={{ duration: 0.5 }}
              style={{
                boxShadow: !isFuture ? "0 0 10px rgba(245,166,35,0.5)" : "none"
              }}
            />
          );
        })}
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div className="flex justify-between text-sm text-white/60">
          <span>חודש 1</span>
          <span className="font-bold text-[#F5A623]">{months} חודשים</span>
          <span>12 חודשים</span>
        </div>
        <input
          type="range"
          min="1"
          max="12"
          value={months}
          onChange={(e) => setMonths(parseInt(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: "#F5A623" }}
        />
      </div>
    </div>
  );
}
