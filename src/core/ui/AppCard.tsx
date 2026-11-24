import React from 'react';
import { motion } from 'motion/react';

export interface AppCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  borderColor?: string;
  active?: boolean;
  hasError?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  onClick,
  borderColor,
  active = false,
  hasError = false,
}) => {
  const resolvedBorder = hasError
    ? 'var(--color-feedback-alert)'
    : borderColor ||
      (active ? 'var(--color-brand-primary)' : 'var(--color-surface-interactive)');

  const resolvedBackground = hasError
    ? 'var(--color-alert-tint)'
    : active
      ? 'var(--color-surface-primary)'
      : 'var(--color-surface-primary)';

  return (
    <motion.div
      onClick={onClick}
      animate={hasError ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
      transition={hasError ? { duration: 0.36 } : { type: 'spring', stiffness: 360, damping: 28 }}
      whileHover={onClick ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      style={{
        backgroundColor: resolvedBackground,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-md)',
        border: `2px solid ${resolvedBorder}`,
        transition: 'border-color 0.2s ease, background-color 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: active
          ? '0 6px 18px var(--color-shadow-elevated)'
          : '0 2px 10px var(--color-shadow-card)',
      }}
    >
      {children}
    </motion.div>
  );
};
