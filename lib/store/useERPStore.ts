import { create } from 'zustand';

interface ERPState {
  isSidebarOpen: boolean;
  activeTab: 'dashboard' | 'bookings' | 'scanner' | 'settings';
  stats: {
    totalRevenue: number;
    ticketsSold: number;
    activeMovies: number;
    occupancyRate: number;
  };
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: ERPState['activeTab']) => void;
  updateStats: (newStats: Partial<ERPState['stats']>) => void;
}

export const useERPStore = create<ERPState>((set) => ({
  isSidebarOpen: true,
  activeTab: 'dashboard',
  stats: {
    totalRevenue: 0,
    ticketsSold: 0,
    activeMovies: 0,
    occupancyRate: 0,
  },
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  updateStats: (newStats) => set((state) => ({ 
    stats: { ...state.stats, ...newStats } 
  })),
}));
