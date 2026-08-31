'use client';

import React, { useState, useEffect } from 'react';
import { Dna, Sparkles } from 'lucide-react';
import { CineDnaNode, CineDnaNodeType, CineDnaGraphData } from '@/lib/schemas/cineDna.schema';
import { fetchCineDnaGraph } from '@/lib/actions/cineDnaActions';
import { CineDnaCanvas } from '@/components/cinedna/CineDnaCanvas';
import { DnaNodeCard } from '@/components/cinedna/DnaNodeCard';
import { DnaFilterControls } from '@/components/cinedna/DnaFilterControls';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

export default function CineDnaPage() {
  const [data, setData] = useState<CineDnaGraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<CineDnaNode | null>(null);
  const [activeFilters, setActiveFilters] = useState<CineDnaNodeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCineDnaGraph({ movieId: '693134', filters: activeFilters })
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
          setSelectedNode(res.data.nodes[0] || null);
        }
      })
      .finally(() => setIsLoading(false));
  }, [activeFilters]);

  const handleToggleFilter = (type: CineDnaNodeType) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen px-4 md:px-12 py-8 space-y-8 text-right" dir="rtl">
      {/* Hero Header */}
      <div className="p-6 md:p-10 rounded-[40px] bg-black/60 backdrop-blur-3xl border border-cyan-500/25 shadow-[0_25px_80px_rgba(6,182,212,0.2)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black">
            <Dna size={16} />
            <span>CineDNA Neural Fingerprint Explorer</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white font-rubik">
            חוקר הגנום הקולנועי הרב-ממדי
          </h1>
          <p className="text-sm text-off-white/70 max-w-2xl">
            גלה קשרים סגנוניים, פלטות צבעים, במאים, צלמים ומוטיבים נרטיביים המחברים את הסרטים האהובים עליך באמצעות בינה מלאכותית נוירונית.
          </p>
        </div>
      </div>

      {/* Filters */}
      <DnaFilterControls activeFilters={activeFilters} onToggleFilter={handleToggleFilter} />

      {/* Main Graph Grid */}
      {isLoading ? (
        <div className="h-[480px] flex items-center justify-center">
          <LoadingIndicator variant="spinner" size={36} color="#06B6D4" label="ממפה קשרים גנטיים..." />
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <CineDnaCanvas
              nodes={data.nodes}
              edges={data.edges}
              onSelectNode={(node) => setSelectedNode(node)}
            />
          </div>
          <div>
            <DnaNodeCard node={selectedNode} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
