'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Eye, Compass, Volume2, ShieldAlert, Sparkles, Zap, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useDeviceOrientation } from '@/lib/hooks/useDeviceOrientation';

interface SpatialCinemaPortal360Props {
  seatId?: string;
}

export const SpatialCinemaPortal360: React.FC<SpatialCinemaPortal360Props> = ({
  seatId = 'E12',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [zoomScale, setZoomScale] = useState(1.0); // Enlarged default zoom!
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const { orientation, isSupported, hasPermission, requestPermission } = useDeviceOrientation();

  const rowChar = (seatId.charAt(0) || 'E').toUpperCase();
  const numVal = parseInt(seatId.replace(/[^0-9]/g, ''), 10) || 6;
  const rowIdx = Math.max(0, Math.min(7, rowChar.charCodeAt(0) - 65));
  const colIdx = Math.max(0, Math.min(11, numVal - 1));

  useEffect(() => {
    if (hasPermission && (orientation.gamma || orientation.beta)) {
      setYaw(orientation.gamma * 2);
      setPitch(orientation.beta * 0.5);
    }
  }, [orientation, hasPermission]);

  const renderScene = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width; const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const totalYaw = yaw; const totalPitch = pitch;
    const pulse = Math.sin(time * 0.004) * 0.25 + 0.75;

    // 1. Dynamic Theater Atmosphere & Projection Glow
    const bgGrad = ctx.createRadialGradient(w / 2 + totalYaw, h / 2 + totalPitch - 40, 15, w / 2, h / 2, w);
    bgGrad.addColorStop(0, `rgba(30, 27, 75, ${pulse * 0.95})`); bgGrad.addColorStop(0.6, '#09090b'); bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, w, h);

    // 2. ENLARGED GIANT CURVED IMAX SCREEN
    ctx.save(); ctx.translate(w / 2 + totalYaw * 0.8, 70 + totalPitch * 0.6);
    const scrW = 280 * zoomScale; const scrH = 105 * zoomScale;
    ctx.beginPath(); ctx.ellipse(0, 0, scrW, scrH, 0, Math.PI, 0, true);
    ctx.lineWidth = 5; ctx.strokeStyle = `rgba(129, 140, 248, ${pulse})`; ctx.shadowColor = '#6366f1'; ctx.shadowBlur = 40 * pulse; ctx.stroke();
    const scrGrad = ctx.createLinearGradient(-scrW, -scrH, scrW, 0);
    scrGrad.addColorStop(0, 'rgba(99, 102, 241, 0.7)'); scrGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.55)'); scrGrad.addColorStop(1, 'rgba(168, 85, 247, 0.7)');
    ctx.fillStyle = scrGrad; ctx.fill();
    ctx.font = "bold 14px 'Outfit', sans-serif"; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.fillText('IMAX 3D SCREEN • LASER PROJECTION', 0, -scrH * 0.35);
    ctx.restore();

    // 3. Complete 3D Seats Matrix Layout (Rows A to H, Cols 1 to 12)
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let selectedCoords = { x: 0, y: 0 };

    rows.forEach((rName, r) => {
      const rScale = 0.6 + r * 0.065;
      const yPos = 145 + r * (22 * zoomScale) + totalPitch * 0.4;
      const startX = w / 2 - (5.5 * 24 * zoomScale * rScale) + totalYaw * 0.5;

      // Row Label
      ctx.font = "bold 11px 'Inter', sans-serif"; ctx.fillStyle = r === rowIdx ? '#38bdf8' : 'rgba(255,255,255,0.4)';
      ctx.fillText(rName, startX - 20 * zoomScale, yPos + 6);

      for (let c = 0; c < 12; c++) {
        const xPos = startX + c * (24 * zoomScale * rScale);
        const isSelected = r === rowIdx && c === colIdx;

        if (isSelected) selectedCoords = { x: xPos, y: yPos };

        ctx.beginPath(); ctx.arc(xPos, yPos, (isSelected ? 7.5 : 4) * zoomScale, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#38bdf8' : (r % 2 === 0 ? 'rgba(99,102,241,0.5)' : 'rgba(168,85,247,0.5)');
        if (isSelected) { ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 20 * pulse; } else { ctx.shadowBlur = 0; }
        ctx.fill();
      }
    });

    // 4. Interactive Sightline Beam & Floating OLED Seat Badge
    if (selectedCoords.x) {
      const screenCenterX = w / 2 + totalYaw * 0.8;
      const screenCenterY = 70 + totalPitch * 0.6;
      ctx.strokeStyle = `rgba(56, 189, 248, ${pulse * 0.85})`; ctx.lineWidth = 2.5; ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(selectedCoords.x, selectedCoords.y); ctx.lineTo(screenCenterX, screenCenterY); ctx.stroke(); ctx.setLineDash([]);

      // Selected Seat OLED Tag
      ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.roundRect(selectedCoords.x - 34, selectedCoords.y + 10, 68, 22, 6); ctx.fill();
      ctx.strokeStyle = '#38bdf8'; ctx.stroke(); ctx.font = "bold 11px 'Outfit', sans-serif"; ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center'; ctx.fillText(`SEAT ${seatId}`, selectedCoords.x, selectedCoords.y + 25);
    }
  }, [yaw, pitch, seatId, rowIdx, colIdx, zoomScale]);

  useEffect(() => {
    let animId: number;
    const loop = (t: number) => { renderScene(t); animId = requestAnimationFrame(loop); };
    animId = requestAnimationFrame(loop); return () => cancelAnimationFrame(animId);
  }, [renderScene]);

  return (
    <div className="relative w-full rounded-2xl border border-white/12 bg-neutral-950/70 backdrop-blur-[40px] saturate-[250%] p-5 text-white overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h4 className="text-base font-bold font-['Outfit'] tracking-wide">360° IMAX 3D Cinema Hall Portal</h4>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-cyan-300 font-bold text-sm">Selected: {seatId}</span>
        </div>
      </div>

      <div
        onWheel={(e) => { e.preventDefault(); setZoomScale((z) => Math.max(0.5, Math.min(1.8, z - e.deltaY * 0.001))); }}
        onMouseDown={(e) => { setIsDragging(true); setDragStart({ x: e.clientX - yaw, y: e.clientY - pitch }); }}
        onMouseMove={(e) => { if (isDragging) { setYaw(e.clientX - dragStart.x); setPitch(Math.max(-40, Math.min(40, e.clientY - dragStart.y))); } }}
        onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)}
        className="relative w-full h-80 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing border border-white/15"
      >
        <canvas ref={canvasRef} width={800} height={320} className="w-full h-full object-cover transform-gpu" />

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/80 backdrop-blur-md p-1.5 rounded-lg border border-white/10 z-10">
          <button onClick={() => setZoomScale((z) => Math.max(0.5, z - 0.2))} title="Zoom Out" className="p-1.5 hover:bg-white/10 rounded text-neutral-300"><ZoomOut className="w-4 h-4" /></button>
          <button onClick={() => setZoomScale(1.0)} className="px-2 py-0.5 text-xs font-mono text-cyan-300 font-bold">{Math.round(zoomScale * 100)}%</button>
          <button onClick={() => setZoomScale((z) => Math.min(1.8, z + 0.2))} title="Zoom In" className="p-1.5 hover:bg-white/10 rounded text-neutral-300"><ZoomIn className="w-4 h-4" /></button>
        </div>

        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-md bg-black/80 backdrop-blur-md text-xs text-cyan-300 border border-white/10 flex items-center gap-1.5">
          <Maximize2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Enlarged IMAX Hall & Seat Perspective
        </div>
      </div>
    </div>
  );
};
