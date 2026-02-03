import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  TextInput,
  Share,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Themes, {
  getThemeStyles,
} from './Themes'; // Import themes

const quranData = require('../data/QuranData.json');
const translationData = require('../data/QuranEn.json');
const SurahList = ({
  settings,
  handlePlay,
  handleShare,
  handleTranslate,
  handleLongPress,
  toggleFavorite,
  toggleBookmark,
  setAyaStates,
  ayaStates,
  favorites,
  bookmarked,
  played,
  shared,
  translated,
  showTranslation,
  getTranslation,
  getTranslationAya,
  currentTheme,
  convertToArabicNumbers,
  setSelectedAya,
  setNotes,
  setIsNotesModalVisible,
  currentSurah, // Accept currentSurah as a prop
  setCurrentSurah, // Accept setCurrentSurah as a prop
}) => {
  const [visibleSurahs, setVisibleSurahs] = useState(quranData.slice(0, 100));
  const [surahLimit, setSurahLimit] = useState(100);
  const flatListRef = useRef(null);
  const themeStyles = getThemeStyles(currentTheme);
  const handleLoadMore = () => {
    if (surahLimit < quranData.length) {
      const newLimit = surahLimit + 100;
      setVisibleSurahs(quranData.slice(0, newLimit));
      setSurahLimit(newLimit);
    }
  };

  const surahGroups = quranData.reduce((acc, aya) => {
    const surahId = aya.details.sura;
    if (!acc[surahId]) {
      acc[surahId] = {
        name: aya.details.name,
        number: aya.details.sura,
        name_eng: aya.details.name_eng,
        total_aya: aya.details.total_aya_by_sura,
        ayahs: [],
      };
    }
    acc[surahId].ayahs.push(aya);
    return acc;
  }, {});

  const surahList = Object.values(surahGroups);

  const renderSurah = ({ item }) => (
    <View style={styles.surahContainer}>
      {/* Surah Header */}
      <View
        style={[
          styles.surahHeader,
          currentTheme.backgroundColor === '#000000' &&
            themeStyles.themeSurahHeader,
          currentTheme.backgroundColor === '#F5F5DC' &&
            themeStyles.themeSurahHeader,
          currentTheme.backgroundColor === '#FFFFFF' &&
            themeStyles.themeSurahHeader,
        ]}>
        <View style={styles.surahHeaderRow}>
          <Text
            style={[
              styles.surahHeaderDetails,
              currentTheme.backgroundColor === '#000000' &&
               themeStyles.themeSurahHeaderText,
              currentTheme.backgroundColor === '#F5F5DC' &&
              themeStyles.themeSurahHeaderText,
              currentTheme.backgroundColor === '#FFFFFF' &&
               themeStyles.themeSurahHeaderText,
              { fontFamily: settings.fontName },
            ]}>
            {item.number}. {item.name_eng} ({item.total_aya})
          </Text>
          <Text
            style={[
              styles.surahNameArabic,
              { fontFamily: settings.fontName },
              currentTheme.backgroundColor === '#000000' &&
              themeStyles.themeSurahHeaderText,
              currentTheme.backgroundColor === '#F5F5DC' &&
              themeStyles.themeSurahHeaderText,
              currentTheme.backgroundColor === '#FFFFFF' &&
              themeStyles.themeSurahHeaderText,
            ]}>
            {convertToArabicNumbers(item.number)}. {item.name} (
            {convertToArabicNumbers(item.total_aya)})
          </Text>
        </View>
      </View>
      {/* Ayahs */}
      <View style={styles.ayahsContainer}>
        {item.ayahs.map((aya) => {
          const isFavorited = favorites.includes(aya.details.aya);
          const isBookmarked = bookmarked.includes(aya.details.aya);
          const isSelected = ayaStates[aya.details.aya]?.selected || false;

          return (
            <TouchableOpacity
              key={aya.id}
              onPress={() => {
                // Update states for the clicked Ayah, deselect all others
                setAyaStates((prev) => {
                  const newState = {};
                  Object.keys(prev).forEach((key) => {
                    newState[key] = { ...prev[key], selected: false }; // Deselect all
                  });
                  return {
                    ...newState,
                    [aya.details.aya]: {
                      ...prev[aya.details.aya],
                      selected: !isSelected, // Toggle selected state for the clicked Ayah
                    },
                  };
                });
              }}
              onLongPress={() => handleLongPress(aya)}
              delayLongPress={300}
              style={styles.ayahItem}>
              {(isSelected || isFavorited || isBookmarked) && (
                <View style={styles.ayahIconsRow}>
                  {/* Favorite Icon */}
                  <FontAwesome
                    name={isFavorited ? 'heart' : 'heart-o'}
                    size={16}
                    color={isFavorited ? 'red' : 'grey'}
                    onPress={() => toggleFavorite(aya.details.aya)}
                    style={styles.icon}
                  />

                  {/* Bookmark Icon */}
                  <FontAwesome
                    name={
                      ayaStates[aya.details.aya]?.bookmarked
                        ? 'bookmark'
                        : 'bookmark-o'
                    } // Filled or outline based on bookmark state
                    size={16}
                    color={
                      ayaStates[aya.details.aya]?.bookmarked
                        ? ayaStates[aya.details.aya]?.note
                          ? '#8B0000' // Dark red when a note exists
                          : '#f39c12' // Orange when bookmarked without a note
                        : 'grey' // Grey when not bookmarked
                    }
                    onPress={() => {
                      // This will toggle the bookmark state for the selected Ayah
                      toggleBookmark(aya.details.aya);

                      // Open the modal to edit notes
                      setSelectedAya(aya); // Set the selected Ayah
                      setNotes(ayaStates[aya.details.aya]?.note || ''); // Load existing note or empty
                      setIsNotesModalVisible(true); // Open the modal
                    }}
                    style={styles.icon}
                  />

                  {/* Other Icons (only for selected Ayah) */}
                  {isSelected && (
                    <>
                      <FontAwesome
                        name="play"
                        size={16}
                        color={
                          played.includes(aya.details.aya) ? '#800020' : 'grey'
                        }
                        onPress={() => handlePlay(aya.details)}
                        style={styles.icon}
                      />

                      <FontAwesome
                        name="share"
                        size={16}
                        color={
                          shared.includes(aya.details.aya) ? '#800020' : 'grey'
                        }
                        onPress={() => handleShare(aya)}
                        style={styles.icon}
                      />

                      <FontAwesome
                        name="language"
                        size={16}
                        color={
                          translated.includes(aya.details.aya)
                            ? '#800020'
                            : 'grey'
                        }
                        onPress={() => handleTranslate(aya.details.aya)}
                        style={styles.icon}
                      />
                    </>
                  )}
                </View>
              )}

              {/* Ayah Text */}
              <View style={{ backgroundColor: currentTheme.backgroundColor }}>
                <Text
                  style={[
                    styles.ayahText,
                    {
                      color: currentTheme.textColor,
                      fontFamily: settings.fontName,
                      fontSize: settings.fontSize,
                    },
                  ]}>
                  {aya.details.aya}{' '}
                  <Text
                    style={[
                      currentTheme.backgroundColor === '#000000' &&
                        styles.darkThemeAyahNumber,
                      currentTheme.backgroundColor === '#F5F5DC' &&
                        styles.sepiaThemeAyahNumber,
                      currentTheme.backgroundColor === '#FFFFFF' &&
                        styles.lightThemeAyahNumber,
                    ]}>
                    ﴿{aya.details.aya_sura_id}﴾
                  </Text>
                </Text>

{/* Conditional Translation Logic */}
{(() => {
  // Check if a specific translation for the clicked aya is requested
  const isSpecificAyaTranslated = translated.includes(aya.details.aya);

  // If a specific translation for this aya is selected, show that
  if (isSpecificAyaTranslated) {
    return (
      <Text
        style={[
          styles.translationText,
          {
            fontFamily: 'SF Pro', // Always use SF Pro for translation text
            fontSize: settings.fontSize - 3,
          },
        ]}
      >
        {getTranslationAya(aya.details.sura, aya.details.aya_sura_id)}
      </Text>
    );
  }

  // Otherwise, show the general translation for all ayates
  if (showTranslation) {
    const ayaId = aya.aya_id; // First method: Get the correct aya_id
    const sura = aya.details?.sura; // Second method: Get sura from details
    const ayaSuraId = aya.details?.aya_sura_id; // Second method: Get aya_sura_id from details

    if (ayaId) {
      // Fetch translation for this aya
      return (
        <Text
          style={[
            styles.translationText,
            {
              fontFamily: 'SF Pro', // Always use SF Pro for translation text
              fontSize: settings.fontSize - 3,
            },
          ]}
        >
          {getTranslation(ayaId)}
        </Text>
      );
    } else if (sura && ayaSuraId) {
      // Fallback: Fetch translation using sura and aya_sura_id
      return (
        <Text
          style={[
            styles.translationText,
            {
              fontFamily: 'SF Pro', // Always use SF Pro for translation text
              fontSize: settings.fontSize - 3,
            },
          ]}
        >
          {getTranslation(sura, ayaSuraId)}
        </Text>
      );
    } else {
      console.log('No valid identifiers found for this aya');
      return (
        <Text
          style={[
            styles.translationText,
            {
              fontFamily: 'SF Pro', // Always use SF Pro for translation text
              fontSize: settings.fontSize - 3,
            },
          ]}
        >
          {'Translation not available (no identifiers)'}
        </Text>
      );
    }
  }
  return null; // If no condition is met, return nothing
})()}

              
              </View>
              <View style={styles.separator} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const firstVisibleItem = viewableItems[0].item;
      setCurrentSurah(firstVisibleItem); // Update the currentSurah state
    }
  }).current;

  return (
    <FlatList
      ref={flatListRef}
      data={surahList}
      renderItem={renderSurah}
      keyExtractor={(item) => item.number.toString()}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      onViewableItemsChanged={onViewableItemsChanged} // Add this line
    />
  );
};

const styles = StyleSheet.create({
  surahContainer: {
    marginBottom: 5,
  },
  surahHeader: {
    padding: 5,
    marginBottom: 5,
    borderRadius: 1,
    overflow: 'hidden',
  },
  surahHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surahHeaderDetails: {
    fontSize: 16,
  },
  surahNameArabic: {
    fontSize: 26,
    writingDirection: 'rtl',
    alignSelf: 'center',
  },
  ayahsContainer: {
    padding: 10,
    zindex: 0,
  },
  ayahItem: {
    marginBottom: 10,
  },
  ayahText: {
    fontSize: 18,
    lineHeight: 35,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  darkThemeAyahNumber: {
    fontSize: 18,
    color: '#F0E68C',
  },
  sepiaThemeAyahNumber: {
    fontSize: 18,
    color: '#704214',
  },
  lightThemeAyahNumber: {
    fontSize: 18,
    color: '#800020',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  ayahIconsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 7, // Space below the icons
  },
  icon: {
    marginRight: 15, // Space between icons
  },
  translationText: {
    color: '#888',
    marginTop: 5,
  },
});

export default SurahList;
