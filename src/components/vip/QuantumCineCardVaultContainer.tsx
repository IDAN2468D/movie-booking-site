"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { processTradingCardAction } from "@/app/actions/phase37Actions";

interface TradingCard {
  id: string;
  title: string;
  rarity: "Common" | "Rare" | "Legendary" | "Quantum";
  color: string;
}

export function QuantumCineCardVaultContainer() {
  const [cards] = useState<TradingCard[]>([
    { id: "card-1", title: "Cyber Cyberpunk 2099", rarity: "Quantum", color: "#00F0FF" },
    { id: "card-2", title: "Interstellar Odyssey", rarity: "Legendary", color: "#FF007A" },
    { id: "card-3", title: "Neon Noir Blade", rarity: "Rare", color: "#7000FF" },
  ]);
  const [activeCard, setActiveCard] = useState<TradingCard>(cards[0]);
  const [fusionStatus, setFusionStatus] = useState<string>("READY TO FUSE");

  const handleFuseCards = async () => {
    setFusionStatus("FUSING...");
    const res = await processTradingCardAction({
      cardIds: cards.map((c) => c.id),
      action: "fuse",
      targetRarity: "quantum",
    });
    if (res.success && res.data) {
      setFusionStatus(`FUSED! Rarity: ${res.data.rarity.toUpperCase()} (+${res.data.bonusPoints} PTS)`);
    } else {
      setFusionStatus(`ERROR: ${res.error}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl backdrop-blur-[40px] saturate-[250%] brightness-105 bg-neutral-950/40 border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-white space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-outfit text-amber-400">
          🃏 Quantum Cine-Trading Cards & Holographic Vault
        </h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Sprint 97 • 3D Holographic Vault
        </span>
      </div>

      <p className="text-xs text-neutral-300 font-inter">
        קלפי אספנות הולוגרפיים בתלת-ממד עם אפקטי נייר כסף דינמיים ומנגנון איחוד קלפי VIP
      </p>

      {/* 3D Holographic Card Viewport */}
      <div className="flex gap-4 items-center">
        <motion.div
          whileHover={{ rotateY: 15, rotateX: -10, scale: 1.03 }}
          className="w-1/2 h-44 rounded-xl border p-4 flex flex-col justify-between relative overflow-hidden transition-all shadow-2xl cursor-pointer"
          style={{
            borderColor: activeCard.color,
            background: `linear-gradient(135deg, rgba(20,20,30,0.9) 0%, ${activeCard.color}22 100%)`,
            boxShadow: `0 0 25px ${activeCard.color}30`,
          }}
        >
          {/* Holographic Shimmer Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/60 border border-white/10" style={{ color: activeCard.color }}>
              {activeCard.rarity}
            </span>
            <span className="text-xs font-mono text-neutral-400">#NFT-88</span>
          </div>

          <div className="z-10">
            <h4 className="text-sm font-bold font-outfit text-white">{activeCard.title}</h4>
            <p className="text-[10px] text-neutral-400">Multi-Sensory Holographic VIP Edition</p>
          </div>
        </motion.div>

        {/* Card Selector List */}
        <div className="w-1/2 space-y-2">
          <div className="text-xs text-neutral-400 font-mono mb-1">Vault Inventory:</div>
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCard(c)}
              className={`w-full p-2 text-left rounded-lg text-xs font-semibold border transition-all flex justify-between items-center ${
                activeCard.id === c.id
                  ? "bg-amber-500/20 border-amber-400 text-amber-200"
                  : "bg-neutral-900/60 border-white/10 text-neutral-300 hover:border-amber-500/40"
              }`}
            >
              <span>{c.title}</span>
              <span className="text-[10px] opacity-75">{c.rarity}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-mono text-amber-300">{fusionStatus}</span>
        <button
          onClick={handleFuseCards}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg transition-transform active:scale-95"
        >
          Fuse 3 Cards into Quantum VIP
        </button>
      </div>
    </motion.div>
  );
}
