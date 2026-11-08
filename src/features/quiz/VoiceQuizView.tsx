import React from 'react';
import { Mic, Square } from 'lucide-react';
import { AppCard } from '../../core/ui/AppCard';
import { AppButton } from '../../core/ui/AppButton';
import { WaveformCanvas } from '../../core/ui/WaveformCanvas';
import { STRINGS } from '../../core/strings/strings.constants';

export interface VoiceQuizViewProps {
  verseText: string;
  isRecording: boolean;
  amplitudes: number[];
  onStartRecord: () => void;
  onStopRecord: () => void;
}

export const VoiceQuizView: React.FC<VoiceQuizViewProps> = ({
  verseText,
  isRecording,
  amplitudes,
  onStartRecord,
  onStopRecord,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <AppCard>
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
          {STRINGS.promptSpeak}
        </p>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-quran)', fontSize: '1.8rem', color: 'var(--color-brand-primary)' }}>
          {verseText}
        </div>
      </AppCard>

      <WaveformCanvas amplitudes={amplitudes} isRecording={isRecording} />

      <AppButton
        label={isRecording ? STRINGS.btnStopRecord : STRINGS.btnRecord}
        icon={isRecording ? Square : Mic}
        variant={isRecording ? 'recording' : 'primary'}
        onClick={isRecording ? onStopRecord : onStartRecord}
      />
    </div>
  );
};
