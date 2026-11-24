import React from 'react';
import { motion } from 'motion/react';
import { AppCard } from '../../core/ui/AppCard';

export interface TheoryQuizViewProps {
  prompt: string;
  targetVerse?: string;
  options: string[];
  selectedOption: string | null;
  hasError?: boolean;
  onSelectOption: (option: string) => void;
}

export const TheoryQuizView: React.FC<TheoryQuizViewProps> = ({
  prompt,
  targetVerse,
  options,
  selectedOption,
  hasError = false,
  onSelectOption,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <AppCard hasError={hasError}>
        <h3 style={{ fontSize: '1.15rem', textAlign: 'center', lineHeight: 1.65, fontWeight: 700 }}>
          {prompt}
        </h3>
        {targetVerse && (
          <div
            style={{
              marginTop: 'var(--spacing-sm)',
              textAlign: 'center',
              fontFamily: 'var(--font-quran)',
              fontSize: '1.7rem',
              lineHeight: 2,
              color: 'var(--color-brand-primary)',
            }}
          >
            {targetVerse}
          </div>
        )}
      </AppCard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        {options.map((opt, idx) => (
          <motion.div
            key={opt}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
          >
            <AppCard active={selectedOption === opt} onClick={() => onSelectOption(opt)}>
              <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.08rem' }}>{opt}</div>
            </AppCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
