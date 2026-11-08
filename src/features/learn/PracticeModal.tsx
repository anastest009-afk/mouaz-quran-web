import React, { useState } from 'react';
import { Volume2, Mic, Square, Check } from 'lucide-react';
import { TajweedRule } from '../../core/data/types';
import { AppModal } from '../../core/ui/AppModal';
import { AppButton } from '../../core/ui/AppButton';
import { WaveformCanvas } from '../../core/ui/WaveformCanvas';
import { AudioPlayerService } from '../../core/audio/audio.player';
import { VoiceRecorderService, RecorderState } from '../../core/audio/voice.recorder';
import { STRINGS } from '../../core/strings/strings.constants';

export interface PracticeModalProps {
  rule: TajweedRule | null;
  onClose: () => void;
}

const player = new AudioPlayerService();
const recorder = new VoiceRecorderService();

export const PracticeModal: React.FC<PracticeModalProps> = ({ rule, onClose }) => {
  const [activeExIndex, setActiveExIndex] = useState(0);
  const [recorderState, setRecorderState] = useState<RecorderState>({
    isRecording: false, decibels: -60, amplitudes: [], recordedAudioUrl: null,
  });

  if (!rule) return null;
  const currentEx = rule.examples[activeExIndex] || rule.examples[0];

  const handleListen = () => player.playUrl(currentEx.audioUrl);

  const handleRecordToggle = async () => {
    if (recorderState.isRecording) {
      await recorder.stop();
    } else {
      recorder.onStateChange(setRecorderState);
      await recorder.start();
    }
  };

  const handleCompare = () => {
    if (recorderState.recordedAudioUrl) {
      player.playUrl(recorderState.recordedAudioUrl);
    }
  };

  return (
    <AppModal title={rule.title} isOpen={Boolean(rule)} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)', justifyContent: 'center' }}>
          {rule.examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => { setActiveExIndex(i); player.stop(); }}
              style={{
                padding: 'var(--spacing-xs) var(--spacing-md)',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                backgroundColor: i === activeExIndex ? rule.colorToken : 'var(--color-surface-subtle)',
                color: i === activeExIndex ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {ex.surahName}
            </button>
          ))}
        </div>

        <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-quran)', fontSize: '1.8rem', lineHeight: 2 }}>
            {currentEx.text}
          </div>
          <div style={{ marginTop: 'var(--spacing-xs)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            {STRINGS.labelMakhraj}: <strong>{rule.makhraj}</strong>
          </div>
        </div>

        <WaveformCanvas amplitudes={recorderState.amplitudes} isRecording={recorderState.isRecording} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <AppButton label={STRINGS.btnListen} icon={Volume2} onClick={handleListen} />
          <AppButton
            label={recorderState.isRecording ? STRINGS.btnStopRecord : STRINGS.btnRecord}
            icon={recorderState.isRecording ? Square : Mic}
            variant={recorderState.isRecording ? 'recording' : 'secondary'}
            onClick={handleRecordToggle}
          />
          {recorderState.recordedAudioUrl && (
            <AppButton label={STRINGS.btnCompare} icon={Check} variant="success" onClick={handleCompare} />
          )}
        </div>
      </div>
    </AppModal>
  );
};
