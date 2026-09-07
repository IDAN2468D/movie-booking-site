'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useERPStore } from '@/lib/store/useERPStore';
import { ERPTopBarAnchor } from '@/components/erp/cockpit/ERPTopBarAnchor';
import { ERPOmniBox } from '@/components/erp/cockpit/ERPOmniBox';
import { ERPMarketWaveCard } from '@/components/erp/cockpit/ERPMarketWaveCard';
import { ERPLiquidityStream } from '@/components/erp/cockpit/ERPLiquidityStream';
import { ERPSecurityRadar } from '@/components/erp/cockpit/ERPSecurityRadar';
import { YieldOptimizationDashboard } from '@/components/erp/YieldOptimizationDashboard';

export default function ErpDashboard() {
  const { stats } = useERPStore();
  const [currency, setCurrency] = useState<'ILS' | 'USD'>('ILS');
  const [taxRate, setTaxRate] = useState<number>(17);

  const grossRevenue = stats?.totalRevenue || 184200;

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-7" dir="rtl">
      {/* 1. Global Currency & Tax Anchor Header */}
      <ERPTopBarAnchor
        currency={currency}
        onCurrencyChange={setCurrency}
        taxRate={taxRate}
        onTaxRateChange={setTaxRate}
      />

      {/* 2. Central AI Command Node (Omni-Box) */}
      <ERPOmniBox />

      {/* 3. 120Hz GPU Market Wave Sparkline Cards */}
      <ERPMarketWaveCard />

      {/* 4. Core Bento Grid: Liquidity Stream & Anomalous Intent Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch">
        <div className="lg:col-span-2">
          <ERPLiquidityStream
            grossRevenue={grossRevenue}
            taxRate={taxRate}
            currency={currency}
            activeCartsCount={stats?.ticketsSold ? Math.min(stats.ticketsSold, 84) : 68}
            pendingCartsValue={18450}
          />
        </div>
        <div className="lg:col-span-1">
          <ERPSecurityRadar />
        </div>
      </div>

      {/* 5. AI Dynamic Pricing & Yield Optimization Module */}
      <div className="pt-2">
        <YieldOptimizationDashboard />
      </div>
    </div>
  );
}
