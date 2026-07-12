import { useEffect, useRef } from 'react';
import { useHapticSetTension, useHapticSetOffsets, useHapticSetIsResonating, useHapticTension } from '@/lib/store/hapticStore';

export function useProximityHaptics(targetRef?: React.RefObject<HTMLElement | null>) {
  const setTension = useHapticSetTension();
  const setOffsets = useHapticSetOffsets();
  const setIsResonating = useHapticSetIsResonating();
  const tension = useHapticTension();
  const shakeFrameRef = useRef<number | null>(null);
  
  // Kinetic shake loop based on tension
  useEffect(() => {
    if (tension > 0) {
      const shakeLoop = () => {
        // High tension = strong, fast shake. Low tension = subtle wobble
        const intensity = tension * 8; // max 8px offset
        const x = (Math.random() - 0.5) * intensity;
        const y = (Math.random() - 0.5) * intensity;
        setOffsets(x, y);
        
        if (targetRef && targetRef.current) {
          targetRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          targetRef.current.style.willChange = 'transform';
        }
        
        shakeFrameRef.current = requestAnimationFrame(shakeLoop);
      };
      shakeFrameRef.current = requestAnimationFrame(shakeLoop);
      
      // Vibrate mobile devices occasionally based on tension
      if (typeof navigator !== 'undefined' && navigator.vibrate && Math.random() > 0.8) {
        navigator.vibrate(Math.min(50, tension * 50));
      }
    } else {
      setOffsets(0, 0);
      if (targetRef && targetRef.current) {
        targetRef.current.style.transform = 'translate3d(0px, 0px, 0)';
      }
      if (shakeFrameRef.current) {
        cancelAnimationFrame(shakeFrameRef.current);
      }
    }
    
    return () => {
      if (shakeFrameRef.current) {
        cancelAnimationFrame(shakeFrameRef.current);
      }
    };
  }, [tension, setOffsets, targetRef]);

  const calculateTension = (
    bubbleCenter: { x: number; y: number },
    coreCenter: { x: number; y: number },
    radiusThreshold: number
  ) => {
    const dx = bubbleCenter.x - coreCenter.x;
    const dy = bubbleCenter.y - coreCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > radiusThreshold) {
      setTension(0);
      setIsResonating(false);
      return;
    }
    
    const calculatedTension = Math.max(0, 1 - distance / radiusThreshold);
    setTension(calculatedTension);
    setIsResonating(calculatedTension > 0.8);
  };

  return { calculateTension };
}
