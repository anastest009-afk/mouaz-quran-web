import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

export interface AppButtonProps {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'recording' | 'success' | 'subtle';
  disabled?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({
  label,
  icon: Icon,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  const getBgColor = () => {
    switch (variant) {
      case 'secondary':
        return 'var(--color-brand-secondary)';
      case 'recording':
        return 'var(--color-mic-recording)';
      case 'success':
        return 'var(--color-feedback-success)';
      case 'subtle':
        return 'var(--color-surface-subtle)';
      default:
        return 'var(--color-brand-primary)';
    }
  };

  const getTextColor = () =>
    variant === 'subtle' ? 'var(--color-text-primary)' : 'var(--color-text-inverse)';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      whileHover={disabled ? undefined : { y: -1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-sm)',
        minHeight: '48px',
        padding: '0 var(--spacing-lg)',
        backgroundColor: getBgColor(),
        color: getTextColor(),
        border: variant === 'subtle' ? '1.5px solid var(--color-surface-interactive)' : 'none',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-general)',
        fontSize: '1rem',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        boxShadow: '0 4px 12px var(--color-shadow-card)',
        width: '100%',
      }}
    >
      {Icon && <Icon size={20} />}
      <span>{label}</span>
    </motion.button>
  );
};
