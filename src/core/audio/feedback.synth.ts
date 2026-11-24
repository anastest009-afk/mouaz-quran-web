import { audioCtxManager } from './audio.context';

export class FeedbackSynth {
  private static lastErrorTimestamp = 0;

  static playErrorChime(enabled = true, cooldownMs = 1500): void {
    if (!enabled) return;
    const nowMs = Date.now();
    if (nowMs - this.lastErrorTimestamp < cooldownMs) return;
    this.lastErrorTimestamp = nowMs;

    try {
      const ctx = audioCtxManager.getContext();
      const now = ctx.currentTime;
      this.scheduleTone(ctx, 349.23, 277.18, now, 0.24, 0.13, 'triangle');
      this.scheduleTone(ctx, 277.18, 220.0, now + 0.14, 0.26, 0.11, 'sine');
    } catch {
      // Ignore audio hardware restriction
    }
  }

  static playSuccessChime(enabled = true): void {
    if (!enabled) return;
    try {
      const ctx = audioCtxManager.getContext();
      const now = ctx.currentTime;
      this.scheduleTone(ctx, 523.25, 587.33, now, 0.16, 0.08, 'sine');
      this.scheduleTone(ctx, 659.25, 783.99, now + 0.11, 0.22, 0.09, 'sine');
    } catch {
      // Ignore audio hardware restriction
    }
  }

  static playRevealTick(enabled = true): void {
    if (!enabled) return;
    try {
      const ctx = audioCtxManager.getContext();
      const now = ctx.currentTime;
      this.scheduleTone(ctx, 587.33, 659.25, now, 0.12, 0.05, 'sine');
    } catch {
      // Ignore audio hardware restriction
    }
  }

  static resetCooldown(): void {
    this.lastErrorTimestamp = 0;
  }

  private static scheduleTone(
    ctx: AudioContext,
    startFreq: number,
    endFreq: number,
    startTime: number,
    durationSec: number,
    peakGain: number,
    type: OscillatorType
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), startTime + durationSec);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0008, startTime + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + durationSec + 0.02);
  }
}
