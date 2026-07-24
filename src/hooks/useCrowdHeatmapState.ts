import { create } from 'zustand';
import { CrowdZone } from '../lib/validations/crowd-heatmap.schema';

interface CrowdHeatmapState {
  zones: CrowdZone[];
  activeZoneId: string | null;
  heatmapOpacity: number;
  hoveredSeat: { x: number; y: number } | null;
  setZones: (zones: CrowdZone[]) => void;
  setActiveZoneId: (zoneId: string | null) => void;
  setHeatmapOpacity: (opacity: number) => void;
  setHoveredSeat: (seat: { x: number; y: number } | null) => void;
}

export const useCrowdHeatmapState = create<CrowdHeatmapState>((set) => ({
  zones: [],
  activeZoneId: null,
  heatmapOpacity: 0.85,
  hoveredSeat: null,
  setZones: (zones) => set({ zones }),
  setActiveZoneId: (activeZoneId) => set({ activeZoneId }),
  setHeatmapOpacity: (heatmapOpacity) => set({ heatmapOpacity }),
  setHoveredSeat: (hoveredSeat) => set({ hoveredSeat }),
}));
