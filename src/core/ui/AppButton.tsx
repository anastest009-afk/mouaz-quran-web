import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface AppButtonProps {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'recording' | 'success';
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
      case 'secondary': return 'var(--color-brand-secondary)';
      case 'recording': return 'var(--color-mic-recording)';
      case 'success': return 'var(--color-feedback-success)';
      default: return 'var(--color-brand-primary)';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-sm)',
        minHeight: '48px',
        padding: '0 var(--spacing-lg)',
        backgroundColor: getBgColor(),
        color: 'var(--color-text-inverse)',
        border: 'none',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-general)',
        fontSize: '1.1rem',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'transform 0.15s ease, opacity 0.15s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
      }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={(e) => !disabled && (e.currentTarget.style.transform = 'scale(1)')}
    >
      {Icon && <Icon size={22} />}
      <span>{label}</span>
    </button>
  );
};
