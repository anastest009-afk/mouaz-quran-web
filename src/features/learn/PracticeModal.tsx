import React, { useEffect, useRef, useState } from 'react';
import { Check, Mic, Square, Volume2 } from 'lucide-react';
import { TajweedRule } from '../../core/data/types';
import { AppModal } from '../../core/ui/AppModal';
import { AppButton } from '../../core/ui/AppButton';
import { WaveformCanvas } from '../../core/ui/WaveformCanvas';
import { AudioPlayerService } from '../../core/audio/audio.player';
import { RecorderState, VoiceRecorderService } from '../../core/audio/voice.recorder';
import { STRINGS } from '../../core/strings/strings.constants';

export interface PracticeModalProps {
  rule: TajweedRule | null;
  onClose: () => void;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({ rule, onClose }) => {
  const playerRef = useRef<AudioPlayerService | null>(null);
  const recorderRef = useRef<VoiceRecorderService | null>(null);
  const [activeExIndex, setActiveExIndex] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [recorderState, setRecorderState] = useState<RecorderState>({
    isRecording: false,
    decibels: -60,
    amplitudes: [],
    recordedAudioUrl: null,
  });

  useEffect(() => {
    playerRef.current = new AudioPlayerService();
    recorderRef.current = new VoiceRecorderService();
    return () => {
      playerRef.current?.destroy();
      recorderRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    setActiveExIndex(0);
    setMicError(null);
    playerRef.current?.stop();
  }, [rule?.id]);

  if (!rule) return null;
  const currentEx = rule.examples[activeExIndex] || rule.examples[0];

  const handleListen = () => {
    void playerRef.current?.playUrl(currentEx.audioUrl);
  };

  const handleRecordToggle = async () => {
    const rec = recorderRef.current;
    if (!rec) return;
    if (recorderState.isRecording) {
      await rec.stop();
      return;
    }
    setMicError(null);
    rec.onStateChange(setRecorderState);
    rec.onError((err) => {
      setMicError(err === 'unsupported' ? STRINGS.speechUnsupported : STRINGS.micDenied);
    });
    await rec.start();
  };

  const handleCompare = () => {
    if (recorderState.recordedAudioUrl) {
      void playerRef.current?.playUrl(recorderState.recordedAudioUrl);
    }
  };

  const handleModalClose = () => {
    playerRef.current?.stop();
    if (recorderState.isRecording) {
      void recorderRef.current?.stop();
    }
    onClose();
  };

  return (
    <AppModal title={rule.title} isOpen={Boolean(rule)} onClose={handleModalClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)', justifyContent: 'center', flexWrap: 'wrap' }}>
          {rule.examples.map((ex, i) => (
            <button
              key={ex.surahName}
              type="button"
              onClick={() => {
                setActiveExIndex(i);
                playerRef.current?.stop();
              }}
              style={{
                padding: 'var(--spacing-xs) var(--spacing-md)',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-surface-interactive)',
                backgroundColor: i === activeExIndex ? rule.colorToken : 'var(--color-surface-subtle)',
                color: i === activeExIndex ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
                fontFamily: 'var(--font-general)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {ex.surahName}
            </button>
          ))}
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-surface-subtle)',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'var(--font-quran)', fontSize: '1.8rem', lineHeight: 2 }}>
            {currentEx.text}
          </div>
          <div style={{ marginTop: 'var(--spacing-xs)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            {STRINGS.labelMakhraj}: <strong>{rule.makhraj}</strong>
          </div>
        </div>

        <WaveformCanvas amplitudes={recorderState.amplitudes} isRecording={recorderState.isRecording} />

        {micError && (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--color-feedback-alert)',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            {micError}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <AppButton label={STRINGS.btnListen} icon={Volume2} onClick={handleListen} />
          <AppButton
            label={recorderState.isRecording ? STRINGS.btnStopRecord : STRINGS.btnRecord}
            icon={recorderState.isRecording ? Square : Mic}
            variant={recorderState.isRecording ? 'recording' : 'secondary'}
            onClick={() => void handleRecordToggle()}
          />
          {recorderState.recordedAudioUrl && (
            <AppButton label={STRINGS.btnCompare} icon={Check} variant="success" onClick={handleCompare} />
          )}
        </div>
      </div>
    </AppModal>
  );
};
