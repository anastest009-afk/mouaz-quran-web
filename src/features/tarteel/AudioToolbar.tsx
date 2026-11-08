import React from 'react';
import { Repeat, UserCheck } from 'lucide-react';
import { RECITERS } from '../../core/data/reciters.data';
import { STRINGS } from '../../core/strings/strings.constants';

export interface AudioToolbarProps {
  activeReciterId: string;
  onSelectReciter: (id: string) => void;
  isRepeating: boolean;
  onToggleRepeat: () => void;
}

export const AudioToolbar: React.FC<AudioToolbarProps> = ({
  activeReciterId,
  onSelectReciter,
  isRepeating,
  onToggleRepeat,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        backgroundColor: 'var(--color-surface-primary)',
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid var(--color-surface-interactive)',
        marginBottom: 'var(--spacing-md)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
        <UserCheck size={18} color="var(--color-brand-primary)" />
        <select
          value={activeReciterId}
          onChange={(e) => onSelectReciter(e.target.value)}
          style={{
            border: 'none',
            fontFamily: 'var(--font-general)',
            fontWeight: 700,
            fontSize: '0.9rem',
            backgroundColor: 'transparent',
            color: 'var(--color-text-primary)',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {RECITERS.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={onToggleRepeat}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          backgroundColor: isRepeating ? 'var(--color-brand-primary)' : 'var(--color-surface-subtle)',
          color: isRepeating ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
          border: 'none',
          padding: 'var(--spacing-xs) var(--spacing-md)',
          borderRadius: 'var(--radius-pill)',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '0.85rem',
        }}
      >
        <Repeat size={16} />
        <span>{STRINGS.btnRepeat}</span>
      </button>
    </div>
  );
};
