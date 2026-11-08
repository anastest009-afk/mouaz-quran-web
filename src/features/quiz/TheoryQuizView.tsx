import React from 'react';
import { AppCard } from '../../core/ui/AppCard';

export interface TheoryQuizViewProps {
  prompt: string;
  options: string[];
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
}

export const TheoryQuizView: React.FC<TheoryQuizViewProps> = ({
  prompt,
  options,
  selectedOption,
  onSelectOption,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <AppCard>
        <h3 style={{ fontSize: '1.2rem', textAlign: 'center', lineHeight: 1.6 }}>{prompt}</h3>
      </AppCard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        {options.map((opt) => (
          <AppCard
            key={opt}
            active={selectedOption === opt}
            onClick={() => onSelectOption(opt)}
          >
            <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
              {opt}
            </div>
          </AppCard>
        ))}
      </div>
    </div>
  );
};
