import { useEffect } from 'react';
import { useThemeStore } from './useThemeStore';

export function useEnvironmentalTheme() {
  const { setEnvironmentalGradient } = useThemeStore();

  useEffect(() => {
    const updateEnvironment = () => {
      const hour = new Date().getHours();
      let gradient = '';

      if (hour >= 5 && hour < 12) {
        // Dawn / Morning: Warm sunrise tones
        gradient = 'radial-gradient(circle at top right, rgba(255, 150, 50, 0.15), transparent 60%)';
      } else if (hour >= 12 && hour < 18) {
        // Day: Bright, energetic
        gradient = 'radial-gradient(circle at center, rgba(100, 200, 255, 0.1), transparent 70%)';
      } else if (hour >= 18 && hour < 21) {
        // Dusk / Evening: Deep purples and oranges
        gradient = 'radial-gradient(circle at top left, rgba(150, 50, 255, 0.15), rgba(255, 80, 80, 0.1) 40%, transparent 80%)';
      } else {
        // Night: Deep cinematic blues and OLED blacks
        gradient = 'radial-gradient(circle at bottom right, rgba(20, 40, 100, 0.2), transparent 50%), radial-gradient(circle at top left, rgba(10, 10, 30, 0.8), transparent 70%)';
      }

      setEnvironmentalGradient(gradient);
    };

    updateEnvironment();
    const interval = setInterval(updateEnvironment, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [setEnvironmentalGradient]);
}
