export class AmbientAudio {
  constructor() { this.context = null; this.nodes = []; }

  async play(type, volume = 0.25) {
    this.stop();
    if (type === 'off') return;
    const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContextClass) return;
    this.context = new AudioContextClass();
    try { await this.context.resume(); }
    catch { this.stop(); return; }
    const length = this.context.sampleRate * 3;
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    let brown = 0;
    for (let index = 0; index < length; index += 1) {
      const white = Math.random() * 2 - 1;
      brown = (brown + 0.02 * white) / 1.02;
      data[index] = type === 'brown' ? brown * 3.5 : type === 'fire' ? (Math.random() > 0.995 ? white : brown * 1.7) : white * (Math.random() > 0.93 ? 0.8 : 0.22);
    }
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = this.context.createBiquadFilter();
    filter.type = type === 'rain' ? 'highpass' : 'lowpass';
    filter.frequency.value = type === 'rain' ? 900 : type === 'fire' ? 1200 : 450;
    const gain = this.context.createGain();
    gain.gain.value = Math.max(0, Math.min(1, volume));
    source.connect(filter).connect(gain).connect(this.context.destination);
    source.start();
    this.nodes = [source, filter, gain];
  }

  setVolume(volume) { const gain = this.nodes[2]; if (gain) gain.gain.setTargetAtTime(Number(volume), this.context.currentTime, 0.05); }
  stop() { this.nodes[0]?.stop(); this.nodes = []; this.context?.close(); this.context = null; }
}
