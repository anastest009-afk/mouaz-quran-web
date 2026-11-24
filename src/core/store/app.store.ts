import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AyahProgress } from '../data/types';
import { TarteelMode, ThemeMode } from '../tokens/theme.types';
import { StorageService } from '../data/storage.service';

export interface AppStoreState {
  progressMap: Record<string, AyahProgress>;
  activeReciterId: string;
  themeMode: ThemeMode;
  soundFeedbackEnabled: boolean;
  tarteelMode: TarteelMode;
  revealedAyahs: Record<string, boolean>;
  hintedWordsMap: Record<string, number>;

  saveAyahProgress: (progress: AyahProgress) => void;
  setActiveReciterId: (id: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  toggleSoundFeedback: () => void;
  setTarteelMode: (mode: TarteelMode) => void;
  revealAyah: (surahNumber: number, ayahNumber: number) => void;
  hideAyah: (surahNumber: number, ayahNumber: number) => void;
  revealAllInSurah: (surahNumber: number, ayahNumbers: number[]) => void;
  hideAllInSurah: (surahNumber: number, ayahNumbers: number[]) => void;
  hintNextWord: (surahNumber: number, ayahNumber: number, maxWords: number) => void;
}

const makeKey = (surah: number, ayah: number) => `${surah}_${ayah}`;

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      progressMap: StorageService.getProgress(),
      activeReciterId: StorageService.getActiveReciterId(),
      themeMode: 'light',
      soundFeedbackEnabled: true,
      tarteelMode: 'read',
      revealedAyahs: {},
      hintedWordsMap: {},

      saveAyahProgress: (progress) => {
        StorageService.saveAyahProgress(progress);
        set((state) => {
          const key = makeKey(progress.surahNumber, progress.ayahNumber);
          const existing = state.progressMap[key];
          return {
            progressMap: {
              ...state.progressMap,
              [key]: {
                surahNumber: progress.surahNumber,
                ayahNumber: progress.ayahNumber,
                stars: Math.max(existing?.stars || 0, progress.stars),
                isMastered: (existing?.isMastered || false) || progress.isMastered,
              },
            },
          };
        });
      },

      setActiveReciterId: (id) => {
        StorageService.setActiveReciterId(id);
        set({ activeReciterId: id });
      },

      setThemeMode: (mode) => set({ themeMode: mode }),

      toggleThemeMode: () =>
        set((state) => ({
          themeMode: state.themeMode === 'light' ? 'night' : 'light',
        })),

      toggleSoundFeedback: () =>
        set((state) => ({ soundFeedbackEnabled: !state.soundFeedbackEnabled })),

      setTarteelMode: (mode) => set({ tarteelMode: mode }),

      revealAyah: (surahNumber, ayahNumber) =>
        set((state) => ({
          revealedAyahs: { ...state.revealedAyahs, [makeKey(surahNumber, ayahNumber)]: true },
        })),

      hideAyah: (surahNumber, ayahNumber) =>
        set((state) => {
          const key = makeKey(surahNumber, ayahNumber);
          return {
            revealedAyahs: { ...state.revealedAyahs, [key]: false },
            hintedWordsMap: { ...state.hintedWordsMap, [key]: 0 },
          };
        }),

      revealAllInSurah: (surahNumber, ayahNumbers) =>
        set((state) => {
          const next = { ...state.revealedAyahs };
          ayahNumbers.forEach((num) => {
            next[makeKey(surahNumber, num)] = true;
          });
          return { revealedAyahs: next };
        }),

      hideAllInSurah: (surahNumber, ayahNumbers) =>
        set((state) => {
          const nextRevealed = { ...state.revealedAyahs };
          const nextHints = { ...state.hintedWordsMap };
          ayahNumbers.forEach((num) => {
            const k = makeKey(surahNumber, num);
            nextRevealed[k] = false;
            nextHints[k] = 0;
          });
          return { revealedAyahs: nextRevealed, hintedWordsMap: nextHints };
        }),

      hintNextWord: (surahNumber, ayahNumber, maxWords) =>
        set((state) => {
          const k = makeKey(surahNumber, ayahNumber);
          const cur = state.hintedWordsMap[k] || 0;
          const nextVal = Math.min(maxWords, cur + 1);
          return {
            hintedWordsMap: { ...state.hintedWordsMap, [k]: nextVal },
          };
        }),
    }),
    {
      name: 'mouaz_quran_app_store_v1',
      partialize: (state) => ({
        progressMap: state.progressMap,
        activeReciterId: state.activeReciterId,
        themeMode: state.themeMode,
        soundFeedbackEnabled: state.soundFeedbackEnabled,
      }),
    }
  )
);
