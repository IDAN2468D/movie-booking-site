"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { applyBioThemePreset } from "@/app/actions/phase37Actions";

interface ThemePreset {
  id: "cyberpunk" | "noir" | "scifi" | "retro" | "quantum";
  name: string;
  accent: string;
  blur: number;
}

export function BioThemeMorpherContainer() {
  const themes: ThemePreset[] = [
    { id: "cyberpunk", name: "Cyberpunk Neon", accent: "#00F0FF", blur: 40 },
    { id: "noir", name: "Obsidian Noir", accent: "#A0A0A0", blur: 25 },
    { id: "scifi", name: "Emerald Matrix", accent: "#10B981", blur: 35 },
    { id: "quantum", name: "Quantum Violet", accent: "#8B5CF6", blur: 45 },
  ];

  const [activeTheme, setActiveTheme] = useState<ThemePreset>(themes[0]);
  const [status, setStatus] = useState<string>("SYSTEM DEFAULT");

  const handleApplyTheme = async (theme: ThemePreset) => {
    setActiveTheme(theme);
    setStatus("MORPHING...");
    const res = await applyBioThemePreset({
      themeId: theme.id,
      glassBlur: theme.blur,
      accentGlow: theme.accent,
    });
    if (res.success && res.data) {
      setStatus(`ACTIVE: ${res.data.activeTheme.toUpperCase()}`);
    } else {
      setStatus(`ERROR: ${res.error}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl saturate-[250%] brightness-105 bg-neutral-950/40 border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-white space-y-4 transition-all duration-500"
      style={{
        backdropFilter: `blur(${activeTheme.blur}px)`,
        boxShadow: `0 0 40px ${activeTheme.accent}20`,
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-outfit" style={{ color: activeTheme.accent }}>
          🎨 Bio-Adaptive Visual Theme Morphing Engine
        </h3>
        <span
          className="text-xs px-2.5 py-1 rounded-full border"
          style={{
            borderColor: `${activeTheme.accent}40`,
            color: activeTheme.accent,
            backgroundColor: `${activeTheme.accent}15`,
          }}
        >
          Sprint 98 • Dynamic CSS Morph
        </span>
      </div>

      <p className="text-xs text-neutral-300 font-inter">
        שינוי נושא ויזואלי דינמי המשנה את פלטת הצבעים, עומק הזכוכית והנצנוץ לפי ז'אנר הסרט
      </p>

      {/* Theme Presets Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {themes.map((t) => (
          <motion.button
            key={t.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleApplyTheme(t)}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 ${
              activeTheme.id === t.id
                ? "bg-white/10 border-white/40 shadow-lg"
                : "bg-neutral-900/60 border-white/10 hover:border-white/20"
            }`}
            style={{
              boxShadow: activeTheme.id === t.id ? `0 0 15px ${t.accent}40` : "none",
            }}
          >
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.accent }} />
            <span className="text-xs font-bold text-white">{t.name}</span>
            <span className="text-[10px] text-neutral-400">Blur: {t.blur}px</span>
          </motion.button>
        ))}
      </div>

      {/* Theme Status Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
        <span className="font-mono text-neutral-400">Status: <span style={{ color: activeTheme.accent }}>{status}</span></span>
        <span className="font-mono text-neutral-400">Active Token: {activeTheme.accent}</span>
      </div>
    </motion.div>
  );
}
