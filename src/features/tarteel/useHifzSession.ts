import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Ayah } from '../../core/data/types';
import { useAppStore } from '../../core/store/app.store';
import { SpeechRecognizerService } from '../../core/audio/speech.recognizer';
import { VoiceRecorderService } from '../../core/audio/voice.recorder';
import { FeedbackSynth } from '../../core/audio/feedback.synth';
import { AcousticMathEngine } from '../../core/math/acoustic.math';
import { ArabicNormalizer } from '../../core/math/arabic.normalizer';
import { STRINGS } from '../../core/strings/strings.constants';

export function useHifzSession(
  ayahs: Ayah[],
  onScrollToIndex?: (index: number) => void
) {
  const tarteelMode = useAppStore((s) => s.tarteelMode);
  const revealedAyahs = useAppStore((s) => s.revealedAyahs);
  const hintedWordsMap = useAppStore((s) => s.hintedWordsMap);
  const soundFeedbackEnabled = useAppStore((s) => s.soundFeedbackEnabled);

  const setTarteelMode = useAppStore((s) => s.setTarteelMode);
  const revealAyah = useAppStore((s) => s.revealAyah);
  const hideAyah = useAppStore((s) => s.hideAyah);
  const revealAllInSurah = useAppStore((s) => s.revealAllInSurah);
  const hideAllInSurah = useAppStore((s) => s.hideAllInSurah);
  const hintNextWord = useAppStore((s) => s.hintNextWord);
  const saveAyahProgress = useAppStore((s) => s.saveAyahProgress);

  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [micError, setMicError] = useState<string | null>(null);
  const [errorAyahKey, setErrorAyahKey] = useState<string | null>(null);
  const [fallbackVoiceActive, setFallbackVoiceActive] = useState(false);

  const speechRef = useRef<SpeechRecognizerService | null>(null);
  const recorderRef = useRef<VoiceRecorderService | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ayahsRef = useRef<Ayah[]>(ayahs);
  const revealedRef = useRef(revealedAyahs);
  const scrollCbRef = useRef(onScrollToIndex);

  ayahsRef.current = ayahs;
  revealedRef.current = revealedAyahs;
  scrollCbRef.current = onScrollToIndex;

  const speechSupported = SpeechRecognizerService.isSupported();

  const activeTargetIndex = useMemo(() => {
    if (tarteelMode !== 'hifz') return -1;
    return ayahs.findIndex((a) => !revealedAyahs[`${a.surahNumber}_${a.ayahNumber}`]);
  }, [ayahs, revealedAyahs, tarteelMode]);

  const activeTargetAyah = activeTargetIndex >= 0 ? ayahs[activeTargetIndex] : null;
  const activeTargetRef = useRef<Ayah | null>(activeTargetAyah);
  activeTargetRef.current = activeTargetAyah;

  const triggerErrorFlash = useCallback(
    (key: string) => {
      FeedbackSynth.playErrorChime(soundFeedbackEnabled, 1500);
      setErrorAyahKey(key);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setErrorAyahKey(null), 680);
    },
    [soundFeedbackEnabled]
  );

  const stopListening = useCallback(() => {
    speechRef.current?.stop();
    void recorderRef.current?.stop();
    setIsListening(false);
    setFallbackVoiceActive(false);
    setLiveTranscript('');
  }, []);

  useEffect(() => {
    speechRef.current = new SpeechRecognizerService();
    recorderRef.current = new VoiceRecorderService();
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      speechRef.current?.destroy();
      recorderRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (tarteelMode !== 'hifz') {
      stopListening();
    }
  }, [tarteelMode, stopListening]);

  const startListening = useCallback(async () => {
    setMicError(null);
    FeedbackSynth.resetCooldown();

    if (speechSupported && speechRef.current) {
      const speech = speechRef.current;
      speech.onStatusChange((status, code) => {
        if (status === 'listening') {
          setIsListening(true);
        } else if (status === 'error') {
          setIsListening(false);
          setMicError(code === 'not-allowed' ? STRINGS.micDenied : STRINGS.speechUnsupported);
        } else if (status === 'idle') {
          setIsListening(false);
        }
      });

      speech.onTranscript((ev) => {
        setLiveTranscript(ev.fullText);
        const current = activeTargetRef.current;
        if (!current) return;

        const targetText = current.textSimple || current.textUthmanic;
        const match = ArabicNormalizer.evaluateRecitationMatch(
          ev.fullText,
          targetText,
          ev.hasFinal
        );
        const key = `${current.surahNumber}_${current.ayahNumber}`;

        if (match.isAyahComplete) {
          revealAyah(current.surahNumber, current.ayahNumber);
          saveAyahProgress({
            surahNumber: current.surahNumber,
            ayahNumber: current.ayahNumber,
            stars: 3,
            isMastered: true,
          });
          FeedbackSynth.playRevealTick(soundFeedbackEnabled);
          speech.resetCursor();
          setLiveTranscript('');
          setErrorAyahKey(null);

          const list = ayahsRef.current;
          const nextIdx = list.findIndex(
            (a) =>
              `${a.surahNumber}_${a.ayahNumber}` !== key &&
              !revealedRef.current[`${a.surahNumber}_${a.ayahNumber}`]
          );
          if (nextIdx >= 0) {
            scrollCbRef.current?.(nextIdx);
          } else {
            stopListening();
          }
        } else if (match.hasMismatch) {
          triggerErrorFlash(key);
        }
      });

      speech.start('ar-SA');
      return;
    }

    const rec = recorderRef.current;
    if (!rec) return;
    rec.onError((err) => {
      setIsListening(false);
      setMicError(err === 'unsupported' ? STRINGS.speechUnsupported : STRINGS.micDenied);
    });
    rec.onStateChange((st) => {
      if (st.isRecording && AcousticMathEngine.isVoiceActive(st.decibels)) {
        setFallbackVoiceActive(true);
      }
    });
    const ok = await rec.start();
    if (ok) {
      setIsListening(true);
    }
  }, [
    speechSupported,
    revealAyah,
    saveAyahProgress,
    soundFeedbackEnabled,
    stopListening,
    triggerErrorFlash,
  ]);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else void startListening();
  }, [isListening, startListening, stopListening]);

  return {
    tarteelMode,
    setTarteelMode,
    revealedAyahs,
    hintedWordsMap,
    isListening,
    speechSupported,
    liveTranscript,
    micError,
    errorAyahKey,
    fallbackVoiceActive,
    activeTargetAyah,
    toggleListening,
    stopListening,
    revealAyah,
    hideAyah,
    revealAllInSurah,
    hideAllInSurah,
    hintNextWord,
  };
}
