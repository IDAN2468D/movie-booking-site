'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, BookOpen, Layers, ShieldCheck } from 'lucide-react';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { generateScreenplayBranchAction, SceneBranchNode } from '@/app/actions/screenplayBranchActions';
import { SceneGraphTree } from './SceneGraphTree';

interface WhatIfSandboxModalProps {
  movieTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function WhatIfSandboxModal({ movieTitle, isOpen, onClose }: WhatIfSandboxModalProps) {
  const [divergencePoint, setDivergencePoint] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [nodes, setNodes] = useState<SceneBranchNode[]>([]);
  const [activeNode, setActiveNode] = useState<SceneBranchNode | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (queryText?: string) => {
    const textToUse = queryText || divergencePoint;
    if (!textToUse.trim() || isGenerating) return;

    setIsGenerating(true);
    const res = await generateScreenplayBranchAction({
      movieTitle,
      divergencePoint: textToUse,
    });
    setIsGenerating(false);

    if (res.success && res.data) {
      setNodes((prev) => [res.data as SceneBranchNode, ...prev]);
      setActiveNode(res.data as SceneBranchNode);
      if (!queryText) setDivergencePoint('');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-950/90 border border-white/15 rounded-3xl p-6 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)] scrollbar-thin"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-outfit text-white">
                  מעבדת התסריטים של Gemini: {movieTitle}
                </h3>
                <p className="text-xs text-gray-400">סימולציית ענפי עלילה ותוצאות אלטרנטיביות בזמן אמת</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={divergencePoint}
                onChange={(e) => setDivergencePoint(e.target.value)}
                placeholder="מה היה קורה אם הגיבור היה מסרב למשימה?..."
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-fuchsia-500/60 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button
                type="button"
                disabled={isGenerating || !divergencePoint.trim()}
                onClick={() => handleGenerate()}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 text-white font-bold text-xs rounded-2xl shadow-lg disabled:opacity-40 transition-all"
              >
                {isGenerating ? <LoadingIndicator size="sm" variant="spinner" /> : <Send className="w-4 h-4" />}
                <span>חולל</span>
              </button>
            </div>
          </div>

          {nodes.length > 0 && (
            <SceneGraphTree
              nodes={nodes}
              activeNodeId={activeNode?.id || ''}
              onSelectNode={(node) => setActiveNode(node)}
              onExploreChoice={(choice) => handleGenerate(choice)}
            />
          )}

          {activeNode && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-fuchsia-300">{activeNode.title}</h4>
                <span className="text-xs text-gray-400 font-mono">{activeNode.divergenceTone}</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">{activeNode.summary}</p>
              <div className="pt-3 border-t border-white/10 space-y-1.5">
                <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-fuchsia-400" /> השלכות על הדמויות:
                </span>
                <ul className="space-y-1 text-xs text-gray-400 list-disc list-inside">
                  {activeNode.characterFate.map((fate, idx) => (
                    <li key={idx}>{fate}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
