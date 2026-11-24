import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Moon, Star, Sun, Volume2, VolumeX } from 'lucide-react';
import { STRINGS } from '../strings/strings.constants';
import { useAppStore } from '../store/app.store';

export interface AppHeaderProps {
  title: string;
  starsCount?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, starsCount }) => {
  const progressMap = useAppStore((s) => s.progressMap);
  const themeMode = useAppStore((s) => s.themeMode);
  const toggleThemeMode = useAppStore((s) => s.toggleThemeMode);
  const soundFeedbackEnabled = useAppStore((s) => s.soundFeedbackEnabled);
  const toggleSoundFeedback = useAppStore((s) => s.toggleSoundFeedback);

  const liveStars = useMemo(
    () => Object.values(progressMap).reduce((sum, item) => sum + item.stars, 0),
    [progressMap]
  );

  const displayedStars = starsCount ?? liveStars;
  const themeLabel = themeMode === 'light' ? STRINGS.themeNight : STRINGS.themeLight;
  const soundLabel = soundFeedbackEnabled ? STRINGS.soundOn : STRINGS.soundOff;

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-md)',
        backgroundColor: 'var(--color-surface-primary)',
        borderBottom: '1.5px solid var(--color-surface-interactive)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-general)',
          fontSize: '1.25rem',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={toggleSoundFeedback}
          aria-label={soundLabel}
          title={soundLabel}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-surface-interactive)',
            backgroundColor: soundFeedbackEnabled
              ? 'var(--color-primary-tint)'
              : 'var(--color-surface-subtle)',
            color: soundFeedbackEnabled ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
            cursor: 'pointer',
          }}
        >
          {soundFeedbackEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={toggleThemeMode}
          aria-label={themeLabel}
          title={themeLabel}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-surface-interactive)',
            backgroundColor: 'var(--color-surface-subtle)',
            color: 'var(--color-brand-accent)',
            cursor: 'pointer',
          }}
        >
          {themeMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </motion.button>

        <motion.div
          key={displayedStars}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            backgroundColor: 'var(--color-surface-subtle)',
            padding: 'var(--spacing-xs) var(--spacing-md)',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-surface-interactive)',
          }}
        >
          <Star size={18} color="var(--color-reward-gold)" fill="var(--color-reward-gold)" />
          <span
            style={{
              fontFamily: 'var(--font-general)',
              fontWeight: 800,
              fontSize: '0.95rem',
              color: 'var(--color-text-primary)',
            }}
          >
            {displayedStars} {STRINGS.labelStars}
          </span>
        </motion.div>
      </div>
    </header>
  );
};
