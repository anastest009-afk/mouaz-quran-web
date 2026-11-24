import React from 'react';
import { motion } from 'motion/react';
import { Award, BookOpen, GraduationCap, Trophy } from 'lucide-react';
import { STRINGS } from '../../core/strings/strings.constants';

export type NavTab = 'learn' | 'tarteel' | 'quiz' | 'progress';

export interface AppNavShellProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const AppNavShell: React.FC<AppNavShellProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'learn' as NavTab, label: STRINGS.navLearn, icon: GraduationCap },
    { id: 'tarteel' as NavTab, label: STRINGS.navTarteel, icon: BookOpen },
    { id: 'quiz' as NavTab, label: STRINGS.navQuiz, icon: Trophy },
    { id: 'progress' as NavTab, label: STRINGS.navProgress, icon: Award },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--color-surface-primary)',
        borderTop: '1.5px solid var(--color-surface-interactive)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 50,
        boxShadow: '0 -4px 16px var(--color-shadow-card)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          width: '100%',
          maxWidth: '720px',
          padding: 'var(--spacing-xs) var(--spacing-sm)',
        }}
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = currentTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-xs)',
                color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-general)',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.82rem',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  style={{
                    position: 'absolute',
                    inset: '2px 8px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary-tint)',
                    zIndex: 0,
                  }}
                />
              )}
              <Icon size={22} style={{ position: 'relative', zIndex: 1 }} />
              <span style={{ position: 'relative', zIndex: 1 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
