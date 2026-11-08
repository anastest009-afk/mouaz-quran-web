export abstract class TimingMathEngine {
  static calculateProgressFraction(positionMs: number, durationMs: number): number {
    if (durationMs <= 0 || positionMs <= 0) return 0.0;
    const fraction = positionMs / durationMs;
    return Math.max(0.0, Math.min(1.0, fraction));
  }

  static formatMilliseconds(milliseconds: number): string {
    if (milliseconds <= 0) return '00:00';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minStr}:${secStr}`;
  }

  static calculateRemainingMs(positionMs: number, durationMs: number): number {
    if (durationMs <= positionMs) return 0;
    return durationMs - positionMs;
  }
}
