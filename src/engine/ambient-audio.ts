/** Quiet river-like ambience generated locally. Never starts without a user gesture. */
export class AmbientAudio {
  private context: AudioContext | null = null;
  private gain: GainNode | null = null;
  private source: AudioBufferSourceNode | null = null;
  enabled = false;

  async setEnabled(enabled: boolean) {
    if (enabled && !this.context) {
      const context = new AudioContext();
      this.context = context;
      const buffer = context.createBuffer(1, context.sampleRate * 6, context.sampleRate);
      const samples = buffer.getChannelData(0);
      let previous = 0;
      for (let i = 0; i < samples.length; i++) {
        previous = (previous + (Math.random() * 2 - 1) * 0.02) / 1.02;
        samples[i] = previous * 3;
      }
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 850;
      this.gain = context.createGain();
      this.gain.gain.value = 0;
      source.connect(filter).connect(this.gain).connect(context.destination);
      source.start();
      this.source = source;
    }
    if (enabled && !document.hidden) await this.context?.resume();
    this.gain?.gain.setTargetAtTime(enabled ? 0.16 : 0, this.context!.currentTime, 0.15);
    this.enabled = enabled;
    if (!enabled) await this.context?.suspend();
  }

  async syncVisibility() {
    if (!this.context) return;
    if (document.hidden || !this.enabled) await this.context.suspend();
    else await this.context.resume();
  }

  dispose() {
    this.source?.stop();
    void this.context?.close();
  }
}
