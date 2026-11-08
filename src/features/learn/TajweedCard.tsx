import React from 'react';
import { TajweedRule } from '../../core/data/types';
import { AppCard } from '../../core/ui/AppCard';
import { STRINGS } from '../../core/strings/strings.constants';

export interface TajweedCardProps {
  rule: TajweedRule;
  onSelect: () => void;
}

export const TajweedCard: React.FC<TajweedCardProps> = ({ rule, onSelect }) => {
  const primaryExample = rule.examples[0];

  return (
    <AppCard onClick={onSelect} borderColor={rule.colorToken}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{rule.title}</h3>
        <span
          style={{
            backgroundColor: 'var(--color-surface-subtle)',
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: rule.colorToken,
          }}
        >
          {rule.code}
        </span>
      </div>

      <p style={{ margin: 'var(--spacing-sm) 0', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
        {rule.description}
      </p>

      {primaryExample && (
        <div
          style={{
            backgroundColor: 'var(--color-surface-subtle)',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'var(--font-quran)', fontSize: '1.6rem', lineHeight: 2 }}>
            {primaryExample.text}
          </div>
          <div style={{ marginTop: 'var(--spacing-xs)', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
            {STRINGS.labelMakhraj}: <strong>{rule.makhraj}</strong>
          </div>
        </div>
      )}
    </AppCard>
  );
};
