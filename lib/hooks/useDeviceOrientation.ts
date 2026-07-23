import { useState, useEffect, useCallback } from 'react';
import { OrientationData } from '../validations/portal-schema';

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<OrientationData>({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setIsSupported(true);
    }
  }, []);

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    setOrientation({
      alpha: e.alpha || 0,
      beta: e.beta || 0,
      gamma: e.gamma || 0,
    });
  }, []);

  const requestPermission = useCallback(async () => {
    if (
      typeof window !== 'undefined' &&
      'DeviceOrientationEvent' in window &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await (DeviceOrientationEvent as any).requestPermission();
        if (res === 'granted') {
          setHasPermission(true);
          window.addEventListener('deviceorientation', handleOrientation);
        } else {
          setHasPermission(false);
        }
      } catch {
        setHasPermission(false);
      }
    } else {
      setHasPermission(true);
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }, [handleOrientation]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [handleOrientation]);

  return { orientation, isSupported, hasPermission, requestPermission };
}
