# Web Audio Node Specification

## Supported Nodes
- `AudioContext`
- `OscillatorNode` (Sine, Sawtooth, Triangle)
- `BiquadFilterNode` (Lowpass, Highpass, Peaking)
- `PannerNode` (panningModel: 'HRTF', distanceModel: 'inverse')
- `StereoPannerNode` (pan: -1 to 1)
- `GainNode` (with linearRampToValueAtTime smooth curves)

## Frequency Bands
- Sub-bass rumble: 35Hz - 50Hz
- Spatial root: 432Hz / 396Hz
- High cutoff roll-off: 12kHz - 18kHz
