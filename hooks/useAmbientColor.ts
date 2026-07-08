import { useState, useEffect } from 'react';
import { useThemeStore } from './useThemeStore';

export function useAmbientColor(imageUrl: string | null) {
  const setColors = useThemeStore((state) => state.setColors);
  const getColors = useThemeStore((state) => state.getColors);
  const setActiveColor = useThemeStore((state) => state.setActiveColor);

  useEffect(() => {
    if (!imageUrl) {
      setActiveColor('rgba(20, 20, 20, 1)', 'rgba(0, 0, 0, 0.8)', 0.1);
      return;
    }

    const cached = getColors(imageUrl);
    if (cached) {
      setActiveColor(cached.ambientColor, cached.ambientShadow, cached.luminance);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    const handleLoad = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r = 0, g = 0, b = 0;
      let count = 0;

      // Calculate average color
      for (let i = 0; i < data.length; i += 16) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      // Relative luminance formula (approximation)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      const newColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
      const newShadow = `rgba(${Math.max(0, r-30)}, ${Math.max(0, g-30)}, ${Math.max(0, b-30)}, 0.9)`;

      setColors(imageUrl, newColor, newShadow, luminance);
      setActiveColor(newColor, newShadow, luminance);
      
      // Memory cleanup
      canvas.width = 0;
      canvas.height = 0;
    };

    img.addEventListener('load', handleLoad);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.src = '';
    };
  }, [imageUrl, getColors, setColors, setActiveColor]);
}
