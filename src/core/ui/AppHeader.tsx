import React from 'react';
import { Star } from 'lucide-react';
import { STRINGS } from '../strings/strings.constants';

export interface AppHeaderProps {
  title: string;
  starsCount?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, starsCount = 0 }) => {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        backgroundColor: 'var(--color-surface-primary)',
        borderBottom: '2px solid var(--color-surface-interactive)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-general)',
          fontSize: '1.4rem',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </h1>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          backgroundColor: 'var(--color-surface-subtle)',
          padding: 'var(--spacing-xs) var(--spacing-md)',
          borderRadius: 'var(--radius-pill)',
        }}
      >
        <Star size={20} color="var(--color-reward-gold)" fill="var(--color-reward-gold)" />
        <span
          style={{
            fontFamily: 'var(--font-general)',
            fontWeight: 800,
            fontSize: '1rem',
            color: 'var(--color-text-primary)',
          }}
        >
          {starsCount} {STRINGS.labelStars}
        </span>
      </div>
    </header>
  );
};
