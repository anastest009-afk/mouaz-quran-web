import React from 'react';
import { GraduationCap, BookOpen, Trophy, Trees } from 'lucide-react';
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
    { id: 'progress' as NavTab, label: STRINGS.navProgress, icon: Trees },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--color-surface-primary)',
        borderTop: '2px solid var(--color-surface-interactive)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: 'var(--spacing-sm) 0',
        zIndex: 50,
      }}
    >
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = currentTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-general)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.8rem',
            }}
          >
            <Icon size={24} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
