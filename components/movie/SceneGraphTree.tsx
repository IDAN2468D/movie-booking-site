'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GitFork, Sparkles, CheckCircle2, ChevronLeft } from 'lucide-react';
import { SceneBranchNode } from '@/app/actions/screenplayBranchActions';

interface SceneGraphTreeProps {
  nodes: SceneBranchNode[];
  activeNodeId: string;
  onSelectNode: (node: SceneBranchNode) => void;
  onExploreChoice: (choiceText: string) => void;
}

export const SceneGraphTree: React.FC<SceneGraphTreeProps> = ({
  nodes,
  activeNodeId,
  onSelectNode,
  onExploreChoice,
}) => {
  return (
    <div className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 my-4 backdrop-blur-xl" dir="rtl">
      <div className="flex items-center gap-2 mb-4">
        <GitFork className="w-4 h-4 text-fuchsia-400" />
        <h4 className="text-sm font-bold text-white">עץ ענפי העלילה והתסריטים המקבילים</h4>
      </div>

      <div className="flex flex-col gap-3">
        {nodes.map((node, index) => {
          const isActive = node.id === activeNodeId;
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-fuchsia-500/10 border-fuchsia-500/40 shadow-[0_0_20px_rgba(217,70,239,0.15)]'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
              onClick={() => onSelectNode(node)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-fuchsia-500/20 text-fuchsia-300 font-bold text-xs flex items-center justify-center border border-fuchsia-500/30">
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold text-white">{node.title}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-fuchsia-300 font-mono">
                  {node.divergenceTone}
                </span>
              </div>

              <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed mb-3">
                {node.summary}
              </p>

              {isActive && node.choices && node.choices.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-fuchsia-400 block">
                    המשך פיצול עלילתי:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {node.choices.map((choice, cIdx) => (
                      <button
                        key={cIdx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onExploreChoice(choice);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fuchsia-500/20 hover:bg-fuchsia-500/30 border border-fuchsia-500/40 text-[11px] text-white font-medium transition-all"
                      >
                        <Sparkles className="w-3 h-3 text-fuchsia-300" />
                        <span>{choice}</span>
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
