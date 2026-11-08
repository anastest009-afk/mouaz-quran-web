import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star } from 'lucide-react';
import { AppModal } from '../../core/ui/AppModal';
import { AppButton } from '../../core/ui/AppButton';
import { STRINGS } from '../../core/strings/strings.constants';

export interface QuizResultModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  stars: number;
  correctAnswerText?: string;
  onNext: () => void;
}

export const QuizResultModal: React.FC<QuizResultModalProps> = ({
  isOpen,
  isCorrect,
  stars,
  correctAnswerText,
  onNext,
}) => {
  useEffect(() => {
    if (isOpen && isCorrect) {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
  }, [isOpen, isCorrect]);

  return (
    <AppModal title={STRINGS.quizTitle} isOpen={isOpen} onClose={onNext}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <h3
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: isCorrect ? 'var(--color-feedback-success)' : 'var(--color-feedback-alert)',
          }}
        >
          {isCorrect ? STRINGS.feedbackSuccess : STRINGS.feedbackTryAgain}
        </h3>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-xs)' }}>
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              size={40}
              color={s <= stars ? 'var(--color-reward-gold)' : 'var(--color-surface-interactive)'}
              fill={s <= stars ? 'var(--color-reward-gold)' : 'transparent'}
            />
          ))}
        </div>

        {!isCorrect && correctAnswerText && (
          <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              {STRINGS.correctAnswerWas}:
            </span>
            <div style={{ fontWeight: 800, marginTop: 'var(--spacing-xs)', color: 'var(--color-brand-primary)' }}>
              {correctAnswerText}
            </div>
          </div>
        )}

        <AppButton
          label={isCorrect ? STRINGS.btnNext : STRINGS.btnRetry}
          variant={isCorrect ? 'primary' : 'secondary'}
          onClick={onNext}
        />
      </div>
    </AppModal>
  );
};
