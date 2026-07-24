'use client';

import React, { useEffect } from 'react';
import { useCrowdHeatmapState } from '@/hooks/useCrowdHeatmapState';
import { getCrowdHeatmapAction } from '@/lib/actions/crowd-heatmap.actions';
import { CrowdHeatmapView } from './CrowdHeatmapView';

interface CrowdHeatmapContainerProps {
  showtimeId: string;
  auditoriumId: string;
}

export const CrowdHeatmapContainer: React.FC<CrowdHeatmapContainerProps> = ({
  showtimeId,
  auditoriumId,
}) => {
  const {
    zones,
    activeZoneId,
    heatmapOpacity,
    setZones,
    setActiveZoneId,
    setHoveredSeat,
  } = useCrowdHeatmapState();

  useEffect(() => {
    async function loadData() {
      const res = await getCrowdHeatmapAction({ showtimeId, auditoriumId });
      if (res.success && res.data) {
        setZones(res.data);
      }
    }
    loadData();
  }, [showtimeId, auditoriumId, setZones]);

  return (
    <CrowdHeatmapView
      zones={zones}
      activeZoneId={activeZoneId}
      opacity={heatmapOpacity}
      onZoneSelect={(id) => setActiveZoneId(id)}
      onHoverSeat={(coord) => setHoveredSeat(coord)}
    />
  );
};
