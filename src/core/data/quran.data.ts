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
  { surahNumber: 1, ayahNumber: 1, textUthmanic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', textSimple: 'بسم الله الرحمن الرحيم', tafseerMuyassar: 'أبدأ قراءتي مستعيناً بالله الرحمن الرحيم.', audioFileName: '001001.mp3' },
  { surahNumber: 1, ayahNumber: 2, textUthmanic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', textSimple: 'الحمد لله رب العالمين', tafseerMuyassar: 'الثناء الكامل لله خالق كل العوالم ومربيها.', audioFileName: '001002.mp3' },
  { surahNumber: 1, ayahNumber: 3, textUthmanic: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', textSimple: 'الرحمن الرحيم', tafseerMuyassar: 'ذو الرحمة الواسعة التي شملت كل شيء.', audioFileName: '001003.mp3' },
  { surahNumber: 1, ayahNumber: 4, textUthmanic: 'مَٰلِكِ يَوْمِ ٱلدِّينِ', textSimple: 'مالك يوم الدين', tafseerMuyassar: 'سبحانه وحده المالك ليوم القيامة والحساب.', audioFileName: '001004.mp3' },
  { surahNumber: 1, ayahNumber: 5, textUthmanic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', textSimple: 'اياك نعبد واياك نستعين', tafseerMuyassar: 'نخصك وحدك بالعبادة ونطلب العون منك وحدك.', audioFileName: '001005.mp3' },
  { surahNumber: 1, ayahNumber: 6, textUthmanic: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', textSimple: 'اهدنا الصراط المستقيم', tafseerMuyassar: 'دلنا وأرشدنا إلى الطريق الواضح المستقيم.', audioFileName: '001006.mp3' },
  { surahNumber: 1, ayahNumber: 7, textUthmanic: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ', textSimple: 'صراط الذين انعمت عليهم غير المغضوب عليهم ولا الضالين', tafseerMuyassar: 'طريق الذين أنعمت عليهم من النبيين والصالحين.', audioFileName: '001007.mp3' },
  // Al-Ikhlas (112)
  { surahNumber: 112, ayahNumber: 1, textUthmanic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', textSimple: 'قل هو الله احد', tafseerMuyassar: 'قل: الله واحد لا شريك له.', audioFileName: '112001.mp3' },
  { surahNumber: 112, ayahNumber: 2, textUthmanic: 'ٱللَّهُ ٱلصَّمَدُ', textSimple: 'الله الصمد', tafseerMuyassar: 'الذي يقصده الخلق في حوائجهم.', audioFileName: '112002.mp3' },
  { surahNumber: 112, ayahNumber: 3, textUthmanic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', textSimple: 'لم يلد ولم يولد', tafseerMuyassar: 'ليس له ولد وليس له والد سبحانه.', audioFileName: '112003.mp3' },
  { surahNumber: 112, ayahNumber: 4, textUthmanic: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ', textSimple: 'ولم يكن له كفوا احد', tafseerMuyassar: 'لا يماثله ولا يكافئه أحد.', audioFileName: '112004.mp3' },
  // Al-Kawthar (108)
  { surahNumber: 108, ayahNumber: 1, textUthmanic: 'إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ', textSimple: 'انا اعطيناك الكوثر', tafseerMuyassar: 'أعطيناك نهراً عظيماً في الجنة وخيراً كثيراً.', audioFileName: '108001.mp3' },
  { surahNumber: 108, ayahNumber: 2, textUthmanic: 'فَصَلِّ لِرَبِّكَ وَٱنْحَرْ', textSimple: 'فصل لربك وانحر', tafseerMuyassar: 'أخلص صلاتك ونسكك لله وحده.', audioFileName: '108002.mp3' },
  { surahNumber: 108, ayahNumber: 3, textUthmanic: 'إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ', textSimple: 'ان شانئك هو الابتر', tafseerMuyassar: 'إن مبغضك هو المنقطع عن كل خير.', audioFileName: '108003.mp3' },
];
