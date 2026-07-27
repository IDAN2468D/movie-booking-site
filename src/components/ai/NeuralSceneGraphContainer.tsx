"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateSceneGraph } from "@/app/actions/phase37Actions";

interface NodeItem {
  id: string;
  label: string;
  type: string;
  color: string;
}

export function NeuralSceneGraphContainer() {
  const [nodes, setNodes] = useState<NodeItem[]>([
    { id: "node-1", label: "Protagonist Arc", type: "Character", color: "#00F0FF" },
    { id: "node-2", label: "Quantum Climax", type: "Plot Node", color: "#FF007A" },
    { id: "node-3", label: "Hidden Cipher", type: "Easter Egg", color: "#7000FF" },
  ]);
  const [selectedNode, setSelectedNode] = useState<NodeItem | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetchGraph = async () => {
    setLoading(true);
    const res = await generateSceneGraph({ movieId: "quantum-cinematic-99", depth: 2 });
    setLoading(false);
    if (res.success && res.data) {
      setNodes(res.data.nodes);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl backdrop-blur-[40px] saturate-[250%] brightness-105 bg-neutral-950/40 border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-white space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-outfit text-purple-400">
          🧠 AI Neural Screenplay & Scene Graph
        </h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
          Sprint 95 • AI Scene Graph
        </span>
      </div>

      <p className="text-xs text-neutral-300 font-inter">
        ניתוח ויזואלי של עלילת הסרט וקשרי הדמויות באמצעות מפת ניורונים אינטראקטיבית
      </p>

      {/* Interactive Node Graph Area */}
      <div className="relative h-44 rounded-xl bg-neutral-900/60 border border-purple-500/20 p-4 flex items-center justify-around overflow-hidden">
        {/* Decorative Synapse Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-purple-500/20">
          <line x1="20%" y1="50%" x2="50%" y2="50%" strokeWidth="2" strokeDasharray="4" />
          <line x1="50%" y1="50%" x2="80%" y2="50%" strokeWidth="2" strokeDasharray="4" />
        </svg>

        {nodes.map((node) => (
          <motion.button
            key={node.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedNode(node)}
            className="relative z-10 p-3 rounded-xl backdrop-blur-md border text-center transition-all shadow-lg"
            style={{
              borderColor: node.color,
              backgroundColor: `${node.color}15`,
              boxShadow: `0 0 15px ${node.color}40`,
            }}
          >
            <div className="w-3 h-3 rounded-full mx-auto mb-1.5" style={{ backgroundColor: node.color }} />
            <div className="text-xs font-bold text-white">{node.label}</div>
            <div className="text-[10px] text-neutral-400">{node.type}</div>
          </motion.button>
        ))}
      </div>

      {/* Node Detail Drawer */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs flex justify-between items-center"
          >
            <div>
              <span className="font-bold text-purple-300">{selectedNode.label}:</span>{" "}
              <span className="text-neutral-300">
                AI Narrative Link analysis established for {selectedNode.type}.
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-neutral-400 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end pt-1">
        <button
          onClick={handleFetchGraph}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50"
        >
          {loading ? "Analyzing Scene Graph..." : "Regenerate AI Graph"}
        </button>
      </div>
    </motion.div>
  );
}
