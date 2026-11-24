class AudioContextManager {
  private static instance: AudioContextManager;
  private ctx: AudioContext | null = null;

  private constructor() {}

  static getInstance(): AudioContextManager {
    if (!this.instance) {
      this.instance = new AudioContextManager();
    }
    return this.instance;
  }

  getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  async ensureResumed(): Promise<AudioContext> {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    return ctx;
  }
}

export const audioCtxManager = AudioContextManager.getInstance();
