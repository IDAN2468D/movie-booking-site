'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CastMember, getImageUrl } from '@/lib/tmdb';
import { User } from 'lucide-react';

interface Props {
  cast: CastMember[];
}

export default function MovieCastSection({ cast }: Props) {
  if (!cast.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
        שחקנים
        <div className="w-2 h-2 rounded-full bg-[#FF9F0A]" />
      </h2>

      <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
        {cast.map((person, i) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.05 }}
            className="flex-shrink-0 w-[130px] group"
          >
            <div className="w-[130px] h-[170px] rounded-2xl overflow-hidden bg-white/5 border border-white/5 relative mb-3 group-hover:border-[#FF9F0A]/30 transition-all">
              {person.profile_path ? (
                <Image
                  src={getImageUrl(person.profile_path)}
                  alt={person.name}
                  fill
                  sizes="130px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-[#1A1A1A]">
                  <User size={36} className="text-slate-700" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#FF9F0A] transition-colors">{person.name}</p>
            <p className="text-[10px] text-slate-500 line-clamp-1 font-medium">{person.character}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
