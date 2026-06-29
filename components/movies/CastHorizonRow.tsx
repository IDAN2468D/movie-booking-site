"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface ICastMember {
  actorId: string;
  name: string;
  characterName: string;
  avatarUrl: string;
}

interface CastHorizonRowProps {
  cast: ICastMember[];
}

export function CastHorizonRow({ cast }: CastHorizonRowProps) {
  if (!cast || cast.length === 0) return null;

  return (
    <div className="mt-12" dir="rtl">
      <h3 className="text-xl font-bold text-white mb-6 font-['Assistant',_'Rubik',_sans-serif] leading-relaxed drop-shadow-md px-4 md:px-0">
        צוות השחקנים
      </h3>
      
      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto space-x-6 space-x-reverse pb-4 scrollbar-none px-4 md:px-0 scroll-smooth snap-x">
        {cast.map((member) => (
          <Link 
            href={`/actor/${member.actorId}`}
            key={member.actorId} 
            className="flex flex-col items-center flex-shrink-0 cursor-pointer group snap-start w-24 md:w-28"
          >
            {/* Avatar with Glass Rim */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 border-2 border-white/10 group-hover:border-[#00F0FF]/60 transition-colors duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Image 
                src={member.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"} 
                alt={member.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 80px, 96px"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              />
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"></div>
            </div>
            
            {/* Typography Shielded Texts */}
            <span className="text-sm font-bold text-gray-200 text-center font-['Assistant',_'Rubik',_sans-serif] leading-relaxed w-full line-clamp-2 transition-colors group-hover:text-[#00F0FF]">
              {member.name}
            </span>
            <span className="text-xs text-gray-500 text-center mt-1 font-['Assistant',_'Rubik',_sans-serif] leading-relaxed w-full line-clamp-1">
              {member.characterName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
