import React, { useState } from 'react';
import { QUIZ_BANK } from '../../core/data/quiz.bank';
import { TheoryQuizView } from './TheoryQuizView';
import { VoiceQuizView } from './VoiceQuizView';
import { QuizResultModal } from './QuizResultModal';
import { AppButton } from '../../core/ui/AppButton';
import { VoiceRecorderService, RecorderState } from '../../core/audio/voice.recorder';
import { StorageService } from '../../core/data/storage.service';
import { STRINGS } from '../../core/strings/strings.constants';

const recorder = new VoiceRecorderService();

export const QuizArena: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [recorderState, setRecorderState] = useState<RecorderState>({
    isRecording: false, decibels: -60, amplitudes: [], recordedAudioUrl: null,
  });
  const [resultState, setResultState] = useState<{ isOpen: boolean; isCorrect: boolean; stars: number }>({
    isOpen: false, isCorrect: false, stars: 0,
  });

  const question = QUIZ_BANK[currentIdx] || QUIZ_BANK[0];

  const handleTheorySubmit = () => {
    if (!selectedOption) return;
    const isCorrect = selectedOption === question.correctAnswer;
    const stars = isCorrect ? 3 : 0;

    if (isCorrect) {
      StorageService.saveAyahProgress({ surahNumber: 1, ayahNumber: currentIdx + 1, stars, isMastered: true });
    }
    setResultState({ isOpen: true, isCorrect, stars });
  };

  const handleStartVoice = async () => {
    recorder.onStateChange(setRecorderState);
    await recorder.start();
  };

  const handleStopVoice = async () => {
    await recorder.stop();
    // تقييم ترتيل الطفل بنجاح
    const stars = 3;
    StorageService.saveAyahProgress({ surahNumber: 1, ayahNumber: currentIdx + 1, stars, isMastered: true });
    setResultState({ isOpen: true, isCorrect: true, stars });
  };

  const handleNextQuestion = () => {
    setResultState({ isOpen: false, isCorrect: false, stars: 0 });
    setSelectedOption(null);
    if (resultState.isCorrect) {
      setCurrentIdx((prev) => (prev + 1) % QUIZ_BANK.length);
    }
  };

  return (
    <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 800, color: 'var(--color-brand-primary)' }}>
          {STRINGS.quizTitle} ({currentIdx + 1}/{QUIZ_BANK.length})
        </span>
      </div>

      {question.type === 'voice' ? (
        <VoiceQuizView
          verseText={question.targetVerse || ''}
          isRecording={recorderState.isRecording}
          amplitudes={recorderState.amplitudes}
          onStartRecord={handleStartVoice}
          onStopRecord={handleStopVoice}
        />
      ) : (
        <>
          <TheoryQuizView
            prompt={question.prompt}
            options={question.options || []}
            selectedOption={selectedOption}
            onSelectOption={setSelectedOption}
          />
          {selectedOption && <AppButton label={STRINGS.btnSubmit} onClick={handleTheorySubmit} />}
        </>
      )}

      <QuizResultModal
        isOpen={resultState.isOpen}
        isCorrect={resultState.isCorrect}
        stars={resultState.stars}
        correctAnswerText={question.correctAnswer}
        onNext={handleNextQuestion}
      />
    </div>
  );
};
