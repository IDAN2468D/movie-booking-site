import { GENRE_MAP } from '../tmdb';

export interface ColorPalette {
  primary: string;
  secondary: string;
  glow: string;
}

const PALETTES: Record<number, ColorPalette> = {
  28: { primary: '#FF1F44', secondary: '#FF5733', glow: 'rgba(255, 31, 68, 0.15)' }, // Action
  12: { primary: '#2ECC71', secondary: '#27AE60', glow: 'rgba(46, 204, 113, 0.15)' }, // Adventure
  16: { primary: '#9B59B6', secondary: '#8E44AD', glow: 'rgba(155, 89, 182, 0.15)' }, // Animation
  35: { primary: '#F1C40F', secondary: '#F39C12', glow: 'rgba(241, 196, 15, 0.15)' }, // Comedy
  80: { primary: '#34495E', secondary: '#2C3E50', glow: 'rgba(52, 73, 94, 0.15)' }, // Crime
  18: { primary: '#E74C3C', secondary: '#C0392B', glow: 'rgba(231, 76, 60, 0.15)' }, // Drama
  878: { primary: '#00D1FF', secondary: '#7000FF', glow: 'rgba(0, 209, 255, 0.15)' }, // Sci-Fi
  27: { primary: '#800000', secondary: '#4A0000', glow: 'rgba(128, 0, 0, 0.15)' }, // Horror
  10749: { primary: '#E91E63', secondary: '#C2185B', glow: 'rgba(233, 30, 99, 0.15)' }, // Romance
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
