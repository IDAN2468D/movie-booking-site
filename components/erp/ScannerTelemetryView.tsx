'use client';

import React, { useState } from 'react';
import { QrCode, AlertOctagon, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScannerGate {
  id: string;
  gateNameHe: string;
  scansPerMinute: number;
  status: 'normal' | 'congested' | 'critical';
}

export const ScannerTelemetryView: React.FC = () => {
  const [gates] = useState<ScannerGate[]>([
    { id: 'g1', gateNameHe: 'שער כניסה ראשי A (IMAX)', scansPerMinute: 48, status: 'congested' },
    { id: 'g2', gateNameHe: 'שער VIP צפוני B', scansPerMinute: 12, status: 'normal' },
    { id: 'g3', gateNameHe: 'שער מתחם קולנוע 3-6', scansPerMinute: 62, status: 'critical' }
  ]);

  const statusColors = {
    normal: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    congested: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
    critical: 'bg-red-500/20 border-red-500/40 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-black/85 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] text-white" dir="rtl">
      <div className="flex items-center justify-between mb-4 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <QrCode className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-['Outfit'] text-lg font-bold text-cyan-300">Predictive Maintenance & Hall Scanner Sync</h3>
            <p className="text-xs text-gray-400">ניטור עומסים וטלמטריה של סורקי UVScannerTicket</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {gates.map(gate => (
          <div
            key={gate.id}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${statusColors[gate.status]}`}
          >
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span>{gate.gateNameHe}</span>
                {gate.status === 'critical' && (
                  <span className="flex items-center gap-1 text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full animate-bounce">
                    <AlertOctagon className="w-3 h-3" />
                    <span>עומס קריטי בכניסה</span>
                  </span>
                )}
              </h4>
              <p className="text-xs text-gray-300">קצב סריקה: {gate.scansPerMinute} סריקות בדקה</p>
            </div>

            <div className="text-left">
              <span className="text-xs font-mono font-bold block">{gate.status.toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
