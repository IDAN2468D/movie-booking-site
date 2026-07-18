import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AtmosphericProfile } from '@/lib/validations/movieValidation';
import { useAtmosphericAcoustics } from '@/hooks/useAtmosphericAcoustics';

interface AtmosphericCanvasProps {
  profile: AtmosphericProfile;
  isActive: boolean;
  audioUrl?: string;
}

export function AtmosphericCanvas({ profile, isActive, audioUrl }: AtmosphericCanvasProps) {
  useAtmosphericAcoustics({ isActive, audioUrl });

  const particles = useMemo(() => {
    if (profile === 'none' || !isActive) return [];
    
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 2,
    }));
  }, [profile, isActive]);

  if (!isActive || profile === 'none') return null;

  const getProfileColors = () => {
    switch (profile) {
      case 'rain': return 'bg-blue-400';
      case 'fire': return 'bg-orange-500';
      case 'snow': return 'bg-white';
      case 'cyber': return 'bg-cyan-400';
      default: return 'bg-transparent';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-overlay">
      <div className={`absolute inset-0 opacity-20 ${getProfileColors()} transition-opacity duration-1000`} />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${getProfileColors()}`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}vw`,
            top: `${p.y}vh`,
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: [0, 1, 0], y: ['0vh', '100vh'] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
