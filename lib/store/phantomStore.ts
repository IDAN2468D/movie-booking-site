import { create } from 'zustand';

export interface PeerCoordinates {
  row: number;
  col: number;
  x: number;
  y: number;
}

export interface PlaybackState {
  position: number;
  isPlaying: boolean;
}

export interface PhantomState {
  peerCoordinates: PeerCoordinates | null;
  playbackState: PlaybackState;
  setPeerCoordinates: (coords: PeerCoordinates | null) => void;
  setPlaybackState: (state: PlaybackState) => void;
}

export const usePhantomStore = create<PhantomState>((set) => ({
  peerCoordinates: null,
  playbackState: { position: 0, isPlaying: false },
  setPeerCoordinates: (peerCoordinates) => set({ peerCoordinates }),
  setPlaybackState: (playbackState) => set({ playbackState }),
}));

// Flat, atomic selectors for optimal renders
export const usePeerCoordinates = () => usePhantomStore((state) => state.peerCoordinates);
export const usePlaybackState = () => usePhantomStore((state) => state.playbackState);

export const useSetPeerCoordinates = () => usePhantomStore((state) => state.setPeerCoordinates);
export const useSetPlaybackState = () => usePhantomStore((state) => state.setPlaybackState);
