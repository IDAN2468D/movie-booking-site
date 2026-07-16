"use client";

import React, { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Share2, Check, Copy } from "lucide-react";
import { toPng } from "html-to-image";

interface WrappedShareButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
}

export default function WrappedShareButton({
  targetRef,
}: WrappedShareButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleShare = useCallback(async () => {
    if (!targetRef.current) return;

    try {
      const dataUrl = await toPng(targetRef.current, {
        backgroundColor: "#0a0a0a",
        pixelRatio: 2,
      });

      // Convert data URL to blob for Web Share API
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "cinema-wrapped.png", {
        type: "image/png",
      });

      // Try Web Share API first
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "הסיכום הקולנועי שלי",
          text: "הנה הסיכום הקולנועי השנתי שלי! 🎬",
          files: [file],
        });
        return;
      }

      // Fallback: copy image to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.warn("Share failed:", e);
    }
  }, [targetRef]);

  return (
    <motion.button
      onClick={handleShare}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl
        backdrop-blur-xl border border-white/10
        text-sm font-[Outfit] font-bold tracking-wide
        transition-colors"
      style={{
        background: copied
          ? "rgba(34, 197, 94, 0.15)"
          : "rgba(255, 255, 255, 0.06)",
        color: copied ? "#4ade80" : "#ffffff",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
      }}
      dir="rtl"
    >
      {copied ? (
        <>
          <Check size={16} />
          הועתק!
        </>
      ) : (
        <>
          <Share2 size={16} />
          שתף
          <Copy size={14} className="text-white/40" />
        </>
      )}
    </motion.button>
  );
}
