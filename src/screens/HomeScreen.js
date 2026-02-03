import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, ImageBackground, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import StorageService from '../services/StorageService';

import { useSettings } from './SettingsContext';
import HomeHeader from '../components/home/HomeHeader';
import HomeMenu from '../components/home/HomeMenu';
import QuickAccess from '../components/home/QuickAccess';
import Card from '../components/common/Card';
import AppText from '../components/common/AppText';
import { SPACING } from '../theme/spacing';

const HomeScreen = ({ navigation }) => {
  const { theme, isReady } = useSettings();
  const [lastRead, setLastRead] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const surah = await StorageService.getLastReadSurah();
      const progress = await StorageService.getReadingProgress();
      if (surah) {
        setLastRead({
          surah,
          progress,
        });
      }
    } catch (e) {
      console.error('Failed to load home data', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (!isReady) return null;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        <HomeMenu
          onReadPress={() => navigation.navigate('Quran')}
          onProgressPress={() => navigation.navigate('Progress')}
        />

        {lastRead && (
          <Card style={styles.statusCard}>
            <AppText variant="caption" style={styles.statusText}>
              Last Read ✦ {lastRead.surah}
            </AppText>
            <AppText variant="caption" style={styles.statusText}>
              Total Progress ✦ {lastRead.progress}%
            </AppText>
          </Card>
        )}

        <QuickAccess navigation={navigation} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    justifyContent: 'center',
  },
  statusCard: {
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  statusText: {
    marginVertical: 2,
    fontStyle: 'italic',
  },
});

export default HomeScreen;
