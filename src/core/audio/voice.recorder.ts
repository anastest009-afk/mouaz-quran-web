import { audioCtxManager } from './audio.context';
import { AcousticMathEngine } from '../math/acoustic.math';

export type RecorderErrorType = 'permission_denied' | 'not_found' | 'unsupported';

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
  private errorListener: ((error: RecorderErrorType) => void) | null = null;
  private lastBlobUrl: string | null = null;

  async start(): Promise<boolean> {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      this.errorListener?.('unsupported');
      return false;
    }

    try {
      this.recordedChunks = [];
      if (this.lastBlobUrl) {
        URL.revokeObjectURL(this.lastBlobUrl);
        this.lastBlobUrl = null;
      }

      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = await audioCtxManager.ensureResumed();
      const source = ctx.createMediaStreamSource(this.stream);
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const mimeType = this.detectMimeType();
      this.mediaRecorder = mimeType
        ? new MediaRecorder(this.stream, { mimeType })
        : new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };

      this.mediaRecorder.start(100);
      this.startPolling();
      return true;
    } catch (err) {
      const name = (err as { name?: string })?.name || '';
      const errType: RecorderErrorType =
        name === 'NotFoundError' ? 'not_found' : 'permission_denied';
      this.errorListener?.(errType);
      this.cleanup();
      return false;
    }
  }

  async stop(): Promise<string | null> {
    return new Promise((resolve) => {
      this.stopPolling();
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.cleanup();
        resolve(null);
        return;
      }

      const mime = this.mediaRecorder.mimeType || 'audio/webm';
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: mime });
        this.lastBlobUrl = URL.createObjectURL(blob);
        this.cleanup();
        this.listener?.({
          isRecording: false,
          decibels: -60,
          amplitudes: [],
          recordedAudioUrl: this.lastBlobUrl,
        });
        resolve(this.lastBlobUrl);
      };

      this.mediaRecorder.stop();
    });
  }

  onStateChange(cb: ((state: RecorderState) => void) | null): void {
    this.listener = cb;
  }

  onError(cb: ((error: RecorderErrorType) => void) | null): void {
    this.errorListener = cb;
  }

  destroy(): void {
    this.stopPolling();
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {
        // Ignore stop errors during unmount
      }
    }
    this.cleanup();
    if (this.lastBlobUrl) {
      URL.revokeObjectURL(this.lastBlobUrl);
      this.lastBlobUrl = null;
    }
    this.listener = null;
    this.errorListener = null;
  }

  private detectMimeType(): string | undefined {
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
    return candidates.find((type) => MediaRecorder.isTypeSupported(type));
  }

  private startPolling(): void {
    const buffer = new Uint8Array(this.analyser?.frequencyBinCount || 32);
    const poll = () => {
      if (!this.analyser) return;
      this.analyser.getByteFrequencyData(buffer);

      let sumSquares = 0;
      const normalizedAmps: number[] = [];
      for (let i = 0; i < buffer.length; i += 1) {
        const norm = buffer[i] / 255.0;
        normalizedAmps.push(norm);
        sumSquares += norm * norm;
      }

      const rms = Math.sqrt(sumSquares / buffer.length);
      const db = AcousticMathEngine.calculateDecibels(rms);

      this.listener?.({
        isRecording: true,
        decibels: db,
        amplitudes: normalizedAmps,
        recordedAudioUrl: null,
      });
      this.animId = requestAnimationFrame(poll);
    };
    this.animId = requestAnimationFrame(poll);
  }

  private stopPolling(): void {
    if (this.animId !== null) cancelAnimationFrame(this.animId);
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
