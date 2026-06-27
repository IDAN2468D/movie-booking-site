"use client";

import { motion } from "framer-motion";
import { Coins, Bitcoin, ArrowUpRight, TrendingUp } from "lucide-react";

export function AssetRefractionGrid() {
  const assets = [
    { name: "Bitcoin", symbol: "BTC", amount: "1.45", value: "$95,430", change: "+4.2%", weight: "large" },
    { name: "Ethereum", symbol: "ETH", amount: "12.2", value: "$34,210", change: "+2.1%", weight: "medium" },
    { name: "Solana", symbol: "SOL", amount: "145", value: "$21,430", change: "+12.4%", weight: "medium" },
    { name: "Liquid Token", symbol: "LQD", amount: "10,000", value: "$5,000", change: "+0.5%", weight: "small" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {assets.map((asset) => (
        <motion.div
          key={asset.symbol}
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          className={`glass-panel p-5 flex flex-col gap-4 cursor-pointer relative overflow-hidden ${
            asset.weight === "large" ? "md:col-span-2 h-48" : "h-36"
          }`}
        >
          {/* Subtle background glow for large weight */}
          {asset.weight === "large" && (
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#F5A623] rounded-full blur-[100px] opacity-20 pointer-events-none" />
          )}
          
          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/5 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
                {asset.symbol === "BTC" ? <Bitcoin className="w-6 h-6 text-[#F5A623]" /> : <Coins className="w-6 h-6 text-white/70" />}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{asset.symbol}</h3>
                <p className="text-sm text-white/50">{asset.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
              <TrendingUp className="w-3 h-3" />
              <span dir="ltr">{asset.change}</span>
            </div>
          </div>

          <div className="mt-auto z-10 flex justify-between items-end">
            <div>
              <div className="text-2xl font-bold text-white" dir="ltr">{asset.value}</div>
              <div className="text-sm text-white/40" dir="ltr">{asset.amount} {asset.symbol}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
              <ArrowUpRight className="w-5 h-5 text-[#F5A623]" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
