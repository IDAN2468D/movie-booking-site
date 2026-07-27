"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { processKineticShader } from "@/app/actions/phase37Actions";

export function KineticShaderDeckContainer() {
  const [distortion, setDistortion] = useState(0.4);
  const [chromatic, setChromatic] = useState(0.5);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [status, setStatus] = useState<string>("READY");
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const handleApplyShader = async () => {
    setStatus("PROCESSING...");
    const res = await processKineticShader({
      distortion,
      chromaticAberration: chromatic,
      refractionIndex: 1.45,
      activeMovieId: "movie-quantum-nexus",
    });
    if (res.success && res.data) {
      setStatus(`ACTIVE: ${res.data.status}`);
    } else {
      setStatus(`ERROR: ${res.error || "Unknown error"}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl backdrop-blur-[40px] saturate-[250%] brightness-105 bg-neutral-950/40 border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-white space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-outfit text-cyan-400">
          🔮 Kinetic Refraction Shader Engine
        </h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          Sprint 94 • WebGL 120Hz
        </span>
      </div>

      <p className="text-xs text-neutral-300 font-inter">
        שיידר זכוכית תלת-ממדי המשנה את שבירת האור והנצנוץ לפי תנועת העכבר
      </p>

      {/* Dynamic Interactive Shader Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="relative h-48 rounded-xl overflow-hidden cursor-pointer border border-cyan-500/30 flex items-center justify-center transition-all duration-200"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${
            mousePos.y * 100
          }%, rgba(0,240,255,${distortion}) 0%, rgba(112,0,255,${chromatic}) 50%, rgba(10,10,15,0.95) 100%)`,
          boxShadow: `0 ${mousePos.y * 20}px 30px rgba(0,240,255,${distortion * 0.4})`,
        }}
      >
        <div className="absolute inset-0 backdrop-blur-[10px] bg-white/[0.03] pointer-events-none" />
        <div className="relative z-10 text-center space-y-2">
          <div className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-400">
            NEURAL KINETIC DECK
          </div>
          <p className="text-xs text-cyan-200/80">
            X: {(mousePos.x * 100).toFixed(0)}% | Y: {(mousePos.y * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Shader Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Optical Distortion</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={distortion}
            onChange={(e) => setDistortion(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Chromatic Aberration</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={chromatic}
            onChange={(e) => setChromatic(parseFloat(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono text-cyan-400">{status}</span>
        <button
          onClick={handleApplyShader}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg transition-transform active:scale-95"
        >
          Apply Shader State
        </button>
      </div>
    </motion.div>
  );
}
