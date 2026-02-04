import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import AppText from '../components/common/AppText';
import SearchBar from '../components/quran/SearchBar';
import SurahListItem from '../components/quran/SurahListItem';
import { ArrowLeft, BookOpen } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import ProgressService from '../services/ProgressService';

// Surah Data
const surahData = require('../data/SurahInfo.json');

// Data is already unique and complete
const uniqueSurahData = surahData;

const ExploreScreen = () => {
  const { colors, theme, isDarkMode } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [surahProgress, setSurahProgress] = useState({}); // { surahId: { count, percent } }

  const loadProgress = async () => {
    const [percent, count, completedAyahs] = await Promise.all([
      ProgressService.getCompletionPercentage(),
      ProgressService.getCompletedCount(),
      ProgressService.getCompletedAyahs(),
    ]);
    setCompletionPercentage(percent);
    setCompletedCount(count);

    // Calculate per-surah progress
    const progress = {};
    completedAyahs.forEach(key => {
      const [surahId] = key.split(':');
      if (!progress[surahId]) {
        progress[surahId] = { count: 0 };
      }
      progress[surahId].count += 1;
    });

    // Calculate percentage for each surah
    uniqueSurahData.forEach(surah => {
      const id = surah.sura.toString();
      if (progress[id]) {
        progress[id].percent = Math.round((progress[id].count / surah.ayas) * 100);
      } else {
        progress[id] = { count: 0, percent: 0 };
      }
    });

    setSurahProgress(progress);
  };

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  const handleSurahSelect = (surah) => {
    navigation.navigate('Quran', {
      surahId: surah.sura,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return uniqueSurahData;
    const lower = searchQuery.toLowerCase();
    return uniqueSurahData.filter(item =>
      item.name_eng.toLowerCase().includes(lower) ||
      item.sura.toString().includes(lower) ||
      (item.name && item.name.includes(lower))
    );
  }, [searchQuery]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Header Top */}
      <View style={styles.topHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <ArrowLeft color={theme.text} size={24} />
          </TouchableOpacity>
          <BookOpen color={theme.primary} size={28} style={{ marginRight: 10 }} />
          <AppText style={[styles.screenTitle, { color: colors.text }]}>Explore Quran</AppText>
        </View>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search Surah name or number..."
      />

      {/* Progress Card */}
      <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.progressHeader}>
          <AppText style={[styles.progressTitle, { color: colors.primary }]}>YOUR PROGRESS</AppText>
          <AppText style={[styles.progressTitle, { color: colors.primary }]}>{completedCount} Ayahs Read</AppText>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: colors.highlight }]}>
          <View style={[styles.progressBar, { width: `${Math.min(completionPercentage, 100)}%`, backgroundColor: colors.primary }]} />
        </View>
        <View style={styles.progressFooter}>
          <AppText style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
            {completionPercentage > 0
              ? "Keep it up! You're making great progress."
              : "Start reading to track your progress!"
            }
          </AppText>
          <AppText style={[styles.percentText, { color: colors.primary }]}>{completionPercentage}%</AppText>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <FlashList
        data={filteredData}
        keyExtractor={(item) => item.sura.toString()}
        renderItem={({ item, index }) => {
          const surahId = item.sura.toString();
          const progressData = surahProgress[surahId] || { count: 0, percent: 0 };
          const isCompleted = progressData.percent >= 100;

          return (
            <SurahListItem
              surah={item}
              index={index}
              onPress={() => handleSurahSelect(item)}
              isCompleted={isCompleted}
              progress={progressData.percent}
              readCount={progressData.count}
            />
          );
        }}
        estimatedItemSize={80}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: SPACING.xxl }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  backBtn: {
    marginRight: SPACING.sm,
    padding: 4,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressCard: {
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progressTitle: {
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressSubtitle: {
    fontSize: 12,
  },
  percentText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ExploreScreen;
