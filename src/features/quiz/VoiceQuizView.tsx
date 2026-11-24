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
  transcriptPreview?: string;
  errorText?: string | null;
  hasError?: boolean;
  onStartRecord: () => void;
  onStopRecord: () => void;
}

export const VoiceQuizView: React.FC<VoiceQuizViewProps> = ({
  verseText,
  isRecording,
  amplitudes,
  transcriptPreview,
  errorText,
  hasError = false,
  onStartRecord,
  onStopRecord,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <AppCard hasError={hasError}>
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
          {STRINGS.promptSpeak}
        </p>
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-quran)',
            fontSize: '1.85rem',
            lineHeight: 2,
            color: 'var(--color-brand-primary)',
          }}
        >
          {verseText}
        </div>
        {transcriptPreview && (
          <div
            style={{
              marginTop: 'var(--spacing-sm)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-surface-subtle)',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            {transcriptPreview}
          </div>
        )}
      </AppCard>

      <WaveformCanvas amplitudes={amplitudes} isRecording={isRecording} />

      {errorText && (
        <div
          style={{
            textAlign: 'center',
            color: 'var(--color-feedback-alert)',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          {errorText}
        </div>
      )}

      <AppButton
        label={isRecording ? STRINGS.btnStopRecord : STRINGS.btnRecord}
        icon={isRecording ? Square : Mic}
        variant={isRecording ? 'recording' : 'primary'}
        onClick={isRecording ? onStopRecord : onStartRecord}
      />
    </div>
  );
};
