import React from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mic, Square } from 'lucide-react';
import { TarteelMode } from '../../core/tokens/theme.types';
import { STRINGS } from '../../core/strings/strings.constants';

export interface HifzControlBarProps {
  mode: TarteelMode;
  isListening: boolean;
  speechSupported: boolean;
  liveTranscript: string;
  micError: string | null;
  hasMismatchFlash: boolean;
  onModeChange: (mode: TarteelMode) => void;
  onToggleListening: () => void;
  onHideAll: () => void;
  onRevealAll: () => void;
}

export const HifzControlBar: React.FC<HifzControlBarProps> = ({
  mode,
  isListening,
  speechSupported,
  liveTranscript,
  micError,
  hasMismatchFlash,
  onModeChange,
  onToggleListening,
  onHideAll,
  onRevealAll,
}) => {
  const modeItems: { id: TarteelMode; label: string }[] = [
    { id: 'read', label: STRINGS.modeRead },
    { id: 'hifz', label: STRINGS.modeHifz },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        backgroundColor: 'var(--color-surface-primary)',
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid var(--color-surface-interactive)',
        marginBottom: 'var(--spacing-md)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-sm)' }}>
        <div
          style={{
            display: 'inline-grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'var(--color-surface-subtle)',
            padding: '3px',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          {modeItems.map((m) => {
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onModeChange(m.id)}
                style={{
                  position: 'relative',
                  border: 'none',
                  background: 'none',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-general)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: active ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                }}
              >
                {active && (
                  <motion.div
                    layoutId="tarteelModePill"
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'var(--color-brand-primary)',
                      zIndex: 0,
                    }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{m.label}</span>
              </button>
            );
          })}
        </div>

        {mode === 'hifz' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onToggleListening}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                backgroundColor: isListening
                  ? 'var(--color-mic-recording)'
                  : 'var(--color-brand-secondary)',
                color: 'var(--color-text-inverse)',
                fontFamily: 'var(--font-general)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {isListening ? <Square size={15} /> : <Mic size={15} />}
              <span>{isListening ? STRINGS.btnStopHifz : STRINGS.btnStartHifz}</span>
            </button>

            <button
              type="button"
              onClick={onHideAll}
              title={STRINGS.btnHideAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-surface-interactive)',
                backgroundColor: 'var(--color-surface-subtle)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-general)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              <EyeOff size={14} />
              <span>{STRINGS.btnHideAll}</span>
            </button>

            <button
              type="button"
              onClick={onRevealAll}
              title={STRINGS.btnRevealAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-surface-interactive)',
                backgroundColor: 'var(--color-surface-subtle)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-general)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              <Eye size={14} />
              <span>{STRINGS.btnRevealAll}</span>
            </button>
          </div>
        )}
      </div>

      {mode === 'hifz' && (micError || isListening) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--spacing-sm)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: micError || hasMismatchFlash
              ? 'var(--color-alert-tint)'
              : 'var(--color-primary-tint)',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: micError || hasMismatchFlash
              ? 'var(--color-feedback-alert)'
              : 'var(--color-brand-primary)',
          }}
        >
          <span>
            {micError
              ? micError
              : hasMismatchFlash
                ? STRINGS.statusMismatch
                : speechSupported
                  ? STRINGS.promptListening
                  : STRINGS.statusFallbackMode}
          </span>
          {liveTranscript && !micError && (
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              {liveTranscript}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
