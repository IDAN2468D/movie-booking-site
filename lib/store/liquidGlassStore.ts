import { create } from 'zustand';
import { SnackTrayItem } from '../validations/liquidGlass';

interface LiquidGlassState {
  // Feature 1: Volumetric Film-Grain
  isFilmGrainActive: boolean;
  setFilmGrainActive: (active: boolean) => void;
  
  // Feature 2: Post-Purchase Ticket Shatter Simulator
  isTicketShattered: boolean;
  setTicketShattered: (shattered: boolean) => void;
  
  // Feature 3: Dynamic Interactive Snack Tray Canvas
  snackItems: SnackTrayItem[];
  addSnackItem: (item: SnackTrayItem) => void;
  updateSnackPosition: (id: string, x: number, y: number, isPlaced: boolean, seatTargetId?: string) => void;
  
  // Feature 4: Chrono-Refractive Archival Reel
  chronoScrollProgress: number;
  setChronoScrollProgress: (progress: number) => void;
  
  // Feature 5: Biometric Specular Intensity Map
  activeIntensityGenre: string | null;
  setActiveIntensityGenre: (genre: string | null) => void;
  
  // Feature 6: Specular Holographic Ticket Shard-Fusion
  fusionShardsActive: boolean;
  setFusionShardsActive: (active: boolean) => void;
  fusionOriginSeat: string | null;
  setFusionOriginSeat: (seatId: string | null) => void;
}

export const useLiquidGlassStore = create<LiquidGlassState>((set) => ({
  isFilmGrainActive: true,
  setFilmGrainActive: (active) => set({ isFilmGrainActive: active }),
  
  isTicketShattered: false,
  setTicketShattered: (shattered) => set({ isTicketShattered: shattered }),
  
  snackItems: [],
  addSnackItem: (item) => set((state) => ({ snackItems: [...state.snackItems, item] })),
  updateSnackPosition: (id, x, y, isPlaced, seatTargetId) => set((state) => ({
    snackItems: state.snackItems.map((item) => 
      item.id === id ? { ...item, x, y, isPlaced, seatTargetId } : item
    )
  })),
  
  chronoScrollProgress: 0,
  setChronoScrollProgress: (progress) => set({ chronoScrollProgress: progress }),
  
  activeIntensityGenre: null,
  setActiveIntensityGenre: (genre) => set({ activeIntensityGenre: genre }),
  
  fusionShardsActive: false,
  setFusionShardsActive: (active) => set({ fusionShardsActive: active }),
  
  fusionOriginSeat: null,
  setFusionOriginSeat: (seatId) => set({ fusionOriginSeat: seatId }),
}));
