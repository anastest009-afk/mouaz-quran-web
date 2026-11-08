export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  ayahsCount: number;
  type: 'مكية' | 'مدنية';
}

export const ALL_SURAHS_CATALOG: SurahMeta[] = [
  { number: 1, nameArabic: 'الفاتحة', nameEnglish: 'Al-Fatiha', ayahsCount: 7, type: 'مكية' },
  { number: 2, nameArabic: 'البقرة', nameEnglish: 'Al-Baqarah', ayahsCount: 286, type: 'مدنية' },
  { number: 3, nameArabic: 'آل عمران', nameEnglish: 'Ali Imran', ayahsCount: 200, type: 'مدنية' },
  { number: 4, nameArabic: 'النساء', nameEnglish: 'An-Nisa', ayahsCount: 176, type: 'مدنية' },
  { number: 5, nameArabic: 'المائدة', nameEnglish: 'Al-Maidah', ayahsCount: 120, type: 'مدنية' },
  { number: 6, nameArabic: 'الأنعام', nameEnglish: 'Al-Anam', ayahsCount: 165, type: 'مكية' },
  { number: 7, nameArabic: 'الأعراف', nameEnglish: 'Al-Araf', ayahsCount: 206, type: 'مكية' },
  { number: 8, nameArabic: 'الأنفال', nameEnglish: 'Al-Anfal', ayahsCount: 75, type: 'مدنية' },
  { number: 9, nameArabic: 'التوبة', nameEnglish: 'At-Tawbah', ayahsCount: 129, type: 'مدنية' },
  { number: 10, nameArabic: 'يونس', nameEnglish: 'Yunus', ayahsCount: 109, type: 'مكية' },
  { number: 11, nameArabic: 'هود', nameEnglish: 'Hud', ayahsCount: 123, type: 'مكية' },
  { number: 12, nameArabic: 'يوسف', nameEnglish: 'Yusuf', ayahsCount: 111, type: 'مكية' },
  { number: 13, nameArabic: 'الرعد', nameEnglish: 'Ar-Rad', ayahsCount: 43, type: 'مدنية' },
  { number: 14, nameArabic: 'إبراهيم', nameEnglish: 'Ibrahim', ayahsCount: 52, type: 'مكية' },
  { number: 15, nameArabic: 'الحجر', nameEnglish: 'Al-Hijr', ayahsCount: 99, type: 'مكية' },
  { number: 16, nameArabic: 'النحل', nameEnglish: 'An-Nahl', ayahsCount: 128, type: 'مكية' },
  { number: 17, nameArabic: 'الإسراء', nameEnglish: 'Al-Isra', ayahsCount: 111, type: 'مكية' },
  { number: 18, nameArabic: 'الكهف', nameEnglish: 'Al-Kahf', ayahsCount: 110, type: 'مكية' },
  { number: 19, nameArabic: 'مريم', nameEnglish: 'Maryam', ayahsCount: 98, type: 'مكية' },
  { number: 20, nameArabic: 'طه', nameEnglish: 'Taha', ayahsCount: 135, type: 'مكية' },
  { number: 103, nameArabic: 'العصر', nameEnglish: 'Al-Asr', ayahsCount: 3, type: 'مكية' },
  { number: 108, nameArabic: 'الكوثر', nameEnglish: 'Al-Kawthar', ayahsCount: 3, type: 'مكية' },
  { number: 110, nameArabic: 'النصر', nameEnglish: 'An-Nasr', ayahsCount: 3, type: 'مدنية' },
  { number: 112, nameArabic: 'الإخلاص', nameEnglish: 'Al-Ikhlas', ayahsCount: 4, type: 'مكية' },
  { number: 113, nameArabic: 'الفلق', nameEnglish: 'Al-Falaq', ayahsCount: 5, type: 'مكية' },
  { number: 114, nameArabic: 'الناس', nameEnglish: 'An-Nas', ayahsCount: 6, type: 'مكية' },
];
