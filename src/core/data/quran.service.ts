import { Ayah } from './types';
import { INITIAL_AYAHS } from './quran.data';
import { STRINGS } from '../strings/strings.constants';

interface ApiAyahItem {
  numberInSurah: number;
  text: string;
}

interface ApiEditionBlock {
  ayahs: ApiAyahItem[];
}

interface ApiEditionsResponse {
  code: number;
  data?: ApiEditionBlock[];
}

const CACHE_PREFIX = 'mouaz_surah_v2_';

export class QuranService {
  static async getAyahsForSurah(surahNumber: number): Promise<Ayah[]> {
    const local = INITIAL_AYAHS.filter((a) => a.surahNumber === surahNumber);
    const cacheKey = `${CACHE_PREFIX}${surahNumber}`;

    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as Ayah[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore storage read failure
    }

    if (local.length > 0) return local;

    try {
      const endpoint = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,quran-simple-clean,ar.muyassar`;
      const res = await fetch(endpoint);
      const data = (await res.json()) as ApiEditionsResponse;

      if (data.code === 200 && Array.isArray(data.data) && data.data.length >= 2) {
        const uthmani = data.data[0]?.ayahs || [];
        const simple = data.data[1]?.ayahs || [];
        const muyassar = data.data[2]?.ayahs || [];
        const sStr = String(surahNumber).padStart(3, '0');

        const ayahs: Ayah[] = uthmani.map((item, idx) => {
          const aStr = String(item.numberInSurah).padStart(3, '0');
          return {
            surahNumber,
            ayahNumber: item.numberInSurah,
            textUthmanic: item.text,
            textSimple: simple[idx]?.text || item.text,
            tafseerMuyassar: muyassar[idx]?.text || STRINGS.tafseerFallback,
            audioFileName: `${sStr}${aStr}.mp3`,
          };
        });

        try {
          localStorage.setItem(cacheKey, JSON.stringify(ayahs));
        } catch {
          // Ignore quota exceeded on large surahs
        }

        return ayahs;
      }
    } catch {
      // Fallback to local seed
    }

    return local;
  }
}
