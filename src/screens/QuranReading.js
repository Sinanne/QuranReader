// Imports and Initial Setup
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  Animated,
  TextInput,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

import FloatingBottomMenu from './FloatingBottomMenu';
import Themes, { getThemeStyles } from './Themes';
import useBookmarkFavorite from './BookmarkFavorite';
import SurahList from './SurahList';
import useAudioPlayer from './AudioPlayer';
import { useSettings } from './SettingsContext';

const quranData = require('../data/QuranData.json');
const translationData = require('../data/QuranEn.json');

// Component Definition and State Variables
const QuranReading = ({ navigation, route }) => {
  const { settings, applySettings } = useSettings();

  if (!settings) {
    return null;
  }

  // State variables
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [ayaStates, setAyaStates] = useState({});
  const [selectedAya, setSelectedAya] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [highlightedAya, setHighlightedAya] = useState(null);
  const [currentSurah, setCurrentSurah] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [played, setPlayed] = useState([]);
  const [shared, setShared] = useState([]);
  const [translated, setTranslated] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [notes, setNotes] = useState('');
  const [isQuranIconSelected, setIsQuranIconSelected] = useState(false);
  const [fontName, setFontName] = useState(settings.fontName || 'Amiri');

  // Custom Hooks and Handlers
    // Custom hooks
  const {
    favorites,
    bookmarked,
  } = useBookmarkFavorite();

  const { handlePlay } = useAudioPlayer();

  // Handlers
  const handleButtonPress = (button) => {
    setSelectedButton(button);
  };

  const handleNavigation = (screen) => {
    if (navigation) {
      navigation.navigate(screen);
    } else {
      console.warn('Navigation prop is not provided');
    }
  };
const toggleFavorite = (ayaId) => {
  setAyaStates((prev) => {
    const isFavorite = !prev[ayaId]?.favorite;
    const updatedAyaStates = {
      ...prev,
      [ayaId]: {
        ...prev[ayaId],
        favorite: isFavorite,
        timestamp: isFavorite ? new Date().toISOString() : prev[ayaId]?.timestamp,
      },
    };
    AsyncStorage.setItem('ayaStates', JSON.stringify(updatedAyaStates)); // Save to AsyncStorage
    return updatedAyaStates;
  });
};

const toggleBookmark = (ayaId) => {
  setAyaStates((prev) => {
    const updatedAyaStates = {
      ...prev,
      [ayaId]: {
        ...prev[ayaId],
        bookmarked: !prev[ayaId]?.bookmarked,
      },
    };
    AsyncStorage.setItem('ayaStates', JSON.stringify(updatedAyaStates)); // Save to AsyncStorage
    return updatedAyaStates;
  });
};
const saveNotes = (ayaId, notesText) => {
  const updatedAyaStates = {
    ...ayaStates,
    [ayaId]: {
      ...ayaStates[ayaId],
      notes: notesText,
    },
  };
  setAyaStates(updatedAyaStates);
  AsyncStorage.setItem('ayaStates', JSON.stringify(updatedAyaStates)); // Save to AsyncStorage
};

  const handleTranslationToggle = () => {
    setShowTranslation((prevState) => !prevState);
  };

  const saveComment = () => {
    if (selectedAya) {
      setAyaStates((prev) => ({
        ...prev,
        [selectedAya.details.aya]: {
          ...prev[selectedAya.details.aya],
          note: notes.trim(), // Save the trimmed note
        },
      }));

      setNotes(''); // Clear the note input
      setSelectedAya(null); // Reset selected Ayah
      setIsNotesModalVisible(false); // Close the modal
    }
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const totalHeight = contentSize.height - layoutMeasurement.height;
    const currentOffset = contentOffset.y;

    const progress = totalHeight > 0 ? currentOffset / totalHeight : 0;
    setScrollProgress(progress);
  };

  const getTextColor = () => {
    switch (currentTheme.backgroundColor) {
      case '#FFFFFF':
        return '#000000';
      default:
        return currentTheme.textColor;
    }
  };

  const currentTheme = Themes[settings.themeIndex];
  const themeStyles = getThemeStyles(currentTheme);

  const handleLongPress = (aya) => {
    setSelectedAya(aya);
    setModalVisible(true);
    setHighlightedAya(aya.id);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAya(null);
    setHighlightedAya(null);
    setNotes(''); // Reset notes field
    setIsNotesModalVisible(false); // Close modal
  };

  const handleThemeChange = (index) => {
    applySettings({ themeIndex: index });
  };

  const handleFontSizeChange = (size) => {
    applySettings({ fontSize: size });
  };

  const handleFontChange = (fontName) => {
    applySettings({ fontName });
  };

  const handleQuranIconClick = () => {
    setIsQuranIconSelected((prev) => !prev);
    navigation.navigate('QuranReadingAyaView');
  };

  const saveBookmarkWithoutNote = (ayaId) => {
    toggleBookmark(ayaId);
  };

  const removeBookmark = (ayaId) => {
    const updatedBookmarked = bookmarked.filter((id) => id !== ayaId);
    setBookmarked(updatedBookmarked);
    updateBookmarksInStorage(updatedBookmarked);
  };

  const handleShare = async (ayah) => {
    setShared((prevShared) =>
      prevShared.includes(ayah)
        ? prevShared.filter((item) => item !== ayah)
        : [...prevShared, ayah]
    );

    try {
      await Share.share({
        message: `${ayah.details.name_eng} (${ayah.details.sura}:${ayah.details.aya_sura_id}): '${ayah.details.aya}'\n\nShared from Tasneem app (link to the app)`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  // useEffect Hooks and Utility Functions

  // Load ayaStates from AsyncStorage when the component mounts
useEffect(() => {
  const loadAyaStates = async () => {
    try {
      const storedAyaStates = await AsyncStorage.getItem('ayaStates');
      if (storedAyaStates) {
        setAyaStates(JSON.parse(storedAyaStates));
      }
    } catch (error) {
      console.error('Error loading ayaStates from AsyncStorage:', error);
    }
  };

  loadAyaStates();
}, []);

// Save ayaStates to AsyncStorage whenever it changes
useEffect(() => {
  const saveAyaStates = async () => {
    try {
      await AsyncStorage.setItem('ayaStates', JSON.stringify(ayaStates));
    } catch (error) {
      console.error('Error saving ayaStates to AsyncStorage:', error);
    }
  };

  saveAyaStates();
}, [ayaStates]);

    useEffect(() => {
    if (!settings.fontName) {
      applySettings({ fontName: 'Amiri' });
    }
  }, [settings, applySettings]);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          Amiri: require('../../assets/fonts/Amiri-Regular.ttf'),
          Scheherazade: require('../../assets/fonts/Scheherazade-Regular.ttf'),
          Lateef: require('../../assets/fonts/Lateef-Regular.ttf'),
        });
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    }

    loadFonts();
  }, [settings]);

  const convertToArabicNumbers = (num) => {
    const arabicNumbers = {
      0: '٠',
      1: '١',
      2: '٢',
      3: '٣',
      4: '٤',
      5: '٥',
      6: '٦',
      7: '٧',
      8: '٨',
      9: '٩',
    };
    return num
      .toString()
      .split('')
      .map((digit) => arabicNumbers[digit])
      .join('');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const firstVisibleItem = viewableItems[0].item;
      setCurrentSurah(firstVisibleItem);
    }
  }).current;

  const getTranslation = (ayaId) => {
    if (!ayaId) {
      return 'Translation not available (no aya_id)';
    }

    const translation = translationData.find((item) => item.aya_id === ayaId);

    return translation ? translation.aya_eng : 'Translation not available';
  };

  const getTranslationAya = (sura, aya_sura_id) => {
    const translation = translationData.find(
      (item) => item.sura === sura && item.aya_sura_id === aya_sura_id
    );
    return translation ? translation.aya_eng : 'Translation not found';
  };

  const handleFavorite = (ayah) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(ayah)
        ? prevFavorites.filter((fav) => fav !== ayah)
        : [...prevFavorites, ayah]
    );
  };

  const handleBookmark = (ayah) => {
    setBookmarked((prevBookmarked) =>
      prevBookmarked.includes(ayah)
        ? prevBookmarked.filter((item) => item !== ayah)
        : [...prevBookmarked, ayah]
    );
  };

  const handleTranslate = (ayah) => {
    setTranslated((prevTranslated) =>
      prevTranslated.includes(ayah)
        ? prevTranslated.filter((item) => item !== ayah)
        : [...prevTranslated, ayah]
    );
  };

  // Main Component Return and Modals

   return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.backgroundColor },
      ]}>
      <View
        style={[
          styles.topContainer,
          currentTheme.backgroundColor === '#000000' &&
            themeStyles.topContainer,
          currentTheme.backgroundColor === '#F5F5DC' &&
            themeStyles.topContainer,
          currentTheme.backgroundColor === '#FFFFFF' &&
            themeStyles.topContainer,
        ]}>
        <Image
          source={{
            uri:
              currentTheme.backgroundColor === '#000000'
                ? 'https://freeislamiccalligraphy.com/wp-content/uploads/2013/06/Ash-Shams-Gold.jpg'
                : currentTheme.backgroundColor === '#F5F5DC'
                ? 'https://kuficstyle.com/files/preview/1280x853/11730935924vykkibrucqysysr4f9oogyvkwkv1suxbtzg6v1aqlhwttfjzzkshddcqdysxh9vevbhvtqbsv2dtfxfsb1yk2412h99zguhsapdg.png'
                : 'https://freeislamiccalligraphy.com/wp-content/uploads/2024/05/Ismael-Haqi-16-enhance-4x-V-1024x1008.png',
          }}
          style={{
            width: '100%',
            height: 100,
            marginTop: 50,
            marginBottom: 10,
          }}
          resizeMode="contain"
        />
      </View>

      {currentTheme.backgroundColor && (
        <View
          style={[
            styles.progressBarContainer,
            { backgroundColor: currentTheme.backgroundColor },
          ]}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${scrollProgress * 100}%`,
              },
              currentTheme.backgroundColor === '#000000' &&
                styles.darkThemeProgressBar,
              currentTheme.backgroundColor === '#F5F5DC' &&
                styles.sepiaThemeProgressBar,
              currentTheme.backgroundColor === '#FFFFFF' &&
                styles.lightThemeProgressBar,
            ]}
          />
        </View>
      )}
      {currentSurah && (
        <View
          style={[
            styles.fixedHeader,
            themeStyles.fixedHeader,
          ]}>
          <View style={styles.fixedHeaderRow}>
            <Text
              style={[
                styles.fixedHeaderText,
                themeStyles.fixedHeaderText
              ]}>
              {currentSurah.number}. {currentSurah.name_eng} (
              {currentSurah.total_aya})
            </Text>
            <Text
              style={[
                styles.fixedHeaderText,
                themeStyles.fixedHeaderTextArabic,
              ]}>
              {convertToArabicNumbers(currentSurah.number)}. {currentSurah.name}{' '}
              ({convertToArabicNumbers(currentSurah.total_aya)})
            </Text>
          </View>
        </View>
      )}
      <View style={styles.contentContainer}>
        {selectedAya && (
          <Modal
            transparent
            visible={isModalVisible}
            animationType="none"
            onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closeModal}>
                  <Icon name="close" size={22} color="#000" />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.modalAyaText,
                    { color: currentTheme.textColor },
                  ]}>
                  {selectedAya.details.aya}{' '}
                </Text>
                <View style={styles.modalDetails}>
                  <Text
                    style={[
                      styles.modalDetailText,
                      { color: currentTheme.textColor },
                    ]}>
                    {selectedAya.details.name_eng} [{selectedAya.details.sura}]{' '}
                    {selectedAya.details.name}
                  </Text>
                  <Text
                    style={[
                      styles.modalDetailText,
                      { color: currentTheme.textColor },
                    ]}>
                    Ayah n°{selectedAya.details.aya_sura_id}
                  </Text>
  
                </View>
                <View style={styles.modalIconsRow}>
               <FontAwesome
                name={
                  ayaStates[aya.id]?.favorite ? 'heart' : 'heart-o'}
                size={20}
                color={ayaStates[aya.id]?.favorite ? 'red' : 'grey'}
                onPress={() => toggleFavorite(aya.id)}
                style={styles.icon}
              />
                  <FontAwesome
                    name={
                      ayaStates[selectedAya.id]?.bookmarked
                        ? 'bookmark'
                        : 'bookmark-o'
                    }
                    size={20}
                    color={
                      ayaStates[selectedAya.id]?.bookmarked ? '#f39c12' : 'grey'
                    }
                    onPress={() => {
                      setIsNotesModalVisible(true);
                      toggleBookmark(selectedAya.id);
                    }}
                    style={styles.icon}
                  />
                  <FontAwesome
                    name="play"
                    size={20}
                    color={played.includes(selectedAya.id) ? '#800020' : 'grey'}
                    onPress={() => handlePlay(selectedAya.details)}
                    style={styles.icon}
                  />
                  <FontAwesome
                    name="share"
                    size={20}
                    color={shared.includes(selectedAya.id) ? '#800020' : 'grey'}
                    onPress={() => handleShare(selectedAya)}
                    style={styles.icon}
                  />
                  <FontAwesome
                    name="language"
                    size={20}
                    color={
                      translated.includes(selectedAya.id) ? '#800020' : 'grey'
                    }
                    onPress={() => handleTranslate(selectedAya.details)}
                    style={styles.icon}
                  />
                </View>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* Share Modal */}
        {isShareModalVisible && (
          <Modal
            transparent
            visible={isShareModalVisible}
            animationType="slide"
            onRequestClose={() => setIsShareModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.shareModalContent}>
                <Text style={styles.modalTitle}>Share Ayah</Text>
                {/* Add your sharing options here */}
                <TouchableOpacity
                  onPress={() => handleShare(selectedAya)}
                  style={styles.shareOption}>
                  <Text style={styles.shareOptionText}>Share via...</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsShareModalVisible(false)}
                  style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>

     {isNotesModalVisible && (
  <Modal
    transparent
    visible={isNotesModalVisible}
    animationType="slide"
    onRequestClose={() => setIsNotesModalVisible(false)}>
    <View style={styles.modalOverlay}>
      <View style={styles.notesModalContent}>
        {/* Close Button */}
        <TouchableOpacity onPress={() => setIsNotesModalVisible(false)} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.modalTitle}>Manage Bookmark & Note</Text>

        {/* Ayah Details */}
        <Text style={styles.surahDetails}>
          [{selectedAya.details.name_eng} ({selectedAya.details.sura}), Ayah {selectedAya.details.aya}]
        </Text>

        {/* Notes Input */}
        <TextInput
          style={styles.notesInput}
          placeholder="Enter your notes here..."
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          onChangeText={(text) => setNotes(text)}
          value={notes}
        />

        {/* Save Note Button */}
        <TouchableOpacity
          onPress={() => {
            saveNotes(selectedAya.details.aya, notes); // Save the note
            setIsNotesModalVisible(false); // Close the modal
          }}
          style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Note</Text>
        </TouchableOpacity>

        {/* Bookmark Without Note Button */}
        <TouchableOpacity
          onPress={() => {
            saveBookmarkWithoutNote(selectedAya.details.aya); // Bookmark without a note
            setIsNotesModalVisible(false); // Close the modal
          }}
          style={styles.bookmarkButton}>
          <Text style={styles.bookmarkButtonText}>Bookmark Without Note</Text>
        </TouchableOpacity>

        {/* Remove Bookmark Button */}
        <TouchableOpacity
          onPress={() => {
            removeBookmark(selectedAya.details.aya); // Remove the bookmark
            setIsNotesModalVisible(false); // Close the modal
          }}
          style={styles.removeBookmarkButton}>
          <Text style={styles.removeBookmarkButtonText}>Remove Bookmark</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}

      <SurahList
        settings={settings}
        handlePlay={handlePlay}
        handleShare={handleShare}
        handleTranslate={handleTranslate}
        handleLongPress={handleLongPress}
        toggleFavorite={toggleFavorite}
        toggleBookmark={toggleBookmark}
        setAyaStates={setAyaStates}
        ayaStates={ayaStates}
        favorites={favorites}
        bookmarked={bookmarked}
        played={played}
        shared={shared}
        translated={translated}
        showTranslation={showTranslation}
        getTranslation={getTranslation}
        getTranslationAya={getTranslationAya}
        currentTheme={currentTheme}
        convertToArabicNumbers={convertToArabicNumbers}
        setSelectedAya={setSelectedAya}
        setNotes={setNotes}
        setIsNotesModalVisible={setIsNotesModalVisible}
        currentSurah={currentSurah} // Pass currentSurah as a prop
        setCurrentSurah={setCurrentSurah} // Pass setCurrentSurah as a prop
        styles={styles} // Pass styles as a prop
      />
      {/* Theme Selection Modal */}
      <Modal
        transparent
        visible={isThemeModalVisible}
        animationType="slide"
        onRequestClose={() => setIsThemeModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.themeModalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsThemeModalVisible(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, styles.titleSpacing]}>
              ✦•• Reading Theme ••✦
            </Text>
            {['Light', 'Dark', 'Sepia'].map((theme, index) => (
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  themeStyles.themePopup,
                  settings.themeIndex === index && themeStyles.themePopupSelected,
                ]}
                onPress={() => {
                  handleThemeChange(index);
                  handleButtonPress('theme');
                }}>
                <Icon
                  name={
                    theme === 'Light'
                      ? 'sun-o'
                      : theme === 'Dark'
                      ? 'moon-o'
                      : 'adjust'
                  }
                  size={20}
                  color={settings.themeIndex === index ? '#FFFFFF' : '#555'}
                  style={styles.themeIcon}
                />
                <Text
                  style={[
                    styles.themeButtonText,
                    settings.themeIndex === index && themeStyles.themePopupSelected,
                  ]}>
                  {theme}
                </Text>
              </TouchableOpacity>
            ))}
            <Text style={[styles.modalTitle, styles.titleSpacing]}>
              ✦•• Font Size ••✦
            </Text>
            <View style={styles.fontSizeContainer}>
              {['Small', 'Medium', 'Large'].map((size, index) => (
                <TouchableOpacity
                  style={[
                    styles.fontSizeButton,
                    themeStyles.themePopup,
                    settings.fontSize === (index + 1) * 10 && themeStyles.themePopupSelected,
                  ]}
                  onPress={() => {
                    handleFontSizeChange((index + 1) * 10);
                    handleButtonPress('fontSize');
                  }}>
                  <Text
                    style={[
                      styles.fontSizeText,
                      { fontSize: (index + 1) * 10, fontWeight: 'bold' },
                      settings.fontSize === (index + 1) * 10 && themeStyles.themePopupSelected,
                    ]}>
                    A
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.modalTitle, styles.titleSpacing]}>
              ✦•• Font selection ┈••✦
            </Text>
            <View style={styles.fontContainer}>
              {[
                { name: 'Amiri', arabic: 'أميري' },
                { name: 'Scheherazade', arabic: 'شهرازاد' },
                { name: 'Lateef', arabic: 'لطيف' },
              ].map((font) => (
                <TouchableOpacity
                  style={[
                    styles.fontButton,
                    themeStyles.themePopup,
                    settings.fontName === font.name && themeStyles.themePopupSelected,
                  ]}
                  onPress={() => {
                    handleFontChange(font.name);
                    handleButtonPress('fontSelection');
                  }}>
                  <Text
                    style={[
                      styles.fontButtonText,
                      { fontFamily: font.name },
                      settings.fontName === font.name && themeStyles.themePopupSelected,
                    ]}>
                    {font.name}
                  </Text>
                  <Text
                    style={[
                      styles.fontButtonText,
                      { fontFamily: font.name },
                      settings.fontName === font.name && themeStyles.themePopupSelected,
                    ]}>
                    {font.arabic}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => setIsThemeModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FloatingBottomMenu
        onNavigate={handleNavigation}
        currentTheme={currentTheme}
        onThemePress={() => setIsThemeModalVisible(true)}
        onTranslationPress={handleTranslationToggle}
      />
    </View>
  );
};
      // Styles
      const styles = StyleSheet.create({
  modalCloseButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  container: {
    flex: 1,
    padding: 2,
    fontFamily: 'Amiri',
  },
  surahDetails: {
    fontSize: 12,
    color: '#FFF',
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 5,
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  progressBar: {
    height: '100%',
  },
  surahHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surahNameArabic: {
    fontSize: 26,
    writingDirection: 'rtl',
    alignSelf: 'center',
  },
  surahHeaderDetails: {
    fontSize: 16,
  },
  ayahsContainer: {
    padding: 10,
    zindex: 0,
  },
  ayahItem: {
    marginBottom: 10,
  },
  ayahText: {
    fontSize: 'Medium',
    lineHeight: 35,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 15,
    width: Dimensions.get('window').width * 0.8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  themeModalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 15,
    width: Dimensions.get('window').width * 0.8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleSpacing: {
    marginTop: 20,
    marginBottom: 10,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    width: 120,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  themeButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  themeIcon: {
    marginRight: 10,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  fontSizeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  fontSizeText: {
    fontWeight: 'bold',
  },
  fontContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  fontButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  fontButtonText: {
    fontSize: 16,
  },
  selectedButton: {
    backgroundColor: '#800020',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  modalAyaText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'Amiri',
  },
  modalDetails: {
    marginBottom: 20,
    alignItems: 'center',
  },
  modalDetailText: {
    fontSize: 14,
    color: '#666',
  },
  modalButtonText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  notesModalContent: {
    backgroundColor: '#800020',
    padding: 20,
    borderRadius: 15,
    width: Dimensions.get('window').width * 0.8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  notesInput: {
    width: '100%',
    height: 100,
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    textAlignVertical: 'top',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  fixedModalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
  },
  surahTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align items to the start
    alignItems: 'center', // Center vertically
    marginBottom: 5,
  },
  surahInfoContainer: {
    flexDirection: 'row', // Ensure text and timestamp are in a row
    alignItems: 'center', // Center vertically
    backgroundColor: '#800020',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  surahInfoText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Amiri',
    writingDirection: 'rtl',
  },
  timestampText: {
    fontSize: 10,
    color: '#999', // Light grey for subtle appearance
    marginLeft: 8, // Space between the sura info and timestamp
    fontFamily: 'sans-serif', // Standard font
    writingDirection: 'ltr', // Ensure the timestamp reads left-to-right
  },
  resultAya: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Amiri',
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#800020',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
    saveButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  noNoteButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  noNoteButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  removeBookmarkButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  removeBookmarkButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  shareModalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    width: Dimensions.get('window').width * 0.8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  shareOption: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  shareOptionText: {
    color: '#FFF',
    fontSize: 16,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  topContainer: {
    borderBottomWidth: 5,
    paddingBottom: 5,
  },
  lightThemeProgressBar: {
    backgroundColor: '#F0E68C',
  },
  darkThemeProgressBar: {
    backgroundColor: '#FFFFFF',
  },
  sepiaThemeProgressBar: {
    backgroundColor: '#800020',
  },
  fixedHeader: {
    position: 'absolute',
    top: 180,
    width: '85%',
    padding: 5,
    borderRadius: 10,
    alignSelf: 'center',
  },
  fixedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fixedHeaderText: {
    fontWeight: 'bold',
    fontFamily: 'Amiri',
    fontSize: 19,
  },

  contentContainer: {
    marginTop: 65,
  },
  bottomMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderRadius: 10,
    zIndex: 20,
  },
  bottomMenuBlur: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 30,
    zIndex: 20,
    backgroundColor: 'transparent',
  },
  circularButton: {
    width: 45,
    height: 45,
    borderRadius: 35,
    backgroundColor: 'rgba(128, 0, 32, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    zIndex: 22,
  },
  menuToggle: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(128, 0, 32, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 22,
  },
  ayahIconsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 7, // Space below the icons
  },
  modalIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    marginRight: 15, // Space between icons
  },
});

export default QuranReading;