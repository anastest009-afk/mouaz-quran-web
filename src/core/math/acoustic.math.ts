export abstract class AcousticMathEngine {
  static readonly silenceThresholdDb = -45.0;
  static readonly maxDbFloor = -60.0;

  static calculateDecibels(normalizedRms: number): number {
    if (normalizedRms <= 0.0001) return this.maxDbFloor;
    const rawDb = 20.0 * (Math.log(normalizedRms) / Math.LN10);
    return Math.max(this.maxDbFloor, Math.min(0.0, rawDb));
  }

  static isVoiceActive(currentDecibels: number, threshold = this.silenceThresholdDb): boolean {
    return currentDecibels > threshold;
  }

  static calculateDurationRatio(targetMs: number, actualMs: number): number {
    if (targetMs <= 0 || actualMs <= 0) return 0.0;
    return actualMs / targetMs;
  }

  static calculateRecitationScore(targetMs: number, actualMs: number, avgDb: number): number {
    if (targetMs <= 0 || actualMs <= 0) return 0.0;
    if (!this.isVoiceActive(avgDb)) return 15.0;

    const ratio = this.calculateDurationRatio(targetMs, actualMs);
    let score = 100.0;
    if (ratio < 1.0) {
      score -= (1.0 - ratio) * 55.0;
    } else {
      score -= (ratio - 1.0) * 45.0;
    }
    return Math.max(0.0, Math.min(100.0, score));
  }

  static isPassGrade(score: number, passingThreshold = 65.0): boolean {
    return score >= passingThreshold;
  }
}
