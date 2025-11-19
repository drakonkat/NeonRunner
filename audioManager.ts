
// Procedural Web Audio Synthesizer
// Generates Tron-style basslines and arps without external assets.

class AudioSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private currentTrackId: string = 'THE_GRID';
  private intervalId: number | null = null;
  private noteIndex: number = 0;

  // Synthwave Scales (Notes in Hz)
  private scales: Record<string, number[]> = {
    'THE_GRID': [65.41, 65.41, 77.78, 65.41, 58.27, 58.27, 65.41, 51.91], // C2 based
    'NEON_CHASE': [110, 130.81, 164.81, 196.00, 110, 130.81, 164.81, 220.00], // A Minor Arp
    'DATA_CORE': [43.65, 43.65, 43.65, 51.91, 38.89, 38.89, 38.89, 32.70], // Deep Bass F
    'ERROR_CODE': [87.31, 92.50, 87.31, 82.41, 73.42, 61.74, 73.42, 82.41] // Dissonant
  };

  // Tempo map
  private tempos: Record<string, number> = {
    'THE_GRID': 200,
    'NEON_CHASE': 150,
    'DATA_CORE': 400,
    'ERROR_CODE': 120
  };

  constructor() {
    // Lazy init in initialize()
  }

  public initialize() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(mute: boolean) {
    this.isMuted = mute;
    if (mute) {
      this.stop();
    } else {
      if (this.isPlaying) this.restart();
    }
  }

  public setTrack(trackId: string) {
    const prevId = this.currentTrackId;
    this.currentTrackId = trackId;
    if (this.isPlaying && prevId !== trackId) {
      this.restart();
    }
  }

  public play() {
    this.isPlaying = true;
    if (this.isMuted) return;
    this.initialize();
    this.startSequence();
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private restart() {
    this.stop();
    this.play();
  }

  private startSequence() {
    if (this.intervalId) clearInterval(this.intervalId);

    const notes = this.scales[this.currentTrackId] || this.scales['THE_GRID'];
    const speed = this.tempos[this.currentTrackId] || 200;

    this.intervalId = window.setInterval(() => {
      if (this.ctx && !this.isMuted) {
        const freq = notes[this.noteIndex % notes.length];
        this.playNote(freq);
        this.noteIndex++;
      }
    }, speed);
  }

  private playNote(freq: number) {
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Tron Sound Design: Sawtooth + LowPass Filter
    osc.type = 'sawtooth';
    osc.frequency.value = freq;

    // Filter Envelope
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, t);
    filter.frequency.exponentialRampToValueAtTime(2000, t + 0.05); // Pluck
    filter.frequency.exponentialRampToValueAtTime(200, t + 0.2);

    // Gain Envelope
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.02); // Attack
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); // Decay

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.3);

    // Add a sub-oscillator for beef
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.value = freq / 2;
    subGain.gain.setValueAtTime(0.1, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(t);
    sub.stop(t + 0.3);
  }
}

export const audioManager = new AudioSynth();
