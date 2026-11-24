import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ALL_SURAHS_CATALOG, SurahMeta } from '../../core/data/surahs.catalog';
import { ArabicNormalizer } from '../../core/math/arabic.normalizer';
import { STRINGS } from '../../core/strings/strings.constants';

export interface SurahSelectorProps {
  selectedSurah: SurahMeta;
  onSelectSurah: (surah: SurahMeta) => void;
}

export const SurahSelector: React.FC<SurahSelectorProps> = ({ selectedSurah, onSelectSurah }) => {
  const [query, setQuery] = useState('');

  const filteredSurahs = useMemo(() => {
    const clean = ArabicNormalizer.normalizeArabic(query);
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return ALL_SURAHS_CATALOG;

    return ALL_SURAHS_CATALOG.filter((s) => {
      const arName = ArabicNormalizer.normalizeArabic(s.nameArabic);
      return (
        (clean && arName.includes(clean)) ||
        s.nameEnglish.toLowerCase().includes(trimmed) ||
        String(s.number) === trimmed
      );
    });
  }, [query]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          padding: 'var(--spacing-xs) var(--spacing-md)',
          backgroundColor: 'var(--color-surface-primary)',
          borderRadius: 'var(--radius-pill)',
          border: '1.5px solid var(--color-surface-interactive)',
        }}
      >
        <Search size={17} color="var(--color-text-muted)" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={STRINGS.searchSurah}
          aria-label={STRINGS.searchSurah}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-general)',
            fontSize: '0.92rem',
            fontWeight: 600,
            outline: 'none',
            width: '100%',
            padding: '4px 0',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          overflowX: 'auto',
          paddingBottom: 'var(--spacing-xs)',
        }}
      >
        {filteredSurahs.length === 0 ? (
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', padding: 'var(--spacing-xs)' }}>
            {STRINGS.noSurahFound}
          </span>
        ) : (
          filteredSurahs.map((s) => {
            const isSelected = s.number === selectedSurah.number;
            return (
              <button
                key={s.number}
                type="button"
                onClick={() => onSelectSurah(s)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  padding: 'var(--spacing-xs) var(--spacing-md)',
                  borderRadius: 'var(--radius-pill)',
                  border: isSelected
                    ? '1.5px solid var(--color-brand-primary)'
                    : '1.5px solid var(--color-surface-interactive)',
                  backgroundColor: isSelected
                    ? 'var(--color-brand-primary)'
                    : 'var(--color-surface-primary)',
                  color: isSelected ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
                  fontFamily: 'var(--font-general)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{s.number}.</span>
                <span>{s.nameArabic}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
