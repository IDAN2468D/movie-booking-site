'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Trophy, Crown, Users, Disc3, Mic, Sparkles, ShieldCheck, Flame } from 'lucide-react';
import { getUserTrophyVault } from '@/lib/actions/trophy-vault-actions';
import { TrophyItem, TrophyVaultState } from '@/lib/validations/trophy-vault-schema';

export const GenerativeTrophyVault: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [vaultData, setVaultData] = useState<TrophyVaultState | null>(null);
  const [selectedTrophy, setSelectedTrophy] = useState<TrophyItem | null>(null);

  useEffect(() => {
    getUserTrophyVault().then((res) => {
      if (res.success && res.data) {
        setVaultData(res.data);
        setSelectedTrophy(res.data.trophies[0] || null);
      }
    });
  }, []);

  // WebGL 3D Generative Holographic Crystal Particles Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * 600,
      y: Math.random() * 320,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      hue: Math.random() * 60 + 280,
    }));

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = 60 + Math.sin(time * 2) * 8;

      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, radius * 1.5);
      grad.addColorStop(0, 'rgba(236, 72, 153, 0.8)');
      grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 + time;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, 0.7)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Crown': return <Crown className="w-6 h-6 text-yellow-400" />;
      case 'Users': return <Users className="w-6 h-6 text-pink-400" />;
      case 'Disc3': return <Disc3 className="w-6 h-6 text-indigo-400" />;
      case 'Mic': return <Mic className="w-6 h-6 text-cyan-400" />;
      default: return <Trophy className="w-6 h-6 text-yellow-400" />;
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto p-6 rounded-3xl border border-white/12 bg-neutral-950/70 backdrop-blur-[40px] saturate-[250%] text-white shadow-2xl overflow-hidden text-right" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-pink-500/20 border border-yellow-500/30 text-yellow-400">
            <Trophy className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <h3 className="font-['Outfit'] font-black text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-300 to-purple-400">
              כספת גביעים והישגים 3D
            </h3>
            <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              כספת העיטורים הקולנועיים והפרסים ההולוגרפיים
            </p>
          </div>
        </div>

        {vaultData && (
          <div className="px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-xs font-bold text-yellow-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-400" />
            {vaultData.totalUnlocked} מתוך {vaultData.totalTrophies} גביעים פתוחים
          </div>
        )}
      </div>

      {/* WebGL Holographic Gem Viewport */}
      <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-white/15 bg-black/80 mb-6 flex items-center justify-center">
        <canvas ref={canvasRef} width={600} height={320} className="w-full h-full object-cover transform-gpu" />

        {selectedTrophy && (
          <div className="absolute bottom-4 right-4 left-4 p-4 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/20">
                {getIcon(selectedTrophy.iconName)}
              </div>
              <div>
                <h4 className="font-bold text-white text-base">{selectedTrophy.title}</h4>
                <p className="text-xs text-neutral-300">{selectedTrophy.description}</p>
              </div>
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40">
              דרגה: {selectedTrophy.rarity}
            </span>
          </div>
        )}
      </div>

      {/* Trophy Cards Grid */}
      {vaultData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {vaultData.trophies.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrophy(t)}
              className={`p-4 rounded-2xl border text-right transition-all active:scale-95 flex flex-col justify-between ${
                selectedTrophy?.id === t.id
                  ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">{getIcon(t.iconName)}</div>
                <Flame className="w-3.5 h-3.5 text-yellow-400" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-white mb-1 truncate">{t.title}</h5>
                <span className="text-[10px] text-neutral-400 block font-semibold">גביע {t.rarity}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
