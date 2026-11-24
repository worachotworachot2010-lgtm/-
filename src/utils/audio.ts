class LoyKrathongAudio {
  private ctx: AudioContext | null = null;
  private ambientInterval: number | null = null;
  private ambientActive = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  playChime(freq = 587.33) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.015, now + 0.35);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.48);
  }

  playFloatSplash() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    // Pentatonic gentle temple chime chord (D5, F#5, A5, D6)
    const notes = [587.33, 739.99, 880, 1174.66];
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.15);
    });
  }

  playBless() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const notes = [659.25, 987.77];
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.075, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    });
  }

  toggleAmbient(): boolean {
    if (this.ambientActive) {
      this.stopAmbient();
      return false;
    }
    const ctx = this.ensureContext();
    if (!ctx) return false;

    this.ambientActive = true;
    const pentatonic = [293.66, 329.63, 392.0, 440.0, 523.25, 587.33];
    const playSoftNote = () => {
      if (!this.ambientActive || !this.ctx) return;
      const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0005, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 2.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 2.9);
    };

    playSoftNote();
    this.ambientInterval = window.setInterval(playSoftNote, 2400);
    return true;
  }

  stopAmbient() {
    this.ambientActive = false;
    if (this.ambientInterval !== null) {
      window.clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }
}

export const soundManager = new LoyKrathongAudio();
