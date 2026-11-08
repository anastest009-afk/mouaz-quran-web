import React from 'react';

export interface AppCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  borderColor?: string;
  active?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  onClick,
  borderColor,
  active = false,
}) => {
  const resolvedBorder = borderColor || (active ? 'var(--color-brand-primary)' : 'var(--color-surface-interactive)');

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--color-surface-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-md)',
        border: `2.5px solid ${resolvedBorder}`,
        transition: 'border-color 0.2s ease, transform 0.15s ease',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {children}
    </div>
  );
};
