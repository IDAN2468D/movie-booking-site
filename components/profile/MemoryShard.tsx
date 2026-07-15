"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";

export interface BookingMemory {
  id: string;
  movieTitle: string;
  posterUrl: string;
  date: string;
  seats: string[];
}

export function MemoryShard({ booking }: { booking: BookingMemory }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // 3D Tilt calculation
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden group border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-pointer"
    >
      {/* Background Poster */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${booking.posterUrl})` }}
      />
      
      {/* Liquid Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent backdrop-blur-[2px]" />
      
      {/* Specular Refraction Highlight */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%)",
          x,
          y
        }}
      />

      {/* Content */}
      <div className="absolute bottom-0 w-full p-6 flex flex-col gap-2">
        <h3 className="text-white font-['Outfit'] font-black text-xl leading-tight drop-shadow-md">
          {booking.movieTitle}
        </h3>
        <div className="flex items-center justify-between text-white/70 text-xs font-['Inter']">
          <span>{new Date(booking.date).toLocaleDateString('he-IL')}</span>
          <span className="bg-white/10 px-2 py-1 rounded-md backdrop-blur-md">
            {booking.seats.length} כרטיסים
          </span>
        </div>
      </div>
    </motion.div>
  );
}
