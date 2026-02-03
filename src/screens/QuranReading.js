import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { ChevronLeft, Info, Book } from 'lucide-react-native';

import { useSettings } from './SettingsContext';
import { useQuranData } from '../hooks/useQuranData';
import { useAudio } from '../hooks/useAudio';
import useBookmarkFavorite from '../hooks/useBookmarkFavorite';

import AyaItem from '../components/quran/AyaItem';
import SurahHeader from '../components/quran/SurahHeader';
import SearchBar from '../components/quran/SearchBar';
import WordByWordTranslation from '../components/quran/WordByWordTranslation';
import AppText from '../components/common/AppText';
import { SPACING } from '../theme/spacing';

const QuranReading = ({ navigation }) => {
  const { theme, isReady } = useSettings();
  const { filteredData, getTranslation, setSearchQuery, searchQuery } = useQuranData();
  const { playAudio, pauseAudio, isPlaying, currentAyaId } = useAudio();
  const { bookmarked, favorites, toggleBookmark, toggleFavorite } = useBookmarkFavorite();
  const [showTranslation, setShowTranslation] = useState(false);
  const [showWordByWord, setShowWordByWord] = useState(false);
  const [selectedAya, setSelectedAya] = useState(null);

  const handleShare = useCallback(async (aya) => {
    try {
      const text = `${aya.details.aya} ﴿${aya.details.aya_sura_id}﴾\n${aya.details.name_eng} (${aya.details.sura}:${aya.details.aya_sura_id})`;
      await Share.share({
        message: text,
        title: 'Quran Verse'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, []);

  const surahs = useMemo(() => {
    const data = [];
    const seen = new Set();
    filteredData.forEach(aya => {
      if (!seen.has(aya.details.sura)) {
        seen.add(aya.details.sura);
        data.push({
          type: 'HEADER',
          sura: aya.details.sura,
          number: aya.details.sura,
          name_eng: aya.details.name_eng,
          name: aya.details.name,
          id: `header-${aya.details.sura}`
        });
      }
      data.push({ type: 'AYA', ...aya });
    });
    return data;
  }, [filteredData]);

  const renderItem = useCallback(({ item }) => {
    if (item.type === 'HEADER') {
      return <SurahHeader surah={item} />;
    }

    return (
      <AyaItem
        aya={item}
        onPlay={() => item.id === currentAyaId && isPlaying ? pauseAudio() : playAudio(item)}
        onShare={() => handleShare(item)}
        onFavorite={() => toggleFavorite(item.id)}
        onBookmark={() => toggleBookmark(item.id)}
        onWordPress={(word) => {
          setSelectedAya(item);
          setShowWordByWord(true);
        }}
        isFavorite={favorites.includes(item.id)}
        isBookmarked={bookmarked.includes(item.id)}
        showTranslation={showTranslation}
        translation={getTranslation(item.details.sura, item.details.aya_sura_id)}
        onWordPress={(word) => console.log('Word pressed:', word)}
      />
    );
  }, [currentAyaId, isPlaying, favorites, bookmarked, showTranslation, playAudio, pauseAudio, toggleFavorite, toggleBookmark, getTranslation, handleShare]);

  if (!isReady) return null;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color="white" size={28} />
        </TouchableOpacity>
        <AppText style={{ color: 'white', fontWeight: 'bold' }}>Quran Reader</AppText>
        <TouchableOpacity 
          onPress={() => setShowTranslation(!showTranslation)}
          accessibilityLabel="Toggle translation view"
          accessibilityHint="Switch between verse and translation display"
        >
          <Info color={showTranslation ? theme.secondary : "white"} size={24} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setShowWordByWord(!showWordByWord)}
          accessibilityLabel="Toggle word-by-word analysis"
          accessibilityHint="Show detailed word analysis and morphology"
        >
          <Book color={showWordByWord ? theme.secondary : "white"} size={24} />
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search Surah or Aya..."
      />

      <View style={{ flex: 1 }}>
        <FlashList
          data={surahs}
          renderItem={renderItem}
          estimatedItemSize={150}
          keyExtractor={(item) => item.id.toString()}
          getItemType={(item) => item.type}
          contentContainerStyle={{ paddingBottom: SPACING.xl }}
        />
      </View>

      {showWordByWord && selectedAya && (
        <WordByWordTranslation
          aya={selectedAya}
          translation={getTranslation(selectedAya.details.sura, selectedAya.details.aya_sura_id)}
          onClose={() => {
            setShowWordByWord(false);
            setSelectedAya(null);
          }}
          onWordPress={(word) => {
            console.log('Word analysis:', word);
            // Could open word analysis modal or Tafsir
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    elevation: 4,
  },
});

export default QuranReading;