export interface QuizQuestion {
  id: number;
  type: 'theory' | 'gapFill' | 'voice';
  prompt: string;
  targetVerse?: string;
  options?: string[];
  correctAnswer: string;
}

export const QUIZ_BANK: QuizQuestion[] = [
  {
    id: 1,
    type: 'theory',
    prompt: 'ما هو حكم النون الساكنة في (مِن مَالٍ)؟',
    options: ['الإدغام', 'الإظهار', 'الإقلاب'],
    correctAnswer: 'الإدغام',
  },
  {
    id: 2,
    type: 'theory',
    prompt: 'حروف القلقلة مجموعة في كلمة:',
    options: ['قُطْبُ جَدٍّ', 'يَرْمَلُونَ', 'حَيٌّ خَبِيرٌ'],
    correctAnswer: 'قُطْبُ جَدٍّ',
  },
  {
    id: 3,
    type: 'gapFill',
    prompt: 'أكمل الآية الكريمة بالكلمة الصحيحة:',
    targetVerse: 'ٱللَّهُ _____',
    options: ['ٱلصَّمَدُ', 'ٱلْأَحَدُ', 'ٱلْعَظِيمُ'],
    correctAnswer: 'ٱلصَّمَدُ',
  },
  {
    id: 4,
    type: 'gapFill',
    prompt: 'أكمل الآية الكريمة بالكلمة الصحيحة:',
    targetVerse: 'إِنَّآ أَعْطَيْنَٰكَ _____',
    options: ['ٱلْكَوْثَرَ', 'ٱلنَّصْرَ', 'ٱلْفَتْحَ'],
    correctAnswer: 'ٱلكَوْثَرَ',
  },
  {
    id: 5,
    type: 'voice',
    prompt: 'رتل الآية الكريمة بإتقان ومخارج واضحة:',
    targetVerse: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
    correctAnswer: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
  },
];
