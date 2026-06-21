import { GENRE_MAP } from '../tmdb';

export interface ColorPalette {
  primary: string;
  secondary: string;
  glow: string;
}

const PALETTES: Record<number, ColorPalette> = {
  28: { primary: '#FF1464', secondary: '#990033', glow: 'rgba(255, 20, 100, 0.2)' }, // Action
  12: { primary: '#2ECC71', secondary: '#27AE60', glow: 'rgba(46, 204, 113, 0.15)' }, // Adventure
  16: { primary: '#9B59B6', secondary: '#8E44AD', glow: 'rgba(155, 89, 182, 0.15)' }, // Animation
  35: { primary: '#A855F7', secondary: '#7000D9', glow: 'rgba(168, 85, 247, 0.2)' }, // Comedy
  80: { primary: '#34495E', secondary: '#2C3E50', glow: 'rgba(52, 73, 94, 0.15)' }, // Crime
  18: { primary: '#FF9F0A', secondary: '#FF7700', glow: 'rgba(255, 159, 10, 0.2)' }, // Drama
  878: { primary: '#0AEFFF', secondary: '#0055FF', glow: 'rgba(10, 239, 255, 0.2)' }, // Sci-Fi
  27: { primary: '#10B981', secondary: '#047857', glow: 'rgba(16, 185, 129, 0.2)' }, // Horror
  53: { primary: '#10B981', secondary: '#047857', glow: 'rgba(16, 185, 129, 0.2)' }, // Thriller
  10749: { primary: '#EC4899', secondary: '#BE185D', glow: 'rgba(236, 72, 153, 0.2)' }, // Romance
};

const DEFAULT_PALETTE: ColorPalette = {
  primary: '#FF9F0A', // Base Orange
  secondary: '#0AEFFF', // Base Cyan
  glow: 'rgba(255, 159, 10, 0.1)',
};

export function getPaletteForMovie(genreIds: number[] = []): ColorPalette {
  if (genreIds.length === 0) return DEFAULT_PALETTE;
  
  // Find the first matching genre in our palettes
  const match = genreIds.find(id => PALETTES[id]);
  return match ? PALETTES[match] : DEFAULT_PALETTE;
}
