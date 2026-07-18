import { create } from 'zustand';
import { useEffect } from 'react';

export interface DiscoveryMovie {
  id: string;
  title: string;
  posterUrl: string;
  genre: string;
  atmosphericProfile?: 'rain' | 'fire' | 'snow' | 'cyber' | 'none';
  audioUrl?: string;
}

interface DiscoveryState {
  movies: DiscoveryMovie[];
  isLoading: boolean;
  activeCategory: string | null;
  fetchCatalog: (personas: string[]) => Promise<void>;
  setActiveCategory: (category: string | null) => void;
}

// Mock initial data based on the genres and semantic UI expectations
const MOCK_MOVIES: DiscoveryMovie[] = [
  {
    id: '1',
    title: 'Neon Odyssey',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    genre: 'Sci-Fi Fan',
    atmosphericProfile: 'cyber',
  },
  {
    id: '2',
    title: 'Quantum Drift',
    posterUrl: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=800&q=80',
    genre: 'Sci-Fi Fan',
    atmosphericProfile: 'cyber',
  },
  {
    id: '3',
    title: 'Echoes of Rain',
    posterUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80',
    genre: 'Noir',
    atmosphericProfile: 'rain',
  }
];

export const useDiscoveryStore = create<DiscoveryState>((set) => ({
  movies: [],
  isLoading: false,
  activeCategory: null,
  fetchCatalog: async (personas) => {
    set({ isLoading: true });
    // Mock network request to fetch personalized catalog
    await new Promise(resolve => setTimeout(resolve, 800));
    set({ 
      movies: MOCK_MOVIES, 
      isLoading: false 
    });
  },
  setActiveCategory: (category) => set({ activeCategory: category }),
}));

export const useDiscoveryEventBridge = () => {
  const setActiveCategory = useDiscoveryStore((state) => state.setActiveCategory);

  useEffect(() => {
    // This event listener bridges the Neural Thought Core events to the store.
    // When an EmotionBubble drops into the core, it dispatches a custom event.
    const handleEmotionSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.category) {
        setActiveCategory(customEvent.detail.category);
      }
    };

    window.addEventListener('thought-core-emotion', handleEmotionSync);
    
    return () => {
      window.removeEventListener('thought-core-emotion', handleEmotionSync);
    };
  }, [setActiveCategory]);
};
