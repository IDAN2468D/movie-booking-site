import { HarmonicConfig } from '../validations/soundtrack-schema';

class NeuralAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscs: OscillatorNode[] = [];
  private filter: BiquadFilterNode | null = null;
  private isPlaying = false;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public start(config: HarmonicConfig) {
    if (this.isPlaying) this.stop();

    const ctx = this.getAudioContext();
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 2.0);

    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(config.filterCutoff, ctx.currentTime);

    const intervals = config.scaleType === 'minor' ? [0, 3, 7, 10] : [0, 4, 7, 11];
    
    intervals.forEach((semitone, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      const freq = config.rootFreq * Math.pow(2, semitone / 12);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.25 / (i + 1);

      osc.connect(oscGain);
      if (this.filter) oscGain.connect(this.filter);
      this.oscs.push(osc);
      osc.start();
    });

    if (this.filter && this.masterGain) {
      this.filter.connect(this.masterGain);
      this.masterGain.connect(ctx.destination);
    }
    this.isPlaying = true;
  }

  public setCutoff(freq: number) {
    if (this.filter && this.ctx) {
      this.filter.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
    }
  }

  public stop() {
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    }
    setTimeout(() => {
      this.oscs.forEach((osc) => {
        try { osc.stop(); osc.disconnect(); } catch {}
      });
      this.oscs = [];
      this.isPlaying = false;
    }, 600);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const neuralAudioEngine = new NeuralAudioEngine();
