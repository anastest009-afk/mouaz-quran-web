import React, { useState } from 'react';
import { AppHeader } from './core/ui/AppHeader';
import { AppNavShell, NavTab } from './features/navigation/AppNavShell';
import { TajweedStudio } from './features/learn/TajweedStudio';
import { TarteelStudio } from './features/tarteel/TarteelStudio';
import { QuizArena } from './features/quiz/QuizArena';
import { TreeGrowthWidget } from './features/gamification/TreeGrowthWidget';
import { StorageService } from './core/data/storage.service';
import { STRINGS } from './core/strings/strings.constants';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('learn');
  const stars = StorageService.getTotalStars();

  const getTitle = () => {
    switch (currentTab) {
      case 'tarteel': return STRINGS.tarteelTitle;
      case 'quiz': return STRINGS.quizTitle;
      case 'progress': return STRINGS.treeTitle;
      default: return STRINGS.learnTitle;
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '100vh', paddingBottom: '70px' }}>
      <AppHeader title={getTitle()} starsCount={stars} />
      <main>
        {currentTab === 'learn' && <TajweedStudio />}
        {currentTab === 'tarteel' && <TarteelStudio />}
        {currentTab === 'quiz' && <QuizArena />}
        {currentTab === 'progress' && <TreeGrowthWidget />}
      </main>
      <AppNavShell currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};
