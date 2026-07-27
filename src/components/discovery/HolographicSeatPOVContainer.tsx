"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { calculateSeatPovRaycast } from "@/app/actions/phase37Actions";

export function HolographicSeatPOVContainer() {
  const [fovAngle, setFovAngle] = useState(75);
  const [tiltAngle, setTiltAngle] = useState(5);
  const [selectedSeat, setSelectedSeat] = useState("F12");
  const [povResult, setPovResult] = useState<{ immersionScore: number; viewQuality: string } | null>(null);

  const handleRaycast = async () => {
    const res = await calculateSeatPovRaycast({
      seatId: selectedSeat,
      row: "F",
      fovAngle,
      tiltAngle,
      ambientLighting: true,
    });
    if (res.success && res.data) {
      setPovResult(res.data);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl backdrop-blur-[40px] saturate-[250%] brightness-105 bg-neutral-950/40 border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-white space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-outfit text-emerald-400">
          📐 Holographic Multi-Seat 180° POV Simulator
        </h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Sprint 96 • Raycast POV
        </span>
      </div>

      <p className="text-xs text-neutral-300 font-inter">
        סימולטור נקודת מבט מרחבי (180° FOV) המציג את זווית הצפייה והעומק מכל מושב באולם
      </p>

      {/* Interactive Auditorium POV Viewport */}
      <div className="relative h-44 rounded-xl bg-neutral-950 border border-emerald-500/30 p-4 overflow-hidden flex flex-col justify-between">
        {/* Curved Screen Rendering */}
        <div
          className="w-full h-8 rounded-b-full border-t-2 border-emerald-400 bg-gradient-to-b from-emerald-500/20 to-transparent flex items-center justify-center transition-all"
          style={{ transform: `scaleX(${fovAngle / 60}) rotateX(${tiltAngle}deg)` }}
        >
          <span className="text-[10px] font-mono tracking-widest text-emerald-300 uppercase">
            IMAX CURVED SCREEN POV
          </span>
        </div>

        {/* Raycasting Lines Visualizer */}
        <div className="flex justify-between items-end px-6">
          <div className="text-xs font-mono text-emerald-400">Seat: {selectedSeat}</div>
          <div className="text-xs font-mono text-neutral-400">FOV: {fovAngle}° | Tilt: {tiltAngle}°</div>
          {povResult && (
            <div className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/40">
              Score: {povResult.immersionScore}% ({povResult.viewQuality})
            </div>
          )}
        </div>
      </div>

      {/* Seat & Angle Controls */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-neutral-400 block mb-1">Select Seat</label>
          <select
            value={selectedSeat}
            onChange={(e) => setSelectedSeat(e.target.value)}
            className="w-full bg-neutral-900 border border-emerald-500/30 rounded-lg p-1.5 text-emerald-300"
          >
            <option value="A1">Row A - Center (A1)</option>
            <option value="F12">Row F - VIP Center (F12)</option>
            <option value="L24">Row L - Back Panoramic (L24)</option>
          </select>
        </div>
        <div>
          <label className="text-neutral-400 block mb-1">Field of View ({fovAngle}°)</label>
          <input
            type="range"
            min="45"
            max="110"
            value={fovAngle}
            onChange={(e) => setFovAngle(parseInt(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
        </div>
        <div>
          <label className="text-neutral-400 block mb-1">Eye Tilt ({tiltAngle}°)</label>
          <input
            type="range"
            min="-15"
            max="25"
            value={tiltAngle}
            onChange={(e) => setTiltAngle(parseInt(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          onClick={handleRaycast}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg transition-transform active:scale-95"
        >
          Simulate Raycast POV
        </button>
      </div>
    </motion.div>
  );
}
