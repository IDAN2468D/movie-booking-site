import { create } from 'zustand';
import { ScreenplayResult } from '../lib/validations/screenplay-branch.schema';

interface ScreenplayBranchState {
  promptText: string;
  selectedBranchId: string | null;
  result: ScreenplayResult | null;
  isLoading: boolean;
  setPromptText: (prompt: string) => void;
  setSelectedBranchId: (id: string | null) => void;
  setResult: (res: ScreenplayResult | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useScreenplayBranchState = create<ScreenplayBranchState>((set) => ({
  promptText: 'What if the protagonist chose the red portal?',
  selectedBranchId: null,
  result: {
    currentNodeTitle: 'Quantum Branch: Red Portal Divergence',
    storySnippet: 'The portal destabilizes, reflecting alternative reality nodes across the acoustic soundscape.',
    options: [
      {
        id: 'branch-cyberpunk',
        title: 'Neon Cyberpunk Heist Climax',
        description: 'The protagonist hacks the digital grid, altering the final outcome.',
        tone: 'Futuristic High-Octane',
        probabilityScore: 88,
      },
      {
        id: 'branch-noir',
        title: 'Shadow Noir Detective Twist',
        description: 'A hidden informant betrays the syndicate in a rainy rooftop standoff.',
        tone: 'Dark Melancholic Noir',
        probabilityScore: 92,
      },
    ],
  },
  isLoading: false,
  setPromptText: (promptText) => set({ promptText }),
  setSelectedBranchId: (selectedBranchId) => set({ selectedBranchId }),
  setResult: (result) => set({ result }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
