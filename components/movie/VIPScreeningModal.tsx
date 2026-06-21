'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Loader2, Link as LinkIcon, X, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils/index';

export default function VIPScreeningModal({ isOpen, onClose, movieTitle }: { isOpen: boolean, onClose: () => void, movieTitle: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateSite = async () => {
    setIsGenerating(true);
    setHtmlContent(null);
    try {
      const res = await fetch('/api/ai/landing-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieTitle })
      });
      const data = await res.json();
      if (data.success) {
        setHtmlContent(data.html);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://moviebook.io/invite/vip-${Date.now()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-right" dir="rtl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-[#0A0A0A] border border-yellow-500/20 rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Crown className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">VIP Screening Invite</h3>
                  <p className="text-sm text-gray-400">מיניסייט להזמנת חברים להקרנה פרטית</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 flex-grow overflow-y-auto custom-scrollbar flex flex-col items-center">
              {!htmlContent && !isGenerating && (
                <div className="text-center max-w-md mx-auto py-12">
                  <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-6 opacity-50" />
                  <h2 className="text-2xl font-bold text-white mb-4">צור עמוד נחיתה אישי לאירוע שלך</h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    ה-AI שלנו ייצר עמוד נחיתה מרהיב וחכם המעוצב ברוח הסרט <b>{movieTitle}</b>, אותו תוכל לשלוח לחברים בוואטסאפ לאישור הגעה.
                  </p>
                  <button
                    onClick={generateSite}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-black text-lg hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Crown className="w-5 h-5" />
                    צור עמוד הזמנה באמצעות AI
                  </button>
                </div>
              )}

              {isGenerating && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-xl bg-yellow-500/30 animate-pulse" />
                    <Loader2 className="w-12 h-12 text-yellow-500 animate-spin relative z-10" />
                  </div>
                  <p className="text-yellow-400 font-medium animate-pulse text-lg">מייצר קוד HTML/CSS ומרנדר עמוד נחיתה...</p>
                </div>
              )}

              {htmlContent && (
                <div className="w-full h-full flex flex-col gap-6">
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                      <LinkIcon className="w-4 h-4" />
                      https://moviebook.io/invite/vip-{Date.now()}
                    </div>
                    <button 
                      onClick={copyLink}
                      className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg flex items-center gap-2 hover:bg-yellow-400 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'הועתק!' : 'העתק קישור לחברים'}
                    </button>
                  </div>
                  
                  <div className="flex-grow w-full rounded-2xl overflow-hidden border-2 border-white/10 shadow-[0_0_50px_rgba(234,179,8,0.15)] bg-white relative min-h-[500px]">
                     <iframe 
                       srcDoc={htmlContent} 
                       className="w-full h-full absolute inset-0"
                       sandbox="allow-scripts"
                     />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
