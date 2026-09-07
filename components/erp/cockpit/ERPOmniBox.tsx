'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { playCockpitTick } from './LiquidCockpitAudio';

interface CommandResult {
  id: string;
  actionType: string;
  title: string;
  summary: string;
  suggestedAction?: string;
  timestamp: string;
}

const QUICK_COMMANDS = [
  'מה תחזית הכנסות הקופות לסוף השבוע הקרוב?',
  'בצע אופטימיזציית תמחור דינמי לאולם IMAX',
  'בדוק מלאי פופקורן ושתייה לשעות שיא',
];

export const ERPOmniBox: React.FC = () => {
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<CommandResult[]>([]);

  const handleExecute = async (cmdToRun?: string) => {
    const targetCommand = (cmdToRun || command).trim();
    if (!targetCommand || loading) return;

    playCockpitTick(850);
    setLoading(true);

    try {
      const res = await fetch('/api/erp/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: targetCommand }),
      });

      if (res.ok) {
        const data = await res.json();
        setHistory((prev) => [
          {
            id: String(Date.now()),
            actionType: data.actionType || 'EXEC',
            title: data.title || 'פעולה עובדה',
            summary: data.summary || 'הפעולה הושלמה בהצלחה.',
            suggestedAction: data.suggestedAction,
            timestamp: data.timestamp || new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev,
        ].slice(0, 4));
        setCommand('');
      }
    } catch (err) {
      console.error('Failed to execute command:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full relative z-20"
      dir="rtl"
    >
      <div className="relative w-full max-w-4xl mx-auto group">
        <div className="absolute inset-0 bg-[#8A5CFF]/15 blur-2xl rounded-full opacity-60 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecute();
          }}
          className="relative flex items-center bg-black/70 border border-white/15 rounded-full px-6 py-3.5 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] group-focus-within:border-[#8A5CFF]/70 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-[#8A5CFF]/20 flex items-center justify-center text-[#8A5CFF] shrink-0 me-3">
            <Bot className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="הזן פקודת ניהול בשפה טבעית (למשל: תן תחזית למכירות פופקורן בסוף השבוע...)"
            className="w-full bg-transparent border-none text-white text-sm font-medium focus:outline-none focus:ring-0 placeholder:text-slate-500 text-right"
          />

          <button
            type="submit"
            disabled={loading || !command.trim()}
            onClick={() => playCockpitTick(900)}
            className="ms-3 px-5 py-2 rounded-full bg-[#8A5CFF] hover:bg-[#7847eb] text-white text-xs font-black transition-all flex items-center gap-1.5 disabled:opacity-40 shadow-[0_0_20px_rgba(138,92,255,0.4)] cursor-pointer"
          >
            {loading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{loading ? 'מנתח...' : 'הרץ פקודה'}</span>
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 justify-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest me-1">פקודות מהירות:</span>
          {QUICK_COMMANDS.map((chip, i) => (
            <button
              key={i}
              onClick={() => {
                setCommand(chip);
                handleExecute(chip);
              }}
              className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-[#8A5CFF]/40 transition-all"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Execution Results Drawer */}
      <AnimatePresence>
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-4xl mx-auto mt-4 space-y-2.5 overflow-hidden"
          >
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-2xl bg-black/60 border border-[#8A5CFF]/30 backdrop-blur-xl flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#8A5CFF]/20 text-[#8A5CFF] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white text-sm font-bold">{item.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8A5CFF]/20 text-purple-300 font-bold">
                        {item.actionType}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{item.summary}</p>
                    {item.suggestedAction && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                        <ArrowRight className="w-3 h-3" />
                        <span>המלצת המשך: {item.suggestedAction}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">{item.timestamp}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
