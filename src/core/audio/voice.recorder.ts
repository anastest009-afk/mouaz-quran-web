import { audioCtxManager } from './audio.context';
import { AcousticMathEngine } from '../math/acoustic.math';

export interface RecorderState {
  isRecording: boolean;
  decibels: number;
  amplitudes: number[];
  recordedAudioUrl: string | null;
}

export class VoiceRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private recordedChunks: Blob[] = [];
  private animId: number | null = null;
  private listener: ((state: RecorderState) => void) | null = null;
  private lastBlobUrl: string | null = null;

  async start(): Promise<boolean> {
    try {
      this.recordedChunks = [];
      if (this.lastBlobUrl) {
        URL.revokeObjectURL(this.lastBlobUrl);
        this.lastBlobUrl = null;
      }

      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = audioCtxManager.getContext();
      const source = ctx.createMediaStreamSource(this.stream);
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };

      this.mediaRecorder.start(100);
      this.startPolling();
      return true;
    } catch {
      return false;
    }
  }

  async stop(): Promise<string | null> {
    return new Promise((resolve) => {
      this.stopPolling();
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        this.lastBlobUrl = URL.createObjectURL(blob);
        this.cleanup();
        if (this.listener) {
          this.listener({
            isRecording: false,
            decibels: -60,
            amplitudes: [],
            recordedAudioUrl: this.lastBlobUrl,
          });
        }
        resolve(this.lastBlobUrl);
      };

      this.mediaRecorder.stop();
    });
  }

  onStateChange(cb: (state: RecorderState) => void): void {
    this.listener = cb;
  }

  private startPolling(): void {
    const buffer = new Uint8Array(this.analyser?.frequencyBinCount || 32);
    const poll = () => {
      if (!this.analyser) return;
      this.analyser.getByteFrequencyData(buffer);

      let sumSquares = 0;
      const normalizedAmps: number[] = [];
      for (let i = 0; i < buffer.length; i++) {
        const norm = buffer[i] / 255.0;
        normalizedAmps.push(norm);
        sumSquares += norm * norm;
      }

      const rms = Math.sqrt(sumSquares / buffer.length);
      const db = AcousticMathEngine.calculateDecibels(rms);

      if (this.listener) {
        this.listener({
          isRecording: true,
          decibels: db,
          amplitudes: normalizedAmps,
          recordedAudioUrl: null,
        });
      }
      this.animId = requestAnimationFrame(poll);
    };
    this.animId = requestAnimationFrame(poll);
  }

  private stopPolling(): void {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.animId = null;
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    this.analyser = null;
    this.mediaRecorder = null;
  }
}
