import { Surah, Ayah } from './types';

export const INITIAL_SURAHS: Surah[] = [
  { number: 1, nameArabic: 'الفاتحة', nameEnglish: 'Al-Fatiha', ayahsCount: 7 },
  { number: 108, nameArabic: 'الكوثر', nameEnglish: 'Al-Kawthar', ayahsCount: 3 },
  { number: 112, nameArabic: 'الإخلاص', nameEnglish: 'Al-Ikhlas', ayahsCount: 4 },
  { number: 113, nameArabic: 'الفلق', nameEnglish: 'Al-Falaq', ayahsCount: 5 },
  { number: 114, nameArabic: 'الناس', nameEnglish: 'An-Nas', ayahsCount: 6 },
];

export const INITIAL_AYAHS: Ayah[] = [
  // Al-Fatiha (1)
  { surahNumber: 1, ayahNumber: 1, textUthmanic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', tafseerMuyassar: 'أبدأ قراءتي مستعيناً بالله الرحمن الرحيم.', audioFileName: '001001.mp3' },
  { surahNumber: 1, ayahNumber: 2, textUthmanic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', tafseerMuyassar: 'الشكر والثناء الكامل لله خالق كل العوالم.', audioFileName: '001002.mp3' },
  { surahNumber: 1, ayahNumber: 3, textUthmanic: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', tafseerMuyassar: 'ذو الرحمة الواسعة التي وسعت كل شيء.', audioFileName: '001003.mp3' },
  { surahNumber: 1, ayahNumber: 4, textUthmanic: 'مَٰلِكِ يَوْمِ ٱلدِّينِ', tafseerMuyassar: 'سبحانه وحده المالك ليوم القيامة والحساب.', audioFileName: '001004.mp3' },
  // Al-Ikhlas (112)
  { surahNumber: 112, ayahNumber: 1, textUthmanic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', tafseerMuyassar: 'قل يا محمد: الله واحد لا شريك له.', audioFileName: '112001.mp3' },
  { surahNumber: 112, ayahNumber: 2, textUthmanic: 'ٱللَّهُ ٱلصَّمَدُ', tafseerMuyassar: 'الذي يقصده كل الخلق في حاجاتهم.', audioFileName: '112002.mp3' },
  { surahNumber: 112, ayahNumber: 3, textUthmanic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', tafseerMuyassar: 'ليس له ولد وليس له والد سبحانه.', audioFileName: '112003.mp3' },
  { surahNumber: 112, ayahNumber: 4, textUthmanic: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ', tafseerMuyassar: 'لا يماثله ولا يشبهه أحد في صفاته.', audioFileName: '112004.mp3' },
  // Al-Kawthar (108)
  { surahNumber: 108, ayahNumber: 1, textUthmanic: 'إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ', tafseerMuyassar: 'أعطيناك يا محمد نهراً عظيماً في الجنة وخيراً كثيراً.', audioFileName: '108001.mp3' },
  { surahNumber: 108, ayahNumber: 2, textUthmanic: 'فَصَلِّ لِرَبِّكَ وَٱنْحَرْ', tafseerMuyassar: 'أخلص صلاتك وعبادتك وذبيحتك لله وحده.', audioFileName: '108002.mp3' },
  { surahNumber: 108, ayahNumber: 3, textUthmanic: 'إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ', tafseerMuyassar: 'إن مبغضك هو المنقطع عن كل خير وذكر.', audioFileName: '108003.mp3' },
];
