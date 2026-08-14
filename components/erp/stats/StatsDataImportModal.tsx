'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, UploadCloud, Clipboard, Check, AlertCircle, FileText } from 'lucide-react';
import { parseCsvOrPastedText } from '@/lib/erp/stats/csvParser';
import { normalizeRawOrder } from '@/lib/erp/stats/normalizer';
import { calculateSiteStats } from '@/lib/erp/stats/metricsCalculator';
import { detectAnomalies } from '@/lib/erp/stats/anomalyDetector';
import { ComputedSiteStats } from '@/lib/erp/stats/types';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (stats: ComputedSiteStats, sourceName: string) => void;
}

export default function StatsDataImportModal({ isOpen, onClose, onImportSuccess }: Props) {
  const [tab, setTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [previewCount, setPreviewCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const processText = (text: string, sourceName: string) => {
    try {
      const rawOrders = parseCsvOrPastedText(text);
      if (rawOrders.length === 0) {
        setErrorMsg('לא זוהו שורות נתונים תקינות בקובץ/טקסט שהוזן.');
        return;
      }
      const normalized = rawOrders.map((r, i) => normalizeRawOrder(r, i));
      const calculated = calculateSiteStats(normalized);
      calculated.anomalies = detectAnomalies(calculated.timeSeriesDaily);

      onImportSuccess(calculated, sourceName);
      onClose();
    } catch {
      setErrorMsg('שגיאה בעיבוד הנתונים. ודא שהקובץ בפורמט CSV או טקסט טבלאי.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      processText(content, file.name);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) {
      setErrorMsg('אנא הדבק נתוני טבלה או שורות CSV.');
      return;
    }
    processText(pastedText, 'נתונים מודבקים');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-slate-950 border border-white/10 rounded-[36px] p-6 md:p-8 shadow-2xl space-y-6 relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">ייבוא נתונים חיצוניים (movie-site-stats)</h3>
              <p className="text-xs text-slate-400">טעינת דוחות GA4, ייצוא מערכות אדמין או הדבקת טבלאות</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Mode Switch */}
        <div className="flex p-1 bg-black/50 border border-white/5 rounded-2xl">
          <button
            onClick={() => { setTab('upload'); setErrorMsg(''); }}
            className={cn('flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2', tab === 'upload' ? 'bg-primary text-black' : 'text-slate-400 hover:text-white')}
          >
            <UploadCloud size={16} />
            העלאת קובץ CSV
          </button>
          <button
            onClick={() => { setTab('paste'); setErrorMsg(''); }}
            className={cn('flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2', tab === 'paste' ? 'bg-primary text-black' : 'text-slate-400 hover:text-white')}
          >
            <Clipboard size={16} />
            הדבקת טבלה / טקסט
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Upload Body */}
        {tab === 'upload' ? (
          <div className="p-8 border-2 border-dashed border-white/10 hover:border-primary/50 rounded-3xl text-center space-y-4 transition-colors relative cursor-pointer bg-white/[0.02]">
            <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <FileText size={40} className="mx-auto text-primary/60" />
            <div>
              <p className="text-white font-bold text-sm">גרור לכאן קובץ CSV או לחץ לבחירה</p>
              <p className="text-[11px] text-slate-500 mt-1">תומך ב-GA4 Ecommerce, אקסל ישראלי (UTF-8) וחשבונית ירוקה / iCount</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="הדבק כאן שורות מטבלה או מקובץ CSV (תאריך, שם סרט, סכום, סטטוס)..."
              className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white outline-none focus:border-primary/50"
            />
            <button
              onClick={handlePasteSubmit}
              className="w-full py-4 bg-primary text-black font-black rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all text-xs uppercase tracking-wider"
            >
              עבד ונתח נתונים
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
