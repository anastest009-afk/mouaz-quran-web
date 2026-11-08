import React from 'react';
import { Ayah } from '../../core/data/types';
import { AppModal } from '../../core/ui/AppModal';
import { STRINGS } from '../../core/strings/strings.constants';

export interface TafseerDrawerProps {
  ayah: Ayah | null;
  onClose: () => void;
}

export const TafseerDrawer: React.FC<TafseerDrawerProps> = ({ ayah, onClose }) => {
  return (
    <AppModal title={STRINGS.tafseerTitle} isOpen={Boolean(ayah)} onClose={onClose}>
      {ayah && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-quran)', fontSize: '1.5rem', lineHeight: 2 }}>
            {ayah.textUthmanic}
          </div>
          <div
            style={{
              backgroundColor: 'var(--color-surface-subtle)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              lineHeight: 1.8,
              color: 'var(--color-text-secondary)',
            }}
          >
            {ayah.tafseerMuyassar}
          </div>
        </div>
      )}
    </AppModal>
  );
};
