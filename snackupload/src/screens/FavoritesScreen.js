import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react-native';

import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import AppText from '../components/common/AppText';
import useBookmarkFavorite from '../hooks/useBookmarkFavorite';

// Import Quran data to display favorite ayahs
import QuranData from '../data/QuranData.json';
import QuranEn from '../data/QuranEn.json';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const { favorites, toggleFavorite } = useBookmarkFavorite();
  const [favoriteAyahs, setFavoriteAyahs] = useState([]);

  // Build English map
  const englishMap = {};
  QuranEn.forEach(item => {
    englishMap[item.aya_id] = item.aya_eng;
  });

  // Filter favorites from full Quran data
  useEffect(() => {
    const filteredAyahs = QuranData.filter(aya =>
      favorites.includes(aya.aya_id)
    );
    setFavoriteAyahs(filteredAyahs);
  }, [favorites]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <AppText style={styles.badgeText}>
            {item.details?.name_eng?.trim()} • Ayah {item.details?.aya_sura_id}
          </AppText>
        </View>
        <TouchableOpacity
          onPress={() => toggleFavorite(item.aya_id)}
          style={styles.removeBtn}
        >
          <Trash2 size={18} color={COLORS.text.secondary} />
        </TouchableOpacity>
      </View>

      <AppText style={styles.arabicText}>
        {item.details?.aya}
      </AppText>

      {englishMap[item.aya_id] && (
        <AppText style={styles.translationText}>
          {englishMap[item.aya_id]}
        </AppText>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={COLORS.white} size={24} />
        </TouchableOpacity>
        <Heart color={COLORS.brand.primary} size={24} fill={COLORS.brand.primary} />
        <AppText style={styles.title}>Favorites</AppText>
      </View>

      {favoriteAyahs.length === 0 ? (
        <View style={styles.emptyState}>
          <Heart color={COLORS.text.secondary} size={48} />
          <AppText style={styles.emptyTitle}>No favorites yet</AppText>
          <AppText style={styles.emptySubtitle}>
            Tap the heart icon on any ayah to add it to your favorites
          </AppText>
        </View>
      ) : (
        <FlatList
          data={favoriteAyahs}
          keyExtractor={(item) => item.aya_id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: SPACING.lg }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: 12,
  },
  backBtn: {
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  card: {
    backgroundColor: COLORS.brand.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.brand.highlight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  badge: {
    backgroundColor: COLORS.brand.highlight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: COLORS.brand.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  removeBtn: {
    padding: 8,
  },
  arabicText: {
    color: COLORS.white,
    fontSize: 24,
    textAlign: 'right',
    lineHeight: 42,
    fontFamily: 'Amiri',
    marginBottom: SPACING.sm,
  },
  translationText: {
    color: COLORS.text.secondary,
    fontSize: 14,
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: SPACING.lg,
  },
  emptySubtitle: {
    color: COLORS.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});

export default FavoritesScreen;