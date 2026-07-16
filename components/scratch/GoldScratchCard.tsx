'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ScratchCircle } from './ScratchCircle';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
}

interface GoldScratchCardProps {
  prizes: string[];
  locked: boolean;
  onRevealPrize: (prizeIndex: number, prizeName: string) => void;
}

export function GoldScratchCard({ prizes, locked, onRevealPrize }: GoldScratchCardProps) {
  const particlesCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const animating = useRef(false);
  const [activeRevealedId, setActiveRevealedId] = useState<number | null>(null);
  const [holoPos, setHoloPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoloPos({ x, y });
  };

  useEffect(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;
    canvas.width = 360;
    canvas.height = 500;
  }, []);

  const spawnParticles = (cx: number, cy: number) => {
    const arr: Particle[] = [];
    const colors = ['#FFEAA7', '#D4AF37', '#FFDF00', '#AA7C11', '#FFF'];
    for (let i = 0; i < 55; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 5.5;
      arr.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 4 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.018,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() * 2 - 1) * 0.1,
      });
    }
    particles.current = arr;
    if (!animating.current) {
      animating.current = true;
      animateParticles();
    }
  };

  const animateParticles = () => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let active = false;
    particles.current.forEach((p) => {
      if (p.alpha <= 0) return;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.vx *= 0.98;
      p.alpha -= p.decay;
      p.rotation += p.rotSpeed;

      if (p.alpha > 0) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;

        ctx.beginPath();
        const spikes = 5;
        const outerRadius = p.size;
        const innerRadius = p.size / 2;
        let rot = (Math.PI / 2) * 3;
        let cx = 0;
        let cy = 0;
        const step = Math.PI / spikes;

        ctx.moveTo(0, 0 - outerRadius);
        for (let i = 0; i < spikes; i++) {
          cx = Math.cos(rot) * outerRadius;
          cy = Math.sin(rot) * outerRadius;
          ctx.lineTo(cx, cy);
          rot += step;

          cx = Math.cos(rot) * innerRadius;
          cy = Math.sin(rot) * innerRadius;
          ctx.lineTo(cx, cy);
          rot += step;
        }
        ctx.lineTo(0, 0 - outerRadius);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    });

    if (active) {
      requestAnimationFrame(animateParticles);
    } else {
      animating.current = false;
    }
  };

  const handleReveal = (id: number, cx: number, cy: number) => {
    if (activeRevealedId !== null || locked) return;
    setActiveRevealedId(id);
    spawnParticles(cx, cy);
    onRevealPrize(id, prizes[id]);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ 
        width: 360, 
        height: 500,
        ['--holo-x' as any]: `${holoPos.x}%`,
        ['--holo-y' as any]: `${holoPos.y}%`
      }}
      className="relative rounded-3xl overflow-hidden select-none bg-[#0B0C10] border border-amber-500/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col"
      dir="rtl"
    >
      {/* Holographic Refraction Sheen Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-color-dodge opacity-45 transition-opacity duration-350"
        style={{
          background: `radial-gradient(circle at var(--holo-x, 50%) var(--holo-y, 50%), rgba(255, 0, 128, 0.4) 0%, rgba(0, 240, 255, 0.4) 45%, transparent 75%)`
        }}
      />

      {/* Absolute Particle Overlay */}
      <canvas
        ref={particlesCanvasRef}
        className="absolute inset-0 pointer-events-none z-30"
      />

      {/* Top Black Header Section (30% height) */}
      <header className="w-full bg-[#0F1015] pt-5 pb-4 px-6 flex flex-col items-center gap-1.5 border-b border-amber-500/15 z-10">
        <div className="relative w-14 h-14 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/5 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
          <div className="absolute inset-1 border border-dashed border-amber-500/40 rounded-full animate-spin [animation-duration:20s]" />
          <span className="text-amber-400 text-base font-black tracking-widest font-outfit">VIP</span>
        </div>
        <div className="text-[9px] font-bold text-amber-500/80 tracking-[0.25em] font-inter uppercase mt-1">
          FINSBURY NEURAL NODE
        </div>
      </header>

      {/* Bottom Gold Body Section (70% height) */}
      <div className="w-full flex-1 bg-gradient-to-b from-[#FCE181] via-[#ECAE1D] to-[#AA7C11] p-5 flex flex-col justify-between items-center z-10">
        {/* Title */}
        <div className="flex flex-col items-center gap-0.5">
          <h2 className="text-2xl font-black tracking-wider text-stone-900 font-outfit">
            HIGH FIVE AWARD
          </h2>
          <span className="text-amber-950/70 text-[10px] font-bold tracking-widest font-inter uppercase">
            SCRATCH CARD
          </span>
          <span className="text-stone-850 text-xs font-bold mt-1">
            גרד עיגול אחד בלבד כדי לחשוף את המתנה שלך
          </span>
        </div>

        {/* Grid of 6 circular scratch slots (2 rows of 3 columns) */}
        <div className="grid grid-cols-3 gap-4.5 justify-center items-center my-3 relative">
          {prizes.map((prize, index) => (
            <ScratchCircle
              key={index}
              id={index}
              prizeText={prize}
              locked={locked || (activeRevealedId !== null && activeRevealedId !== index)}
              onReveal={handleReveal}
            />
          ))}
        </div>

        {/* Instruction text footer */}
        <footer className="w-full border-t border-amber-950/15 pt-3">
          <p className="text-[10px] text-[#5c3e08] font-black tracking-widest font-inter">
            SCRATCH ONE PANEL TO CLAIM YOUR GIFT
          </p>
        </footer>
      </div>
    </div>
  );
}
