import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TAJWEED_RULES } from '../../core/data/tajweed.data';
import { TajweedRule } from '../../core/data/types';
import { TajweedCard } from './TajweedCard';
import { PracticeModal } from './PracticeModal';

export const TajweedStudio: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState<TajweedRule | null>(null);

  return (
    <div
      style={{
        padding: 'var(--spacing-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
      }}
    >
      {TAJWEED_RULES.map((rule, index) => (
        <motion.div
          key={rule.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.06 }}
        >
          <TajweedCard rule={rule} onSelect={() => setSelectedRule(rule)} />
        </motion.div>
      ))}
      <PracticeModal rule={selectedRule} onClose={() => setSelectedRule(null)} />
    </div>
  );
};
