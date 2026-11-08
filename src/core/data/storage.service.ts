import { ChildProgress } from './types';

const STORAGE_KEYS = {
  PROGRESS: 'mouaz_child_progress',
  SELECTED_RECITER: 'mouaz_active_reciter',
};

export class StorageService {
  static getProgress(): Record<string, ChildProgress> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static saveAyahProgress(progress: ChildProgress): void {
    const all = this.getProgress();
    const key = `${progress.surahNumber}_${progress.ayahNumber}`;
    const existing = all[key];

    all[key] = {
      surahNumber: progress.surahNumber,
      ayahNumber: progress.ayahNumber,
      stars: Math.max(existing?.stars || 0, progress.stars),
      isMastered: (existing?.isMastered || false) || progress.isMastered,
    };

    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(all));
  }

  static getTotalStars(): number {
    const all = Object.values(this.getProgress());
    return all.reduce((sum, item) => sum + item.stars, 0);
  }

  static getMasteredCount(): number {
    const all = Object.values(this.getProgress());
    return all.filter((item) => item.isMastered).length;
  }

  static getActiveReciterId(): string {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_RECITER) || 'minshawi_teacher';
  }

  static setActiveReciterId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.SELECTED_RECITER, id);
  }
}
