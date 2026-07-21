import { useState, useCallback } from 'react';
import { playSubBassPulse } from '@/lib/utils/acoustics/subBassPulse';
import { HapticPulseConfig } from '@/lib/validations/hapticPulseSchema';

export const useSubBassPulse = () => {
  const [isActive, setIsActive] = useState(false);

  const triggerPulse = useCallback((config?: Partial<HapticPulseConfig>) => {
    // Start visualizer state
    setIsActive(true);
    
    // Trigger acoustic and haptic feedback
    playSubBassPulse(config);
    
    // Determine timeout based on config duration or default
    const duration = config?.duration || 300;
    
    // End visualizer state after duration
    setTimeout(() => {
      setIsActive(false);
    }, duration);
  }, []);

  return { isActive, triggerPulse };
};
