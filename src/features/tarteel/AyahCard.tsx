import React from 'react';
import { Play, Pause, BookOpen } from 'lucide-react';
import { Ayah } from '../../core/data/types';
import { AppCard } from '../../core/ui/AppCard';

export interface AyahCardProps {
  ayah: Ayah;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onOpenTafseer: () => void;
}

export const AyahCard: React.FC<AyahCardProps> = ({ ayah, isPlaying, onPlayToggle, onOpenTafseer }) => {
  return (
    <AppCard active={isPlaying}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            backgroundColor: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-pill)',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem',
          }}
        >
          {ayah.ayahNumber}
        </span>

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button
            onClick={onPlayToggle}
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
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={onOpenTafseer}
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
            <BookOpen size={18} />
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 'var(--spacing-md)',
          textAlign: 'center',
          fontFamily: 'var(--font-quran)',
          fontSize: '1.6rem',
          lineHeight: '2.4',
          color: isPlaying ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
        }}
      >
        {ayah.textUthmanic}
      </div>
    </AppCard>
  );
};
