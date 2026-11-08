import React, { useState } from 'react';
import { TAJWEED_RULES } from '../../core/data/tajweed.data';
import { TajweedRule } from '../../core/data/types';
import { TajweedCard } from './TajweedCard';
import { PracticeModal } from './PracticeModal';

export const TajweedStudio: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState<TajweedRule | null>(null);

  return (
    <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      {TAJWEED_RULES.map((rule) => (
        <TajweedCard key={rule.id} rule={rule} onSelect={() => setSelectedRule(rule)} />
      ))}
      {selectedRule && <PracticeModal rule={selectedRule} onClose={() => setSelectedRule(null)} />}
    </div>
  );
};
