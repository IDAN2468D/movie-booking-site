let audioCtx: AudioContext | null = null;

export const playShatterEffect = async () => {
  if (typeof window === 'undefined') return;
  try {
    if (!audioCtx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    
    // Ensure the audio context is resumed (browsers suspend it if not initiated by a user gesture)
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    // Glass Shattering Synth (White Noise + Highpass Filter + Sharp Envelope)
    const bufferSize = audioCtx.sampleRate * 0.4; // 0.4 seconds of noise
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill with white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter to make it sound like glass (high frequencies, sharp)
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 6000;
    
    // Envelope for sharp impact and quick decay
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.01); // ultra sharp attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3); // quick decay
    
    // Connect noise to output
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    noiseSource.start(audioCtx.currentTime);

    // Add a high-pitched metallic "ping" transient for the breaking glass shards
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(8000, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(4000, audioCtx.currentTime + 0.1);
    
    const oscGain = audioCtx.createGain();
    oscGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.2);

  } catch (error) {
    console.error("Audio Context Error:", error);
  }
};
