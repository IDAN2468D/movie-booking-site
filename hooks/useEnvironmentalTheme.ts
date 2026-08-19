import { useEffect } from 'react';
import { useThemeStore } from './useThemeStore';
import { getBandForHour } from './useDayNight';

export function useEnvironmentalTheme() {
  const { setEnvironmentalGradient } = useThemeStore();

  useEffect(() => {
    const updateEnvironment = () => {
      const band = getBandForHour(new Date().getHours());
      let gradient = '';

      switch (band) {
        case 'dawn':
          // Subtle warm sunrise tones
          gradient = 'radial-gradient(circle at 80% 0%, rgba(255, 154, 60, 0.16) 0%, rgba(245, 158, 11, 0.06) 50%, transparent 80%)';
          break;
        case 'day':
          // Refined daylight sky
          gradient = 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.16) 0%, rgba(14, 165, 233, 0.06) 50%, transparent 80%)';
          break;
        case 'sunset':
          // Soft romantic dusk
          gradient = 'radial-gradient(circle at 20% 0%, rgba(236, 72, 153, 0.16) 0%, rgba(168, 85, 247, 0.06) 50%, transparent 80%)';
          break;
        case 'night':
        default:
          // Subtle cinematic nebula
          gradient = 'radial-gradient(circle at 50% 80%, rgba(99, 102, 241, 0.12) 0%, rgba(255, 20, 100, 0.05) 50%, transparent 80%)';
          break;
      }

      setEnvironmentalGradient(gradient);
    };

    updateEnvironment();
    const interval = setInterval(updateEnvironment, 60000);

    return () => clearInterval(interval);
  }, [setEnvironmentalGradient]);
}
