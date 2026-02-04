import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Compass } from 'lucide-react-native';

import { useTheme } from '../theme/useTheme';
import { useStore } from '../store/useStore';
import { SPACING } from '../theme/spacing';

import HomeHeader from '../components/home/HomeHeader';
import LastReadCard from '../components/home/LastReadCard';
import JourneyStats from '../components/home/JourneyStats';
import DailyGoals from '../components/home/DailyGoals';
import AppText from '../components/common/AppText';

import ProgressService from '../services/ProgressService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  const settings = useStore(state => state.settings);

  // Progress state
  const [completionPercent, setCompletionPercent] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [pagesReadToday, setPagesReadToday] = useState(0);
  const [lastRead, setLastRead] = useState(null);

  const loadProgressData = async () => {
    try {
      const [percent, count, streakVal, pages, lastReadData] = await Promise.all([
        ProgressService.getCompletionPercentage(),
        ProgressService.getCompletedCount(),
        ProgressService.getStreak(),
        ProgressService.getTodayPages(),
        ProgressService.getLastRead(),
      ]);

      setCompletionPercent(percent);
      setCompletedCount(count);
      setStreak(streakVal);
      setPagesReadToday(pages);
      setLastRead(lastReadData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadProgressData();
    }, [])
  );

  const handleContinueReading = () => {
    if (lastRead && lastRead.surahId) {
      navigation.navigate('Quran', { surahId: lastRead.surahId });
    } else {
      // No last read, go to first surah
      navigation.navigate('Quran', { surahId: 1 });
    }
  };

  const handleExplore = () => {
    navigation.navigate('Explore');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader onProfilePress={() => navigation.navigate('Settings')} />

        <LastReadCard
          lastRead={lastRead}
          onResume={handleContinueReading}
        />

        <JourneyStats
          completionPercent={completionPercent}
          completedCount={completedCount}
          onViewDetails={() => navigation.navigate('Progress')}
        />

        <DailyGoals
          pagesReadToday={pagesReadToday}
          streak={streak}
          pageGoal={settings?.dailyPageGoal || 15}
        />

        {/* Explore Button */}
        <TouchableOpacity
          style={[styles.exploreCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleExplore}
          accessibilityRole="button"
          accessibilityLabel="Explore Quran"
        >
          <View style={styles.exploreLeft}>
            <View style={[styles.exploreIcon, { backgroundColor: colors.primary + '15' }]}>
              <Compass color={colors.primary} size={28} />
            </View>
            <View>
              <AppText style={[styles.exploreTitle, { color: colors.text }]}>Explore Quran</AppText>
              <AppText style={[styles.exploreSubtitle, { color: colors.textSecondary }]}>Browse all 114 Surahs</AppText>
            </View>
          </View>
          <AppText style={[styles.exploreArrow, { color: colors.primary }]}>→</AppText>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  exploreCard: {
    borderRadius: 16,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  exploreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  exploreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exploreSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  exploreArrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
