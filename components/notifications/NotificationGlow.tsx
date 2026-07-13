"use client";

import React from "react";
import { motion } from "framer-motion";
import { NotificationInput } from "@/lib/validations/notifications";

export const NotificationGlow: React.FC<{ severity: NotificationInput["severity"] }> = ({ severity }) => {
  const getGlowConfig = () => {
    switch (severity) {
      case "SYSTEM_ALERT":
        return {
          bg: "bg-amber-500",
          opacity: "opacity-40",
          scale: 1.05,
          blend: "",
        };
      case "VIP_AUCTION_OUTBID":
        return {
          bg: "bg-purple-600",
          opacity: "opacity-50",
          scale: 1.1,
          blend: "mix-blend-overlay",
        };
      default:
        return {
          bg: "bg-sky-400",
          opacity: "opacity-20",
          scale: 1,
          blend: "",
        };
    }
  };

  const config = getGlowConfig();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: config.scale }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute inset-0 pointer-events-none -z-10"
    >
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full blur-[80px] animate-pulse ${config.bg} ${config.opacity} ${config.blend}`} 
        style={{ willChange: "transform, opacity", animationDuration: "4s" }}
      />
    </motion.div>
  );
};
