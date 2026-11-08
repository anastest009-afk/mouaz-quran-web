export abstract class ProgressMathEngine {
  static calculateProgressRatio(completed: number, total: number): number {
    if (total <= 0 || completed <= 0) return 0.0;
    return Math.max(0.0, Math.min(1.0, completed / total));
  }

  static calculatePercentage(completed: number, total: number): number {
    const ratio = this.calculateProgressRatio(completed, total);
    return Math.round(ratio * 100.0);
  }

  static calculateEarnedStars(scorePercentage: number): number {
    if (scorePercentage >= 85.0) return 3;
    if (scorePercentage >= 65.0) return 2;
    if (scorePercentage >= 40.0) return 1;
    return 0;
  }

  static calculateXpReward(basePoints: number, stars: number, isFirstAttempt: boolean): number {
    let points = basePoints * stars;
    if (isFirstAttempt && stars === 3) {
      points += 50;
    }
    return points;
  }

  static calculateTreeStage(masteredCount: number, itemsPerStage = 3): number {
    if (itemsPerStage <= 0 || masteredCount <= 0) return 1;
    const stage = Math.floor(masteredCount / itemsPerStage) + 1;
    return Math.max(1, Math.min(5, stage));
  }
}
