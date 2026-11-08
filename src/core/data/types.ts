export interface Surah {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  ayahsCount: number;
}

export interface Ayah {
  surahNumber: number;
  ayahNumber: number;
  textUthmanic: string;
  tafseerMuyassar: string;
  audioFileName: string;
}

export interface TajweedExample {
  text: string;
  highlighted: string;
  audioUrl: string;
  surahName: string;
}

export interface TajweedRule {
  id: number;
  code: string;
  title: string;
  description: string;
  makhraj: string;
  colorToken: string;
  examples: TajweedExample[];
}

export interface Reciter {
  id: string;
  name: string;
  baseUrl: string;
}

export interface ChildProgress {
  surahNumber: number;
  ayahNumber: number;
  stars: number;
  isMastered: boolean;
}
