import { useEffect, useRef, useState } from 'react';

export function useTrailerAcoustics(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const pannerRef = useRef<PannerNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    
    // We only want to initialize this once user interacts
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }

        // Connect the video element
        sourceRef.current = audioCtxRef.current.createMediaElementSource(videoRef.current!);
        
        pannerRef.current = audioCtxRef.current.createPanner();
        pannerRef.current.panningModel = 'HRTF';
        pannerRef.current.distanceModel = 'inverse';
        pannerRef.current.refDistance = 1;
        pannerRef.current.maxDistance = 10000;
        pannerRef.current.rolloffFactor = 1;
        pannerRef.current.setPosition(0, 0, 1);

        sourceRef.current.connect(pannerRef.current);
        pannerRef.current.connect(audioCtxRef.current.destination);
        setIsInitialized(true);
      }
    };

    const videoEl = videoRef.current;
    videoEl.addEventListener('play', initAudio, { once: true });

    return () => {
      videoEl.removeEventListener('play', initAudio);
      if (sourceRef.current) sourceRef.current.disconnect();
      if (pannerRef.current) pannerRef.current.disconnect();
    };
  }, [videoRef]);

  const updatePosition = (x: number, y: number, z: number = 1) => {
    if (pannerRef.current && audioCtxRef.current) {
      // Map x/y percentages (-100 to 100) to spatial coordinates
      const mappedX = (x / 100) * 10;
      const mappedY = (y / 100) * 10;
      
      // Use setPosition for broader browser compatibility or positionX.setTargetAtTime
      try {
          if (pannerRef.current.positionX) {
             pannerRef.current.positionX.setTargetAtTime(mappedX, audioCtxRef.current.currentTime, 0.1);
             pannerRef.current.positionY.setTargetAtTime(mappedY, audioCtxRef.current.currentTime, 0.1);
             pannerRef.current.positionZ.setTargetAtTime(z, audioCtxRef.current.currentTime, 0.1);
          } else {
             pannerRef.current.setPosition(mappedX, mappedY, z);
          }
      } catch(e) {
          pannerRef.current.setPosition(mappedX, mappedY, z);
      }
    }
  };

  return { updatePosition, isInitialized };
}
