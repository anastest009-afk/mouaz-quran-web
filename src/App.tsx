import React, { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { AppHeader } from './core/ui/AppHeader';
import { AppNavShell, NavTab } from './features/navigation/AppNavShell';
import { TajweedStudio } from './features/learn/TajweedStudio';
import { TarteelStudio } from './features/tarteel/TarteelStudio';
import { QuizArena } from './features/quiz/QuizArena';
import { TreeGrowthWidget } from './features/gamification/TreeGrowthWidget';
import { useAppStore } from './core/store/app.store';
import { STRINGS } from './core/strings/strings.constants';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('learn');
  const themeMode = useAppStore((s) => s.themeMode);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    document.title = STRINGS.appName;
  }, []);

  const getTitle = () => {
    switch (currentTab) {
      case 'tarteel':
        return STRINGS.tarteelTitle;
      case 'quiz':
        return STRINGS.quizTitle;
      case 'progress':
        return STRINGS.treeTitle;
      default:
        return STRINGS.learnTitle;
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div style={{ maxWidth: '720px', margin: '0 auto', minHeight: '100vh', paddingBottom: '88px' }}>
        <AppHeader title={getTitle()} />
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {currentTab === 'learn' && <TajweedStudio />}
              {currentTab === 'tarteel' && <TarteelStudio />}
              {currentTab === 'quiz' && <QuizArena />}
              {currentTab === 'progress' && <TreeGrowthWidget />}
            </motion.div>
          </AnimatePresence>
        </main>
        <AppNavShell currentTab={currentTab} onTabChange={setCurrentTab} />
      </div>
    </MotionConfig>
  );
};
