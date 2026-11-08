import { TajweedRule } from './types';

export const TAJWEED_RULES: TajweedRule[] = [
  {
    id: 1,
    code: 'GHUNNAH',
    title: 'حكم الغنة',
    description: 'صوت رخيم يخرج من الخيشوم بمقدار حركتين في النون والميم المشددتين.',
    makhraj: 'الخيشوم (أعلى الأنف)',
    colorToken: 'var(--color-tajweed-ghunnah)',
    examples: [
      {
        text: 'إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ',
        highlighted: 'نَّ',
        audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/108001.mp3',
        surahName: 'سورة الكوثر',
      },
      {
        text: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
        highlighted: 'نَّ',
        audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/114001.mp3',
        surahName: 'سورة الناس',
      },
    ],
  },
  {
    id: 2,
    code: 'QALQALAH',
    title: 'حكم القلقلة',
    description: 'اضطراب ونبرة قوية عند نطق الحرف الساكن من حروف (ق، ط، ب، ج، د).',
    makhraj: 'مخرج الحرف مع اضطراب الصوت',
    colorToken: 'var(--color-tajweed-qalqalah)',
    examples: [
      {
        text: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
        highlighted: 'دٌ',
        audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/112001.mp3',
        surahName: 'سورة الإخلاص',
      },
      {
        text: 'ٱللَّهُ ٱلصَّمَدُ',
        highlighted: 'دُ',
        audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/112002.mp3',
        surahName: 'سورة الإخلاص',
      },
    ],
  },
  {
    id: 3,
    code: 'MADD',
    title: 'حكم المد',
    description: 'إطالة الصوت بأحد حروف المد الثلاثة (الألف والواو والياء).',
    makhraj: 'الجوف (الفراغ الممتد من الحلق للفم)',
    colorToken: 'var(--color-tajweed-madd)',
    examples: [
      {
        text: 'إِذَا جَآءَ نَصْرُ ٱللَّهِ',
        highlighted: 'جَآءَ',
        audioUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps/110001.mp3',
        surahName: 'سورة النصر',
      },
    ],
  },
];
