"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface StoryCircleProps {
  posterUrl: string;
  title: string;
  hasViewed: boolean;
  onClick: () => void;
}

export default function StoryCircle({ posterUrl, title, hasViewed, onClick }: StoryCircleProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div
        className={`p-[3px] rounded-full ${
          hasViewed
            ? "bg-gray-600/50" // Dimmed gray for viewed
            : "bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500" // Cinematic gradient
        }`}
      >
        <div className="p-1 bg-black rounded-full">
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-transparent">
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 64px, 80px"
            />
          </div>
        </div>
      </div>
      <span className="text-xs md:text-sm font-medium text-white/80 max-w-[80px] truncate">
        {title}
      </span>
    </motion.div>
  );
}
