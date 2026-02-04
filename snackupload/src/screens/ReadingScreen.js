import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useStore } from '../store/useStore';
import { useTheme } from '../theme/useTheme';
import { useQuranData } from '../hooks/useQuranData';
import { useAudio } from '../hooks/useAudio';
import useBookmarkFavorite from '../hooks/useBookmarkFavorite';

import AyaItem from '../components/quran/AyaItem';
import ReadingHeader from '../components/quran/ReadingHeader';
import AudioPlayerBar from '../components/quran/AudioPlayerBar';
import MushafView from '../components/quran/MushafView';
import ContinuousView from '../components/quran/ContinuousView';
import { SPACING } from '../theme/spacing';
import { Settings, BookOpen } from 'lucide-react-native';

import ProgressService from '../services/ProgressService';

// Import translations
import QuranEn from '../data/QuranEn.json';
import QuranEs from '../data/QuranES.json';
import QuranFr from '../data/QuranFR.json';

const ReadingScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const settings = useStore(state => state.settings);
  const updateSetting = useStore(state => state.updateSetting);

  const { filteredData } = useQuranData();
  const { surahId } = route.params || {};
  const markedAyahsRef = useRef(new Set());

  const { playAudio, pauseAudio, isPlaying, currentAyaId, playNext, playPrev } = useAudio();
  const { bookmarked, favorites, toggleBookmark, toggleFavorite } = useBookmarkFavorite();

  // Mode state: 'Ayah' (default), 'Continuous', 'Mushaf'
  const mode = settings.readingStyle || 'Ayah';

  // Build translation map based on selected language
  const translationMap = useMemo(() => {
    const map = {};
    let activeData = QuranEn;

    if (settings.readingLanguage === 'es') {
      activeData = QuranEs;
    } else if (settings.readingLanguage === 'fr') {
      activeData = QuranFr;
    }

    activeData.forEach(item => {
      map[item.aya_id] = item.aya_eng;
    });
    return map;
  }, [settings.readingLanguage]);

  // Filter data for the specific Surah
  const surahContent = useMemo(() => {
    if (!surahId) return filteredData;
    return filteredData.filter(item => item.details.sura.toString() === surahId.toString());
  }, [filteredData, surahId]);

  const surahInfo = surahContent.length > 0
    ? surahContent[0].details
    : { name_eng: 'Quran', name: 'Al-Quran', type: 'Meccan', total_aya_by_sura: 0 };

  // Store surahId in ref for stable callback
  const surahIdRef = useRef(surahId);
  useEffect(() => {
    surahIdRef.current = surahId;
  }, [surahId]);

  // Mark ayahs as read when they become visible (FlashList only)
  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems || viewableItems.length === 0) return;

    viewableItems.forEach(({ item }) => {
      if (item && item.aya_id) {
        const ayaKey = item.aya_id.toString();

        if (!markedAyahsRef.current.has(ayaKey)) {
          markedAyahsRef.current.add(ayaKey);
          const suraId = item.details?.sura || surahIdRef.current;
          const ayaSuraId = item.details?.aya_sura_id || item.aya_id;

          ProgressService.markAyahComplete(suraId, ayaSuraId)
            .catch(err => console.error('Failed to mark ayah complete:', err));
        }
      }
    });
  }).current;

  // Viewability config
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 30,
  }).current;

  // Render Item for FlashList
  const renderItem = useCallback(({ item }) => {
    const isActive = item.aya_id === currentAyaId;
    const translationText = translationMap[item.aya_id] || null;

    return (
      <AyaItem
        aya={item}
        englishText={translationText} // Prop name 'englishText' kept for backward compatibility with AyaItem, but it now contains the selected translation
        onPlay={() => isActive && isPlaying ? pauseAudio() : playAudio(item)}
        isActive={isActive}
        onBookmark={(id) => toggleBookmark(id, item.details)}
        onFavorite={(id) => toggleFavorite(id)}
        isBookmarked={bookmarked.includes(item.aya_id)}
        isFavorited={favorites.includes(item.aya_id)}
      />
    );
  }, [currentAyaId, isPlaying, bookmarked, favorites, translationMap, playAudio, pauseAudio, toggleBookmark, toggleFavorite]);

  // Cycle modes
  const cycleMode = () => {
    const modes = ['Ayah', 'Continuous', 'Mushaf'];
    const currentIndex = modes.indexOf(mode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    updateSetting('readingStyle', nextMode);
  };

  // Cycle font sizes: 14, 18, 22, 26, 30
  const cycleFontSize = () => {
    const sizes = [14, 18, 22, 26, 30, 34];
    const currentSize = settings.fontSize || 18;
    const currentIndex = sizes.indexOf(currentSize);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    updateSetting('fontSize', nextSize);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top']}>
      <ReadingHeader
        title={`Surah ${surahInfo.name_eng?.trim() || 'Quran'}`}
        subtitle={`${(surahInfo.type || '').trim().toUpperCase()} • ${surahInfo.total_aya_by_sura || surahContent.length} VERSES`}
        mode={mode}
        onToggleMode={cycleMode}
        onToggleFontSize={cycleFontSize}
      />

      <View style={{ flex: 1 }}>
        {mode === 'Ayah' && (
          <FlashList
            data={surahContent}
            renderItem={renderItem}
            estimatedItemSize={200}
            keyExtractor={(item) => item.aya_id ? item.aya_id.toString() : Math.random().toString()}
            contentContainerStyle={{ paddingBottom: isPlaying || currentAyaId ? 100 : SPACING.xl }}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        )}

        {mode === 'Continuous' && (
          <ContinuousView data={surahContent} />
        )}

        {mode === 'Mushaf' && (
          <MushafView data={surahContent} />
        )}
      </View>

      {(isPlaying || currentAyaId) && (
        <AudioPlayerBar
          isPlaying={isPlaying}
          onPlayPause={() => isPlaying ? pauseAudio() : playAudio(null)}
          onNext={playNext}
          onPrev={playPrev}
          currentAyahLabel={`Ayah ${currentAyaId ? currentAyaId.toString().split(':')[1] || currentAyaId : ''}`}
          onClose={() => pauseAudio()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    zIndex: 10,
  },
  modeToggle: {
    position: 'absolute',
    right: 16,
    top: 16, // Adjust based on ReadingHeader layout
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)', // Semi-transparent backing
    borderRadius: 8,
    padding: 4,
  }
});

export default ReadingScreen;