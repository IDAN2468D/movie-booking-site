import { create } from 'zustand';
import { CommentaryItem } from '../lib/validations/spatial-commentary.schema';

interface SpatialCommentaryState {
  currentTimestampSec: number;
  selectedPos: 'LEFT' | 'CENTER' | 'RIGHT';
  commentaries: CommentaryItem[];
  activeCommentaryId: string | null;
  isLoading: boolean;
  setCurrentTimestampSec: (ts: number) => void;
  setSelectedPos: (pos: 'LEFT' | 'CENTER' | 'RIGHT') => void;
  setCommentaries: (items: CommentaryItem[]) => void;
  setActiveCommentaryId: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useSpatialCommentaryState = create<SpatialCommentaryState>((set) => ({
  currentTimestampSec: 42,
  selectedPos: 'CENTER',
  commentaries: [
    {
      id: 'comm-1',
      timestampSec: 42,
      speakerName: "Director's Whisper (AI)",
      quote: 'Notice how the sub-bass pulse in this scene syncs with IMAX screen curvature.',
      panningValue: -0.5,
      audioBoostDb: 4.5,
    },
  ],
  activeCommentaryId: 'comm-1',
  isLoading: false,
  setCurrentTimestampSec: (currentTimestampSec) => set({ currentTimestampSec }),
  setSelectedPos: (selectedPos) => set({ selectedPos }),
  setCommentaries: (commentaries) => set({ commentaries }),
  setActiveCommentaryId: (activeCommentaryId) => set({ activeCommentaryId }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
