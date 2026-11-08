import { AudioPlayerService } from './audio.player';
import { VoiceRecorderService } from './voice.recorder';
import { AcousticMathEngine } from '../math/acoustic.math';

export type EchoState = 'idle' | 'sheikh_playing' | 'child_echo' | 'evaluating' | 'feedback';

export class EchoController {
  private player: AudioPlayerService;
  private recorder: VoiceRecorderService;
  private state: EchoState = 'idle';
  private listener: ((state: EchoState, score?: number) => void) | null = null;
  private startTime = 0;
  private targetDurationMs = 3000;

  constructor(player: AudioPlayerService, recorder: VoiceRecorderService) {
    this.player = player;
    this.recorder = recorder;
  }

  onState(cb: (state: EchoState, score?: number) => void): void {
    this.listener = cb;
  }

  async startCycle(sheikhAudioUrl: string, expectedDurationMs: number): Promise<void> {
    this.targetDurationMs = expectedDurationMs;
    this.setState('sheikh_playing');

    this.player.onStateChange(async (st) => {
      if (st.status === 'completed' && this.state === 'sheikh_playing') {
        this.setState('child_echo');
        this.startTime = Date.now();
        await this.recorder.start();

        const timeout = Math.round(this.targetDurationMs * 1.25);
        setTimeout(async () => {
          if (this.state === 'child_echo') {
            await this.finishEcho();
          }
        }, Math.max(3000, timeout));
      }
    });

    await this.player.playUrl(sheikhAudioUrl);
  }

  async finishEcho(): Promise<void> {
    this.setState('evaluating');
    await this.recorder.stop();
    const actualMs = Date.now() - this.startTime;

    const score = AcousticMathEngine.calculateRecitationScore(
      this.targetDurationMs,
      actualMs,
      -22.0
    );

    this.setState('feedback', score);
  }

  stop(): void {
    this.player.stop();
    this.recorder.stop();
    this.setState('idle');
  }

  private setState(newState: EchoState, score?: number): void {
    this.state = newState;
    if (this.listener) this.listener(newState, score);
  }
}
