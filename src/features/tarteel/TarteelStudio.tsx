import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ALL_SURAHS_CATALOG, SurahMeta } from '../../core/data/surahs.catalog';
import { RECITERS } from '../../core/data/reciters.data';
import { Ayah } from '../../core/data/types';
import { QuranService } from '../../core/data/quran.service';
import { AudioPlayerService } from '../../core/audio/audio.player';
import { useAppStore } from '../../core/store/app.store';
import { STRINGS } from '../../core/strings/strings.constants';
import { SurahSelector } from './SurahSelector';
import { AudioToolbar } from './AudioToolbar';
import { HifzControlBar } from './HifzControlBar';
import { AyahCard } from './AyahCard';
import { TafseerDrawer } from './TafseerDrawer';
import { useHifzSession } from './useHifzSession';

export const TarteelStudio: React.FC = () => {
  const activeReciterId = useAppStore((s) => s.activeReciterId);
  const setActiveReciterId = useAppStore((s) => s.setActiveReciterId);

  const playerRef = useRef<AudioPlayerService | null>(null);
  const scrollParentRef = useRef<HTMLDivElement | null>(null);
  const isRepeatingRef = useRef(false);

  const [selectedSurah, setSelectedSurah] = useState<SurahMeta>(ALL_SURAHS_CATALOG[0]);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeAyahNum, setActiveAyahNum] = useState<number | null>(null);
  const [tafseerAyah, setTafseerAyah] = useState<Ayah | null>(null);
  const [isRepeating, setIsRepeating] = useState(false);

  isRepeatingRef.current = isRepeating;

  const virtualizer = useVirtualizer({
    count: ayahs.length,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => 185,
    overscan: 4,
  });

  const handleScrollToIndex = useCallback(
    (index: number) => {
      virtualizer.scrollToIndex(index, { align: 'center' });
    },
    [virtualizer]
  );

  const hifz = useHifzSession(ayahs, handleScrollToIndex);

  useEffect(() => {
    playerRef.current = new AudioPlayerService();
    return () => {
      playerRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    playerRef.current?.stop();
    setActiveAyahNum(null);
    hifz.stopListening();

    void QuranService.getAyahsForSurah(selectedSurah.number).then((list) => {
      if (!cancelled) {
        setAyahs(list);
        setLoading(false);
        scrollParentRef.current?.scrollTo({ top: 0 });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [selectedSurah, hifz.stopListening]);

  const reciter = RECITERS.find((r) => r.id === activeReciterId) || RECITERS[0];

  const handlePlayToggle = (ayah: Ayah) => {
    const player = playerRef.current;
    if (!player) return;

    if (activeAyahNum === ayah.ayahNumber) {
      player.stop();
      setActiveAyahNum(null);
      return;
    }

    setActiveAyahNum(ayah.ayahNumber);
    const url = `${reciter.baseUrl}/${ayah.audioFileName}`;
    player.onStateChange((st) => {
      if (st.status === 'completed') {
        if (isRepeatingRef.current) {
          void player.playUrl(url);
        } else {
          setActiveAyahNum(null);
        }
      }
    });
    void player.playUrl(url);
  };

  return (
    <div style={{ padding: 'var(--spacing-md)' }}>
      <SurahSelector selectedSurah={selectedSurah} onSelectSurah={setSelectedSurah} />

      <AudioToolbar
        activeReciterId={activeReciterId}
        onSelectReciter={setActiveReciterId}
        isRepeating={isRepeating}
        onToggleRepeat={() => setIsRepeating((prev) => !prev)}
      />

      <HifzControlBar
        mode={hifz.tarteelMode}
        isListening={hifz.isListening}
        speechSupported={hifz.speechSupported}
        liveTranscript={hifz.liveTranscript}
        micError={hifz.micError}
        hasMismatchFlash={Boolean(hifz.errorAyahKey)}
        onModeChange={hifz.setTarteelMode}
        onToggleListening={hifz.toggleListening}
        onHideAll={() =>
          hifz.hideAllInSurah(
            selectedSurah.number,
            ayahs.map((a) => a.ayahNumber)
          )
        }
        onRevealAll={() =>
          hifz.revealAllInSurah(
            selectedSurah.number,
            ayahs.map((a) => a.ayahNumber)
          )
        }
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)', fontWeight: 700 }}>
          {STRINGS.loadingSurah}
        </div>
      ) : (
        <div
          ref={scrollParentRef}
          style={{
            height: 'calc(100vh - 340px)',
            minHeight: '360px',
            overflowY: 'auto',
            paddingInlineEnd: '4px',
          }}
        >
          <div style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
            {virtualizer.getVirtualItems().map((vRow) => {
              const ayah = ayahs[vRow.index];
              if (!ayah) return null;
              const key = `${ayah.surahNumber}_${ayah.ayahNumber}`;
              const isRevealed = Boolean(hifz.revealedAyahs[key]);
              const isActiveTarget =
                hifz.tarteelMode === 'hifz' &&
                hifz.activeTargetAyah?.ayahNumber === ayah.ayahNumber;

              return (
                <div
                  key={key}
                  data-index={vRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${vRow.start}px)`,
                    paddingBottom: 'var(--spacing-md)',
                  }}
                >
                  <AyahCard
                    ayah={ayah}
                    isPlaying={activeAyahNum === ayah.ayahNumber}
                    isHifzMode={hifz.tarteelMode === 'hifz'}
                    isRevealed={isRevealed}
                    isActiveTarget={isActiveTarget}
                    hasError={hifz.errorAyahKey === key}
                    hintedWordsCount={hifz.hintedWordsMap[key] || 0}
                    fallbackVoiceActive={hifz.fallbackVoiceActive}
                    onPlayToggle={() => handlePlayToggle(ayah)}
                    onOpenTafseer={() => setTafseerAyah(ayah)}
                    onHintWord={() =>
                      hifz.hintNextWord(
                        ayah.surahNumber,
                        ayah.ayahNumber,
                        ayah.textUthmanic.trim().split(/\s+/).length
                      )
                    }
                    onRevealAyah={() => hifz.revealAyah(ayah.surahNumber, ayah.ayahNumber)}
                    onHideAyah={() => hifz.hideAyah(ayah.surahNumber, ayah.ayahNumber)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <TafseerDrawer ayah={tafseerAyah} onClose={() => setTafseerAyah(null)} />
    </div>
  );
};
