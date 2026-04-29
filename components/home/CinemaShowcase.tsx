'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, MonitorPlay, Zap } from 'lucide-react';
import { getCinemas, Cinema } from '@/lib/actions/cinemas';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/lib/store';

export default function CinemaShowcase() {
  const router = useRouter();
  const { setLocation, setSelectedBranchId } = useBookingStore();
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getCinemas();
      if (res.success && res.data) {
        setCinemas(res.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleViewShowtimes = (cinema: Cinema) => {
    setLocation(`${cinema.city}, ישראל`);
    setSelectedBranchId(cinema._id);
    router.push('/branches');
  };

  if (loading) return null;

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-8 px-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter font-outfit text-right">
          מתחמי <span className="text-primary">Liquid Glass</span>
        </h2>
        <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
          <Zap size={16} className="text-cyan-400" />
          <span>בפריסה ארצית</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {cinemas.slice(0, 4).map((cinema, idx) => (
          <motion.div
            key={cinema._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-[32px] p-8 bg-white/5 border-[0.5px] border-white/10 backdrop-blur-[40px] hover:border-primary/50 transition-all duration-500 will-change-transform"
          >
            {/* Background Holographic Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/20 transition-colors" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="text-right">
                  <h3 className="text-xl md:text-2xl font-black text-white mb-2 font-outfit">{cinema.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm justify-end">
                    <span>{cinema.location}</span>
                    <MapPin size={14} className="text-primary" />
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                  <MonitorPlay className="text-primary" size={24} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8 justify-end">
                {cinema.facilities?.map((facility) => (
                  <span 
                    key={facility}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] md:text-xs font-bold text-slate-300 flex items-center gap-1.5"
                  >
                    {facility}
                    <Sparkles size={10} className="text-cyan-400" />
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                   {cinema.halls.map((hall, i) => (
                     <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white backdrop-blur-md">
                       {hall.name[0]}
                     </div>
                   ))}
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleViewShowtimes(cinema);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-[10px] md:text-xs font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all flex items-center gap-2 group/btn cursor-pointer z-50"
                >
                  <span className="relative z-10">צפה בלוח שידורים</span>
                  <MonitorPlay size={14} className="relative z-10 group-hover/btn:rotate-12 transition-transform" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

