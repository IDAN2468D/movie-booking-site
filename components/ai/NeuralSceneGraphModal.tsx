'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, Sparkles, Flame, RefreshCw } from 'lucide-react';
import { generateNeuralSceneGraph } from '@/app/actions/neuralSceneActions';

interface NodeItem {
  id: number;
  chapter: string;
  valence: number;
  intensity: number;
  dialogueDensity: number;
}

export function NeuralSceneGraphModal() {
  const [movieTitle, setMovieTitle] = useState('Dune: Part Two');
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<NodeItem[]>([
    { id: 1, chapter: 'מערכה 1: התעוררות המדבר', valence: 0.4, intensity: 0.75, dialogueDensity: 0.6 },
    { id: 2, chapter: 'מערכה 2: המבחן והנבואה', valence: 0.7, intensity: 0.9, dialogueDensity: 0.4 },
    { id: 3, chapter: 'מערכה 3: קרב הקולנוע האקוסטי', valence: 0.95, intensity: 0.98, dialogueDensity: 0.3 },
  ]);

  const handleFetchGraph = async () => {
    setLoading(true);
    const res = await generateNeuralSceneGraph({ movieTitle });
    setLoading(false);

    if (res.success && res.data?.nodes) {
      setNodes(res.data.nodes);
    }
  };

  return (
    <div dir="rtl" className="w-full max-w-xl p-6 rounded-2xl bg-neutral-900/90 border border-purple-500/30 backdrop-blur-xl shadow-2xl text-right">
      <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Gemini AI Neural Mood & Scene Graph
            </h3>
            <p className="text-xs text-neutral-400">
              ניתוח עוצמה אקוסטית ורגשית בסרט מראש
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
          gemini-3.5-flash-lite
        </span>
      </div>

      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-400"
          placeholder="שם הסרט לניתוח..."
        />
        <button
          onClick={handleFetchGraph}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          נתח מחדש
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <span className="text-xs text-purple-300 font-semibold block">גרף מפת המערכות והאקוסטיקה:</span>
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                {node.chapter}
              </span>
              <span className="text-purple-300 font-mono">עוצמה: {Math.round(node.intensity * 100)}%</span>
            </div>

            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${node.intensity * 100}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs text-neutral-400">
        <span className="flex items-center gap-1">
          <Flame className="w-4 h-4 text-pink-400" />
          סריקת סצינות אקוסטית הושלמה
        </span>
        <span className="font-mono text-purple-400">Liquid Glass 4.0 UI</span>
      </div>
    </div>
  );
}
