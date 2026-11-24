import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, Star } from 'lucide-react';
import { AppCard } from '../../core/ui/AppCard';
import { useAppStore } from '../../core/store/app.store';
import { ProgressMathEngine } from '../../core/math/progress.math';
import { STRINGS } from '../../core/strings/strings.constants';

export const TreeGrowthWidget: React.FC = () => {
  const progressMap = useAppStore((s) => s.progressMap);

  const { stars, mastered, stage, stageRatio } = useMemo(() => {
    const items = Object.values(progressMap);
    const totalStars = items.reduce((sum, item) => sum + item.stars, 0);
    const masteredCount = items.filter((item) => item.isMastered).length;
    const currentStage = ProgressMathEngine.calculateTreeStage(masteredCount, 3);
    const ratio = ProgressMathEngine.calculateProgressRatio(masteredCount % 3, 3);
    return {
      stars: totalStars,
      mastered: masteredCount,
      stage: currentStage,
      stageRatio: masteredCount > 0 && masteredCount % 3 === 0 ? 1 : ratio,
    };
  }, [progressMap]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ padding: 'var(--spacing-md)' }}
    >
      <AppCard borderColor="var(--color-brand-primary)">
        <div
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
          }}
        >
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{STRINGS.treeTitle}</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            {STRINGS.treeSubtitle}
          </p>

          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              margin: 'var(--spacing-md) 0',
              width: '116px',
              height: '116px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-primary-tint)',
              border: '2px solid var(--color-brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={58} color="var(--color-brand-primary)" />
          </motion.div>

          <div
            style={{
              width: '100%',
              height: '10px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-surface-subtle)',
              overflow: 'hidden',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(stageRatio * 100)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                height: '100%',
                backgroundColor: 'var(--color-brand-primary)',
                borderRadius: 'var(--radius-pill)',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <Star size={19} color="var(--color-reward-gold)" fill="var(--color-reward-gold)" />
              <span style={{ fontWeight: 800 }}>
                {stars} {STRINGS.labelStars}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <CheckCircle2 size={19} color="var(--color-feedback-success)" />
              <span style={{ fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                {mastered} {STRINGS.masteredLabel}
              </span>
            </div>

            <span style={{ fontWeight: 800, color: 'var(--color-brand-primary)' }}>
              {STRINGS.stageLevel} {stage}
            </span>
          </div>
        </div>
      </AppCard>
    </motion.div>
  );
};
