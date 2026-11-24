import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Lightbulb, Mic } from 'lucide-react';
import { STRINGS } from '../../core/strings/strings.constants';

export interface HifzOverlayProps {
  ayahText: string;
  hintedWordsCount: number;
  isActiveTarget: boolean;
  hasError: boolean;
  fallbackVoiceActive: boolean;
  onHintWord: () => void;
  onRevealAyah: () => void;
}

export const HifzOverlay: React.FC<HifzOverlayProps> = ({
  ayahText,
  hintedWordsCount,
  isActiveTarget,
  hasError,
  fallbackVoiceActive,
  onHintWord,
  onRevealAyah,
}) => {
  const hintedPreview = useMemo(() => {
    if (hintedWordsCount <= 0) return '';
    const words = ayahText.trim().split(/\s+/);
    return words.slice(0, hintedWordsCount).join(' ');
  }, [ayahText, hintedWordsCount]);

  return (
    <motion.div
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      style={{
        marginTop: 'var(--spacing-md)',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: hasError ? 'var(--color-alert-tint)' : 'var(--color-mask-surface)',
        border: `1.5px dashed ${
          hasError
            ? 'var(--color-feedback-alert)'
            : isActiveTarget
              ? 'var(--color-brand-primary)'
              : 'var(--color-mask-border)'
        }`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
      }}
    >
      {hintedPreview ? (
        <div
          style={{
            fontFamily: 'var(--font-quran)',
            fontSize: '1.5rem',
            lineHeight: 2,
            color: 'var(--color-text-primary)',
            textAlign: 'center',
          }}
        >
          {hintedPreview}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            color: isActiveTarget ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
            fontWeight: 700,
            fontSize: '0.95rem',
            padding: 'var(--spacing-sm) 0',
          }}
        >
          {isActiveTarget ? <Mic size={18} /> : <EyeOff size={18} />}
          <span>{STRINGS.hiddenAyahPrompt}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={onHintWord}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-surface-interactive)',
            backgroundColor: 'var(--color-surface-primary)',
            color: 'var(--color-brand-accent)',
            fontFamily: 'var(--font-general)',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          <Lightbulb size={15} />
          <span>{STRINGS.btnHintWord}</span>
        </button>

        <button
          type="button"
          onClick={onRevealAyah}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: fallbackVoiceActive
              ? 'var(--color-feedback-success)'
              : 'var(--color-brand-primary)',
            color: 'var(--color-text-inverse)',
            fontFamily: 'var(--font-general)',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          <Eye size={15} />
          <span>{fallbackVoiceActive ? STRINGS.confirmRevealManual : STRINGS.btnRevealAyah}</span>
        </button>
      </div>
    </motion.div>
  );
};
