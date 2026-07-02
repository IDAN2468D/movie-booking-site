import { useEffect, useState, useRef } from 'react';
import { z } from 'zod';

const OrientationSchema = z.object({
  beta: z.number().nullable(),
  gamma: z.number().nullable(),
});

export interface GyroscopeResult {
  success: boolean;
  data?: {
    beta: number;
    gamma: number;
    smoothedBeta: number;
    smoothedGamma: number;
    gradientAngle: number;
  };
  error?: string;
  requestPermission?: () => Promise<boolean>;
}

export function useDeviceGyroscope() {
  const [coords, setCoords] = useState({ beta: 0, gamma: 0, smoothedBeta: 0, smoothedGamma: 0 });
  const [error, setError] = useState<string | undefined>(undefined);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const rawBeta = useRef<number>(0);
  const rawGamma = useRef<number>(0);
  const smoothedBeta = useRef<number>(0);
  const smoothedGamma = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const LERP_FACTOR = 0.1; // Linear interpolation factor to eliminate jitter

  useEffect(() => {
    // Detect environment permission support
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      setPermissionGranted(false);
    } else {
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      try {
        const validated = OrientationSchema.parse({
          beta: event.beta,
          gamma: event.gamma,
        });

        // beta ranges from -180 to 180, gamma ranges from -90 to 90
        rawBeta.current = validated.beta ?? 0;
        rawGamma.current = validated.gamma ?? 0;
      } catch (err) {
        console.error('Invalid gyroscope payload:', err);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    // Smooth loop
    const smoothUpdate = () => {
      smoothedBeta.current = smoothedBeta.current + (rawBeta.current - smoothedBeta.current) * LERP_FACTOR;
      smoothedGamma.current = smoothedGamma.current + (rawGamma.current - smoothedGamma.current) * LERP_FACTOR;

      setCoords({
        beta: rawBeta.current,
        gamma: rawGamma.current,
        smoothedBeta: smoothedBeta.current,
        smoothedGamma: smoothedGamma.current,
      });

      animationFrameRef.current = requestAnimationFrame(smoothUpdate);
    };

    animationFrameRef.current = requestAnimationFrame(smoothUpdate);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [permissionGranted]);

  const requestPermission = async (): Promise<boolean> => {
    const doc = window as any;
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          return true;
        } else {
          setPermissionGranted(false);
          setError('Permission denied');
          return false;
        }
      } catch (err) {
        setError('Permission request failed');
        return false;
      }
    }
    setPermissionGranted(true);
    return true;
  };

  // Convert tilt parameters to CSS gradient angle (default is 135 deg)
  // beta tilt modifies vertical, gamma tilt modifies horizontal
  const deltaX = coords.smoothedGamma;
  const deltaY = coords.smoothedBeta;
  const rad = Math.atan2(deltaY, deltaX);
  let gradientAngle = rad * (180 / Math.PI);
  if (gradientAngle < 0) gradientAngle += 360;

  // Fallback to default when no sensor activity is detected
  if (coords.smoothedGamma === 0 && coords.smoothedBeta === 0) {
    gradientAngle = 135;
  }

  return {
    success: true,
    data: {
      beta: coords.beta,
      gamma: coords.gamma,
      smoothedBeta: coords.smoothedBeta,
      smoothedGamma: coords.smoothedGamma,
      gradientAngle,
    },
    error,
    requestPermission,
  };
}
