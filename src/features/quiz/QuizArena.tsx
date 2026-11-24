import React, { useEffect, useRef, useState } from 'react';
import { QUIZ_BANK } from '../../core/data/quiz.bank';
import { TheoryQuizView } from './TheoryQuizView';
import { VoiceQuizView } from './VoiceQuizView';
import { QuizResultModal } from './QuizResultModal';
import { AppButton } from '../../core/ui/AppButton';
import { RecorderState, VoiceRecorderService } from '../../core/audio/voice.recorder';
import { SpeechRecognizerService } from '../../core/audio/speech.recognizer';
import { FeedbackSynth } from '../../core/audio/feedback.synth';
import { ArabicNormalizer } from '../../core/math/arabic.normalizer';
import { AcousticMathEngine } from '../../core/math/acoustic.math';
import { ProgressMathEngine } from '../../core/math/progress.math';
import { useAppStore } from '../../core/store/app.store';
import { STRINGS } from '../../core/strings/strings.constants';

export const QuizArena: React.FC = () => {
  const recorderRef = useRef<VoiceRecorderService | null>(null);
  const speechRef = useRef<SpeechRecognizerService | null>(null);
  const startMsRef = useRef<number>(0);
  const peakDbRef = useRef<number>(-60);
  const transcriptRef = useRef<string>('');

  const saveAyahProgress = useAppStore((s) => s.saveAyahProgress);
  const soundFeedbackEnabled = useAppStore((s) => s.soundFeedbackEnabled);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [transcriptPreview, setTranscriptPreview] = useState('');
  const [micError, setMicError] = useState<string | null>(null);
  const [cardError, setCardError] = useState(false);
  const [recorderState, setRecorderState] = useState<RecorderState>({
    isRecording: false,
    decibels: -60,
    amplitudes: [],
    recordedAudioUrl: null,
  });
  const [resultState, setResultState] = useState<{ isOpen: boolean; isCorrect: boolean; stars: number }>({
    isOpen: false,
    isCorrect: false,
    stars: 0,
  });

  useEffect(() => {
    recorderRef.current = new VoiceRecorderService();
    speechRef.current = new SpeechRecognizerService();
    return () => {
      recorderRef.current?.destroy();
      speechRef.current?.destroy();
    };
  }, []);

  const question = QUIZ_BANK[currentIdx] || QUIZ_BANK[0];

  const handleTheorySubmit = () => {
    if (!selectedOption) return;
    const isCorrect = selectedOption === question.correctAnswer;
    const stars = isCorrect ? 3 : 0;

    if (isCorrect) {
      setCardError(false);
      FeedbackSynth.playSuccessChime(soundFeedbackEnabled);
      saveAyahProgress({ surahNumber: 1, ayahNumber: currentIdx + 1, stars, isMastered: true });
    } else {
      setCardError(true);
      FeedbackSynth.playErrorChime(soundFeedbackEnabled, 0);
    }
    setResultState({ isOpen: true, isCorrect, stars });
  };

  const handleStartVoice = async () => {
    const rec = recorderRef.current;
    const speech = speechRef.current;
    if (!rec) return;

    setMicError(null);
    setCardError(false);
    setTranscriptPreview('');
    transcriptRef.current = '';
    peakDbRef.current = -60;
    startMsRef.current = Date.now();

    rec.onStateChange((st) => {
      setRecorderState(st);
      if (st.decibels > peakDbRef.current) {
        peakDbRef.current = st.decibels;
      }
    });
    rec.onError((err) => {
      setMicError(err === 'unsupported' ? STRINGS.speechUnsupported : STRINGS.micDenied);
    });

    const started = await rec.start();
    if (!started) return;

    if (speech && SpeechRecognizerService.isSupported()) {
      speech.onTranscript((ev) => {
        transcriptRef.current = ev.fullText;
        setTranscriptPreview(ev.fullText);
      });
      speech.start();
    }
  };

  const handleStopVoice = async () => {
    await recorderRef.current?.stop();
    speechRef.current?.stop();

    const elapsedMs = Date.now() - startMsRef.current;
    const hasSpokenAudio = AcousticMathEngine.isVoiceActive(peakDbRef.current) && elapsedMs >= 900;

    let isCorrect = false;
    let earnedStars = 0;

    if (SpeechRecognizerService.isSupported() && transcriptRef.current.trim().length > 0) {
      const target = question.targetSimple || question.targetVerse || '';
      const match = ArabicNormalizer.isSingleVerseMatch(transcriptRef.current, target);
      isCorrect = match.isMatch && hasSpokenAudio;
      earnedStars = isCorrect ? Math.max(2, ProgressMathEngine.calculateEarnedStars(match.score)) : 0;
    } else if (!SpeechRecognizerService.isSupported()) {
      isCorrect = hasSpokenAudio && elapsedMs >= 1400;
      earnedStars = isCorrect ? 2 : 0;
    }

    if (isCorrect) {
      setCardError(false);
      FeedbackSynth.playSuccessChime(soundFeedbackEnabled);
      saveAyahProgress({ surahNumber: 112, ayahNumber: 1, stars: earnedStars, isMastered: true });
    } else {
      setCardError(true);
      FeedbackSynth.playErrorChime(soundFeedbackEnabled, 0);
    }

    setResultState({ isOpen: true, isCorrect, stars: earnedStars });
  };

  const handleNextQuestion = () => {
    setResultState({ isOpen: false, isCorrect: false, stars: 0 });
    setSelectedOption(null);
    setCardError(false);
    setTranscriptPreview('');
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
          transcriptPreview={transcriptPreview}
          errorText={micError}
          hasError={cardError}
          onStartRecord={() => void handleStartVoice()}
          onStopRecord={() => void handleStopVoice()}
        />
      ) : (
        <>
          <TheoryQuizView
            prompt={question.prompt}
            targetVerse={question.targetVerse}
            options={question.options || []}
            selectedOption={selectedOption}
            hasError={cardError}
            onSelectOption={(opt) => {
              setSelectedOption(opt);
              setCardError(false);
            }}
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
