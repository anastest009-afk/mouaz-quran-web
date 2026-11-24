import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, EyeOff, Pause, Play } from 'lucide-react';
import { Ayah } from '../../core/data/types';
import { AppCard } from '../../core/ui/AppCard';
import { HifzOverlay } from './HifzOverlay';
import { STRINGS } from '../../core/strings/strings.constants';

export interface AyahCardProps {
  ayah: Ayah;
  isPlaying: boolean;
  isHifzMode: boolean;
  isRevealed: boolean;
  isActiveTarget: boolean;
  hasError: boolean;
  hintedWordsCount: number;
  fallbackVoiceActive: boolean;
  onPlayToggle: () => void;
  onOpenTafseer: () => void;
  onHintWord: () => void;
  onRevealAyah: () => void;
  onHideAyah: () => void;
}

export const AyahCard: React.FC<AyahCardProps> = ({
  ayah,
  isPlaying,
  isHifzMode,
  isRevealed,
  isActiveTarget,
  hasError,
  hintedWordsCount,
  fallbackVoiceActive,
  onPlayToggle,
  onOpenTafseer,
  onHintWord,
  onRevealAyah,
  onHideAyah,
}) => {
  const showVerseText = !isHifzMode || isRevealed;

  return (
    <AppCard active={isPlaying || isActiveTarget} hasError={hasError}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            backgroundColor: isActiveTarget
              ? 'var(--color-brand-primary)'
              : 'var(--color-surface-subtle)',
            color: isActiveTarget ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
            borderRadius: 'var(--radius-pill)',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.88rem',
          }}
        >
          {ayah.ayahNumber}
        </span>

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          {isHifzMode && isRevealed && (
            <button
              type="button"
              onClick={onHideAyah}
              aria-label={STRINGS.btnHideAll}
              style={{
                backgroundColor: 'var(--color-surface-subtle)',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
              }}
            >
              <EyeOff size={17} />
            </button>
          )}

          <button
            type="button"
            onClick={onPlayToggle}
            aria-label={isPlaying ? STRINGS.btnPause : STRINGS.btnPlay}
            style={{
              backgroundColor: isPlaying ? 'var(--color-brand-primary)' : 'var(--color-surface-subtle)',
              color: isPlaying ? 'var(--color-text-inverse)' : 'var(--color-brand-primary)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {isPlaying ? <Pause size={17} /> : <Play size={17} />}
          </button>

          <button
            type="button"
            onClick={onOpenTafseer}
            aria-label={STRINGS.tafseerTitle}
            style={{
              backgroundColor: 'var(--color-surface-subtle)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-brand-secondary)',
            }}
          >
            <BookOpen size={17} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showVerseText ? (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            style={{
              marginTop: 'var(--spacing-md)',
              textAlign: 'center',
              fontFamily: 'var(--font-quran)',
              fontSize: '1.65rem',
              lineHeight: '2.4',
              color: isPlaying ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
            }}
          >
            {ayah.textUthmanic}
          </motion.div>
        ) : (
          <HifzOverlay
            key="hidden"
            ayahText={ayah.textUthmanic}
            hintedWordsCount={hintedWordsCount}
            isActiveTarget={isActiveTarget}
            hasError={hasError}
            fallbackVoiceActive={fallbackVoiceActive}
            onHintWord={onHintWord}
            onRevealAyah={onRevealAyah}
          />
        )}
      </AnimatePresence>
    </AppCard>
  );
};
