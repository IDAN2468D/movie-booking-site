import { create } from 'zustand';
import { useEffect } from 'react';

export interface CatalogMovie {
  id: string;
  title: string;
  genre: string;
  posterUrl: string;
}

interface DiscoveryState {
  movies: CatalogMovie[];
  isLoading: boolean;
  activeCategory: string | null;
  fetchCatalog: (personaVector: string[]) => Promise<void>;
  setActiveCategory: (category: string) => void;
}

export const useDiscoveryStore = create<DiscoveryState>((set) => ({
  movies: [],
  isLoading: false,
  activeCategory: null,
  fetchCatalog: async (personaVector) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/movies/semantic-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personaVector })
      });
      const data = await res.json();
      if (data.success) {
        set({ movies: data.data });
      }
    } catch (e) {
      console.error(e);
    } finally {
      set({ isLoading: false });
    }
  },
  setActiveCategory: (category) => set({ activeCategory: category }),
}));

// Hook to listen to Window events dispatched by the Concierge
export function useDiscoveryEventBridge() {
  const { setActiveCategory } = useDiscoveryStore();

  useEffect(() => {
    const handleJump = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setActiveCategory(customEvent.detail);
    };

    window.addEventListener('DiscoveryJump', handleJump);
    return () => {
      window.removeEventListener('DiscoveryJump', handleJump);
    };
  }, [setActiveCategory]);
}
