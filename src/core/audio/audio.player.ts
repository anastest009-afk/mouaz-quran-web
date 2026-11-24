import { TimingMathEngine } from '../math/timing.math';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'completed' | 'error';

export interface PlayerState {
  status: PlaybackStatus;
  positionMs: number;
  durationMs: number;
  fraction: number;
}

export class AudioPlayerService {
  private audio = new Audio();
  private stateListener: ((state: PlayerState) => void) | null = null;
  private animFrameId: number | null = null;

  private handlePlaying = () => this.updateStatus('playing');
  private handlePause = () => this.updateStatus('paused');
  private handleEnded = () => {
    this.cancelTicker();
    this.updateStatus('completed');
  };
  private handleError = () => {
    this.cancelTicker();
    this.updateStatus('error');
  };

  constructor() {
    this.audio.preload = 'auto';
    this.audio.addEventListener('playing', this.handlePlaying);
    this.audio.addEventListener('pause', this.handlePause);
    this.audio.addEventListener('ended', this.handleEnded);
    this.audio.addEventListener('error', this.handleError);
  }

  onStateChange(cb: ((state: PlayerState) => void) | null): void {
    this.stateListener = cb;
  }

  async playUrl(url: string): Promise<void> {
    try {
      this.audio.src = url;
      this.updateStatus('loading');
      await this.audio.play();
      this.startTicker();
    } catch {
      this.updateStatus('error');
    }
  }

  pause(): void {
    this.audio.pause();
    this.cancelTicker();
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.cancelTicker();
    this.updateStatus('idle');
  }

  setSpeed(rate: number): void {
    this.audio.playbackRate = Math.max(0.5, Math.min(2.0, rate));
  }

  destroy(): void {
    this.stop();
    this.stateListener = null;
    this.audio.removeEventListener('playing', this.handlePlaying);
    this.audio.removeEventListener('pause', this.handlePause);
    this.audio.removeEventListener('ended', this.handleEnded);
    this.audio.removeEventListener('error', this.handleError);
    this.audio.src = '';
  }

  private startTicker(): void {
    this.cancelTicker();
    const tick = () => {
      const pos = Math.round(this.audio.currentTime * 1000);
      const dur = Math.round((this.audio.duration || 0) * 1000);
      const fraction = TimingMathEngine.calculateProgressFraction(pos, dur);

      if (this.stateListener) {
        this.stateListener({ status: 'playing', positionMs: pos, durationMs: dur, fraction });
      }
      this.animFrameId = requestAnimationFrame(tick);
    };
    this.animFrameId = requestAnimationFrame(tick);
  }

  private cancelTicker(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private updateStatus(status: PlaybackStatus): void {
    if (this.stateListener) {
      const pos = Math.round(this.audio.currentTime * 1000);
      const dur = Math.round((this.audio.duration || 0) * 1000);
      const fraction = TimingMathEngine.calculateProgressFraction(pos, dur);
      this.stateListener({ status, positionMs: pos, durationMs: dur, fraction });
    }
  }
}
