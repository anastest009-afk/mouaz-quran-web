import { Ayah } from './types';
import { INITIAL_AYAHS } from './quran.data';

export class QuranService {
  static async getAyahsForSurah(surahNumber: number): Promise<Ayah[]> {
    const local = INITIAL_AYAHS.filter((a) => a.surahNumber === surahNumber);
    if (local.length > 0) return local;

    try {
      const cacheKey = `mouaz_surah_cache_${surahNumber}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);

      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`);
      const data = await res.json();
      if (data.code === 200 && data.data?.ayahs) {
        const ayahs: Ayah[] = data.data.ayahs.map((a: { numberInSurah: number; text: string }) => {
          const sStr = String(surahNumber).padStart(3, '0');
          const aStr = String(a.numberInSurah).padStart(3, '0');
          return {
            surahNumber,
            ayahNumber: a.numberInSurah,
            textUthmanic: a.text,
            tafseerMuyassar: 'تفسير ميسر للآية الكريمة ليتدبر الطفل معانيها الجميلة.',
            audioFileName: `${sStr}${aStr}.mp3`,
          };
        });

        localStorage.setItem(cacheKey, JSON.stringify(ayahs));
        return ayahs;
      }
    } catch {
      // Fallback
    }
    return local;
  }
}
