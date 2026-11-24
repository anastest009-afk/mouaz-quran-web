import { distance } from 'fastest-levenshtein';

export interface RecitationMatchResult {
  matchedCount: number;
  totalTargetWords: number;
  coverageRatio: number;
  isAyahComplete: boolean;
  hasMismatch: boolean;
}

export abstract class ArabicNormalizer {
  private static readonly tashkeelRe = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;
  private static readonly nonArabicRe = /[^\u0621-\u064A\s]/g;

  static stripTashkeel(text: string): string {
    return (text || '').replace(this.tashkeelRe, '');
  }

  static normalizeArabic(text: string): string {
    return this.stripTashkeel(text)
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(this.nonArabicRe, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  static splitWords(text: string): string[] {
    const clean = this.normalizeArabic(text);
    return clean ? clean.split(' ') : [];
  }

  static wordSimilarity(a: string, b: string): number {
    const na = this.normalizeArabic(a);
    const nb = this.normalizeArabic(b);
    if (!na && !nb) return 1.0;
    if (!na || !nb) return 0.0;
    if (na === nb) return 1.0;
    const maxLen = Math.max(na.length, nb.length);
    return Math.max(0.0, 1.0 - distance(na, nb) / maxLen);
  }

  static evaluateRecitationMatch(
    spokenTranscript: string,
    targetSimpleText: string,
    hasFinalSegment: boolean
  ): RecitationMatchResult {
    const targetWords = this.splitWords(targetSimpleText);
    const spokenWords = this.splitWords(spokenTranscript);

    if (targetWords.length === 0) {
      return { matchedCount: 0, totalTargetWords: 0, coverageRatio: 0, isAyahComplete: false, hasMismatch: false };
    }
    if (spokenWords.length === 0) {
      return { matchedCount: 0, totalTargetWords: targetWords.length, coverageRatio: 0, isAyahComplete: false, hasMismatch: false };
    }

    let targetIdx = 0;
    let unmatchedSpokenCount = 0;

    for (let i = 0; i < spokenWords.length && targetIdx < targetWords.length; i += 1) {
      const spoken = spokenWords[i];
      const expected = targetWords[targetIdx];
      const threshold = expected.length <= 2 ? 0.78 : 0.66;

      if (this.wordSimilarity(spoken, expected) >= threshold) {
        targetIdx += 1;
        unmatchedSpokenCount = 0;
        continue;
      }

      if (i + 1 < spokenWords.length) {
        const mergedSpoken = `${spoken}${spokenWords[i + 1]}`;
        if (this.wordSimilarity(mergedSpoken, expected) >= 0.72) {
          targetIdx += 1;
          i += 1;
          unmatchedSpokenCount = 0;
          continue;
        }
      }

      if (targetIdx + 1 < targetWords.length) {
        const mergedTarget = `${expected}${targetWords[targetIdx + 1]}`;
        if (this.wordSimilarity(spoken, mergedTarget) >= 0.74) {
          targetIdx += 2;
          unmatchedSpokenCount = 0;
          continue;
        }
        if (this.wordSimilarity(spoken, targetWords[targetIdx + 1]) >= 0.78) {
          targetIdx += 2;
          unmatchedSpokenCount = 0;
          continue;
        }
      }

      if (spoken.length >= 3) {
        const windowStart = Math.max(0, targetIdx - 2);
        const windowEnd = Math.min(targetWords.length, targetIdx + 3);
        const matchesNearby = targetWords
          .slice(windowStart, windowEnd)
          .some((w) => this.wordSimilarity(spoken, w) >= 0.72);
        if (!matchesNearby) {
          unmatchedSpokenCount += 1;
        }
      }
    }

    const coverageRatio = targetIdx / targetWords.length;
    const isAyahComplete =
      targetIdx >= targetWords.length ||
      (coverageRatio >= 0.72 && targetWords.length >= 3 && this.matchesEnding(spokenWords, targetWords));

    const hasMismatch = !isAyahComplete && hasFinalSegment && unmatchedSpokenCount >= 1;

    return {
      matchedCount: targetIdx,
      totalTargetWords: targetWords.length,
      coverageRatio,
      isAyahComplete,
      hasMismatch,
    };
  }

  static isSingleVerseMatch(spokenTranscript: string, targetSimpleText: string): { isMatch: boolean; score: number } {
    const res = this.evaluateRecitationMatch(spokenTranscript, targetSimpleText, true);
    const score = Math.round(res.coverageRatio * 100);
    return {
      isMatch: res.isAyahComplete || res.coverageRatio >= 0.65,
      score,
    };
  }

  private static matchesEnding(spokenWords: string[], targetWords: string[]): boolean {
    const lastTarget = targetWords[targetWords.length - 1];
    const tail = spokenWords.slice(-3);
    return tail.some((w) => this.wordSimilarity(w, lastTarget) >= 0.7);
  }
}
