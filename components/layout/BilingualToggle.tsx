"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LANGUAGES = {
  en: { label: "EN", flag: "🇺🇸" },
  he: { label: "HE", flag: "🇮🇱" },
};

export default function BilingualToggle() {
  const [lang, setLang] = useState<"en" | "he">("he");

  useEffect(() => {
    const saved = localStorage.getItem("site-lang") as "en" | "he";
    if (saved) {
      updateLang(saved);
    } else {
      updateLang("he"); // Project default is Hebrew
    }
  }, []);

  const updateLang = (newLang: "en" | "he") => {
    setLang(newLang);
    document.documentElement.setAttribute("lang", newLang);
    localStorage.setItem("site-lang", newLang);
    
    // Update document title if needed
    const TITLES = {
      en: "MOVIEBOOK | Premium Movie Booking",
      he: "MOVIEBOOK | הזמנת סרטים פרימיום",
    };
    document.title = TITLES[newLang];
  };

  return (
    <div className="lang-toggle flex items-center bg-black/20 p-0.5 border border-white/10 rounded-full">
      <button
        onClick={() => updateLang("en")}
        className={`lang-btn relative px-3 py-1.5 rounded-full text-[10px] font-display tracking-widest uppercase transition-colors z-10 ${
          lang === "en" ? "text-off-white" : "text-white/40 hover:text-white/60"
        }`}
      >
        {lang === "en" && (
          <motion.div
            layoutId="lang-active"
            className="absolute inset-0 bg-primary rounded-full -z-10 shadow-[0_4px_14px_rgba(255,20,100,0.3)]"
          />
        )}
        <span className="mr-1.5 text-xs">🇺🇸</span>EN
      </button>
      <button
        onClick={() => updateLang("he")}
        className={`lang-btn relative px-3 py-1.5 rounded-full text-[10px] font-display tracking-widest uppercase transition-colors z-10 ${
          lang === "he" ? "text-off-white" : "text-white/40 hover:text-white/60"
        }`}
      >
        {lang === "he" && (
          <motion.div
            layoutId="lang-active"
            className="absolute inset-0 bg-primary rounded-full -z-10 shadow-[0_4px_14px_rgba(255,20,100,0.3)]"
          />
        )}
        <span className="mr-1.5 text-xs">🇮🇱</span>HE
      </button>
    </div>
  );
}
