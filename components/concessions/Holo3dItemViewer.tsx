'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HoloConcessionItem } from '@/lib/types/concession';

interface Holo3dItemViewerProps {
  item: HoloConcessionItem;
  onAddToCart: (item: HoloConcessionItem) => void;
}

export const Holo3dItemViewer: React.FC<Holo3dItemViewerProps> = ({ item, onAddToCart }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotateY, setRotateY] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const isHovered = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      speedY: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.7 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < 0) p.y = canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${item.glowHex}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [item]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateY((x / rect.width) * 36);
    setRotateX((-y / rect.height) * 36);
  };

  const handleMouseLeave = () => {
    setRotateY(0);
    setRotateX(0);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto space-y-4">
      {/* 3D Hologram Projection Container */}
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => (isHovered.current = true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-80 rounded-3xl backdrop-blur-[40px] saturate-[250%] bg-neutral-950/50 border border-white/10 p-6 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_inset_0_0_30px_rgba(255,255,255,0.05)] transform-gpu"
        style={{ perspective: 1000 }}
      >
        {/* Background Particle Canvas */}
        <canvas ref={canvasRef} width={400} height={320} className="absolute inset-0 pointer-events-none opacity-60" />

        {/* Dynamic Holographic Laser Cone Beam */}
        <div
          className="absolute bottom-0 w-48 h-64 opacity-20 pointer-events-none transform-gpu transition-all duration-500"
          style={{
            background: `conic-gradient(from 180deg at 50% 100%, ${item.glowHex} 0deg, transparent 60deg, transparent 300deg, ${item.glowHex} 360deg)`
          }}
        />

        {/* 3D Rotating Holographic Target */}
        <motion.div
          animate={{ rotateY, rotateX }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative z-10 flex flex-col items-center justify-center select-none"
        >
          {/* Hologram Floating Icon with Glow */}
          <div className="relative mb-3">
            <span
              className="text-7xl md:text-8xl filter drop-shadow-[0_0_25px_rgba(255,255,255,0.6)] transform-gpu inline-block animate-pulse"
              style={{ textShadow: `0 0 40px ${item.glowHex}` }}
            >
              {item.icon}
            </span>
            <div
              className="absolute -inset-4 rounded-full blur-xl opacity-40 pointer-events-none"
              style={{ background: item.glowHex }}
            />
          </div>

          <h2 className="text-2xl font-bold font-outfit text-white tracking-wide text-center">
            {item.name}
          </h2>
          <p className="text-xs text-neutral-400 font-inter mt-1 max-w-xs text-center line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-neutral-200 border border-white/15">
              🔥 {item.energyKcal} kcal
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              🎬 {item.recommendedGenres.join(' • ')}
            </span>
          </div>
        </motion.div>

        {/* Holo Emitter Base Ring */}
        <div
          className="absolute bottom-3 w-40 h-6 rounded-full border border-white/20 blur-[1px] opacity-60 shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-pulse"
          style={{ borderColor: item.glowHex }}
        />
      </div>

      {/* Item Action & Price Card */}
      <div className="flex items-center justify-between w-full px-2">
        <div>
          <span className="text-xs text-neutral-400 font-inter">מחיר יחידה הולוגרפי</span>
          <div className="text-2xl font-extrabold font-outfit text-amber-400">
            ₪{item.price}
          </div>
        </div>

        <button
          onClick={() => onAddToCart(item)}
          className="px-6 py-3 rounded-2xl font-outfit text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transform-gpu"
        >
          + הוסף למגש ההולוגרפי
        </button>
      </div>
    </div>
  );
};
