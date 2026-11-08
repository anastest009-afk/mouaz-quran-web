import React from 'react';
import { Star, Trees } from 'lucide-react';
import { AppCard } from '../../core/ui/AppCard';
import { StorageService } from '../../core/data/storage.service';
import { ProgressMathEngine } from '../../core/math/progress.math';
import { STRINGS } from '../../core/strings/strings.constants';

export const TreeGrowthWidget: React.FC = () => {
  const stars = StorageService.getTotalStars();
  const mastered = StorageService.getMasteredCount();
  const stage = ProgressMathEngine.calculateTreeStage(mastered, 2);

  return (
    <div style={{ padding: 'var(--spacing-md)' }}>
      <AppCard borderColor="var(--color-tajweed-ghunnah)">
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{STRINGS.treeTitle}</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{STRINGS.treeSubtitle}</p>

          <div
            style={{
              margin: 'var(--spacing-md) 0',
              width: '120px',
              height: '120px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-surface-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Trees size={64} color="var(--color-tajweed-ghunnah)" />
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <Star size={20} color="var(--color-reward-gold)" fill="var(--color-reward-gold)" />
              <span style={{ fontWeight: 800 }}>{stars} {STRINGS.labelStars}</span>
            </div>
            <span style={{ color: 'var(--color-surface-interactive)' }}>|</span>
            <span style={{ fontWeight: 700, color: 'var(--color-brand-primary)' }}>
              {STRINGS.stageLevel} {stage}
            </span>
          </div>
        </div>
      </AppCard>
    </div>
  );
};
