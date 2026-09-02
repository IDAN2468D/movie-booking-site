export type WhisperChannel = 'dialogue_boost' | 'original_audio' | 'directors_commentary' | 'accessibility_described';
export type WhisperEqPreset = 'clear_voice' | 'commentary_focus' | 'night_isolation' | 'flat';

export interface WhisperTrackConfig {
  channel: WhisperChannel;
  volume: number; // 0 to 1
  latencyOffsetMs: number; // -100 to +100 ms
  eqPreset: WhisperEqPreset;
}

export class WhisperTrackEngine {
  private ctx: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private lowFilter: BiquadFilterNode | null = null;
  private midFilter: BiquadFilterNode | null = null;
  private highFilter: BiquadFilterNode | null = null;
  private isRunning: boolean = false;

  public init(): void {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    // Gain node
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.8;

    // Latency delay node (up to 500ms buffer)
    this.delayNode = this.ctx.createDelay(0.5);
    this.delayNode.delayTime.value = 0.05; // 50ms default offset

    // 3-Band Parametric EQ Filters
    this.lowFilter = this.ctx.createBiquadFilter();
    this.lowFilter.type = 'lowshelf';
    this.lowFilter.frequency.value = 250;

    this.midFilter = this.ctx.createBiquadFilter();
    this.midFilter.type = 'peaking';
    this.midFilter.frequency.value = 2500;
    this.midFilter.Q.value = 1.2;

    this.highFilter = this.ctx.createBiquadFilter();
    this.highFilter.type = 'highshelf';
    this.highFilter.frequency.value = 6000;

    // Connect node chain: Source -> Delay -> Low -> Mid -> High -> Gain -> Destination
    this.delayNode.connect(this.lowFilter);
    this.lowFilter.connect(this.midFilter);
    this.midFilter.connect(this.highFilter);
    this.highFilter.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
  }

  public setVolume(val: number): void {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(Math.max(0, Math.min(1.5, val)), this.ctx.currentTime, 0.05);
    }
  }

  public setLatencyOffset(offsetMs: number): void {
    if (this.delayNode && this.ctx) {
      const delaySeconds = Math.max(0, (offsetMs + 100) / 1000);
      this.delayNode.delayTime.setTargetAtTime(delaySeconds, this.ctx.currentTime, 0.05);
    }
  }

  public setEqPreset(preset: WhisperEqPreset): void {
    if (!this.lowFilter || !this.midFilter || !this.highFilter || !this.ctx) return;
    const t = this.ctx.currentTime;

    switch (preset) {
      case 'clear_voice': // Boost dialogue range (2.5kHz) and cut sub-rumble
        this.lowFilter.gain.setTargetAtTime(-6, t, 0.05);
        this.midFilter.gain.setTargetAtTime(+8, t, 0.05);
        this.highFilter.gain.setTargetAtTime(+3, t, 0.05);
        break;
      case 'commentary_focus': // Emphasize voice presence and warm upper-bass
        this.lowFilter.gain.setTargetAtTime(+2, t, 0.05);
        this.midFilter.gain.setTargetAtTime(+6, t, 0.05);
        this.highFilter.gain.setTargetAtTime(-2, t, 0.05);
        break;
      case 'night_isolation': // Attenuate loud sound effects and enhance quiet whispers
        this.lowFilter.gain.setTargetAtTime(-4, t, 0.05);
        this.midFilter.gain.setTargetAtTime(+5, t, 0.05);
        this.highFilter.gain.setTargetAtTime(+4, t, 0.05);
        break;
      case 'flat':
      default:
        this.lowFilter.gain.setTargetAtTime(0, t, 0.05);
        this.midFilter.gain.setTargetAtTime(0, t, 0.05);
        this.highFilter.gain.setTargetAtTime(0, t, 0.05);
        break;
    }
  }

  public startSimulation(channel: WhisperChannel): void {
    this.init();
    if (!this.ctx || !this.delayNode) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.stop();

    // Create dynamic harmonic carrier representing the stream
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    if (channel === 'dialogue_boost') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime); // A4 voice reference
      oscGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    } else if (channel === 'directors_commentary') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      oscGain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      oscGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    }

    osc.connect(oscGain);
    oscGain.connect(this.delayNode);
    osc.start();
    this.sourceNode = osc;
    this.isRunning = true;
  }

  public stop(): void {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch (e) {
        console.warn("Could not stop audio source node:", e);
      }
      this.sourceNode = null;
    }
    this.isRunning = false;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}

export const whisperEngine = typeof window !== 'undefined' ? new WhisperTrackEngine() : null;
