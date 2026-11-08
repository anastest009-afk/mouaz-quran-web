import React, { useState, useEffect } from 'react';
import { ALL_SURAHS_CATALOG, SurahMeta } from '../../core/data/surahs.catalog';
import { RECITERS } from '../../core/data/reciters.data';
import { Ayah } from '../../core/data/types';
import { QuranService } from '../../core/data/quran.service';
import { AudioPlayerService } from '../../core/audio/audio.player';
import { AyahCard } from './AyahCard';
import { TafseerDrawer } from './TafseerDrawer';
import { AudioToolbar } from './AudioToolbar';

const player = new AudioPlayerService();

export const TarteelStudio: React.FC = () => {
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta>(ALL_SURAHS_CATALOG[0]);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [activeAyahNum, setActiveAyahNum] = useState<number | null>(null);
  const [tafseerAyah, setTafseerAyah] = useState<Ayah | null>(null);
  const [reciterId, setReciterId] = useState<string>(RECITERS[0].id);
  const [isRepeating, setIsRepeating] = useState(false);

  useEffect(() => {
    QuranService.getAyahsForSurah(selectedSurah.number).then(setAyahs);
    player.stop();
    setActiveAyahNum(null);
  }, [selectedSurah]);

  const reciter = RECITERS.find((r) => r.id === reciterId) || RECITERS[0];

  const handlePlayToggle = (ayah: Ayah) => {
    if (activeAyahNum === ayah.ayahNumber) {
      player.stop();
      setActiveAyahNum(null);
    } else {
      setActiveAyahNum(ayah.ayahNumber);
      const url = `${reciter.baseUrl}/${ayah.audioFileName}`;
      player.playUrl(url);

      player.onStateChange((st) => {
        if (st.status === 'completed') {
          if (isRepeating) {
            player.playUrl(url);
          } else {
            setActiveAyahNum(null);
          }
        }
      });
    }
  };

  return (
    <div style={{ padding: 'var(--spacing-md)' }}>
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', overflowX: 'auto', paddingBottom: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
        {ALL_SURAHS_CATALOG.map((s) => (
          <button
            key={s.number}
            onClick={() => setSelectedSurah(s)}
            style={{
              padding: 'var(--spacing-xs) var(--spacing-md)',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: s.number === selectedSurah.number ? 'var(--color-brand-primary)' : 'var(--color-surface-subtle)',
              color: s.number === selectedSurah.number ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {s.nameArabic}
          </button>
        ))}
      </div>

      <AudioToolbar
        activeReciterId={reciterId}
        onSelectReciter={setReciterId}
        isRepeating={isRepeating}
        onToggleRepeat={() => setIsRepeating(!isRepeating)}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {ayahs.map((ayah) => (
          <AyahCard
            key={ayah.ayahNumber}
            ayah={ayah}
            isPlaying={activeAyahNum === ayah.ayahNumber}
            onPlayToggle={() => handlePlayToggle(ayah)}
            onOpenTafseer={() => setTafseerAyah(ayah)}
          />
        ))}
      </div>

      <TafseerDrawer ayah={tafseerAyah} onClose={() => setTafseerAyah(null)} />
    </div>
  );
};
