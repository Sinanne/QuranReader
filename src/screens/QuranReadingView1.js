//  Imports and Initial Setup
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Share,
  FlatList,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useSettings } from './SettingsContext'; // Ensure you have this context
import { Audio } from 'expo-av';
import Themes, {
  getThemeStyles,
  getThemeTextStyles,
  getFixedHeaderBackgroundColor,
} from './Themes'; // Import themes
import DropDownPicker from 'react-native-dropdown-picker'; // Import DropDownPicker
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const quranData = require('../data/QuranData.json'); // Your local JSON file
const translationData = require('../data/QuranEn.json'); // Your translation JSON file
const TOTAL_AYAH = quranData.length;

// Component and State Variables

const QuranReadingAyaView = ({ navigation }) => {
  // State variables
  const { settings, applySettings } = useSettings();
  const [currentAyaIndex, setCurrentAyaIndex] = useState(0); // To track the current aya
  const [likedAyas, setLikedAyas] = useState([]); // Keep track of liked ayahs
  const [bookmarkedAyas, setBookmarkedAyas] = useState([]); // Keep track of bookmarked ayahs
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedAya, setSelectedAya] = useState(null);
  const [played, setPlayed] = useState([]);
  const [shared, setShared] = useState([]);
  const [translated, setTranslated] = useState([]);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [sound, setSound] = useState(null);
  const [isFavBookmarkModalVisible, setIsFavBookmarkModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' or 'bookmarks'
  const [ayaStates, setAyaStates] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
 const [selectedSura, setSelectedSura] = useState(''); // State for the selected sura
  const [open, setOpen] = useState(false); // State for dropdown open/close
  const suraList = [...new Set(quranData.map((aya) => aya.details.name_eng))]; // Extract unique suras
  const [selectedLanguage, setSelectedLanguage] = useState('EN'); // Default to English
  const [translationData, setTranslationData] = useState(require('../data/QuranEn.json')); // Default translation

    // Load fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'SF Pro': require('../../assets/fonts/SF-Pro-Display-Regular.otf'),
          Amiri: require('../../assets/fonts/Amiri-Regular.ttf'),
        });
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    }
    loadFonts();
  }, []);

useEffect(() => {
  if (currentAya && currentAya.details) {
    setSelectedSura(currentAya.details.name_eng);
  }
}, [currentAya]);
  // Navigation functions
  const nextAya = () => {
    if (currentAyaIndex < TOTAL_AYAH - 1) {
      setCurrentAyaIndex(currentAyaIndex + 1);
    }
  };

  const previousAya = () => {
    if (currentAyaIndex > 0) {
      setCurrentAyaIndex(currentAyaIndex - 1);
    }
  };

  const currentAya = quranData[currentAyaIndex]; // Get current aya data

    // Toggle like function
  const toggleLike = () => {
    setLikedAyas(
      (prev) =>
        prev.includes(currentAyaIndex)
          ? prev.filter((index) => index !== currentAyaIndex) // Remove if already liked
          : [...prev, currentAyaIndex] // Add if not liked
    );
  };

  // Handle language selection
  const handleLanguageSelect = (language) => {
    let data;
    switch (language) {
      case 'FR':
        data = require('../data/QuranFR.json');
        break;
      case 'ES':
        data = require('../data/QuranES.json');
        break;
      case 'PT':
        data = require('../data/QuranPT.json');
        break;
      case 'CN':
        data = require('../data/QuranCN.json');
        break;
      default:
        data = require('../data/QuranEn.json');
    }
    setTranslationData(data);
    setSelectedLanguage(language);
    setLanguageModalVisible(false); // Close the modal
  };

  // Toggle bookmark function
  const toggleBookmark = () => {
    setBookmarkedAyas(
      (prev) =>
        prev.includes(currentAyaIndex)
          ? prev.filter((index) => index !== currentAyaIndex) // Remove if already bookmarked
          : [...prev, currentAyaIndex] // Add if not bookmarked
    );
  };

    // Handle play function
  const handlePlay = async (ayaDetails) => {
    console.log('Play button pressed for Aya Details:', ayaDetails);
    if (!ayaDetails) {
      console.error('Aya details are missing. Exiting play handler.');
      return;
    }

    const sura = ayaDetails.sura.toString().padStart(3, '0');
    const aya = ayaDetails.aya_sura_id.toString().padStart(3, '0');

    const audioPath = `https://everyayah.com/data/Alafasy_64kbps/${sura}${aya}.mp3`;
    console.log('Audio URL:', audioPath);

    try {
      // Unload the previous sound
      if (sound) {
        console.log('Unloading existing sound...');
        await sound.unloadAsync();
        setSound(null);
      }

      // Create and load the new sound
      console.log('Creating a new audio instance...');
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioPath },
        { shouldPlay: true } // Automatically start playback
      );

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false); // Set playing state to false when audio finishes
        }
      });

      setSound(newSound);
      setIsPlaying(true); // Set playing state to true
      console.log('Audio successfully loaded. Starting playback...');
    } catch (error) {
      console.error('Error during audio playback:', error);
    }
  };

  // Handle pause function
  const handlePause = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false); // Set playing state to false
    }
  };

    // Handle share function
  const handleShare = async (ayah) => {
    try {
      let message = `${ayah.details.name_eng} (${ayah.details.sura}:${ayah.details.aya_sura_id}): '${ayah.details.aya}'\n\nShared from Tasneem app (link to the app)`;
      if (translated.includes(currentAyaIndex)) {
        const translation = getTranslationAya(
          ayah.details.sura,
          ayah.details.aya_sura_id
        );
        message += `\n\n${selectedLanguage} translation: "${translation}"`;
      }
      await Share.share({
        message: message,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle translate function
  const handleTranslate = (ayah) => {
    setTranslated((prevTranslated) =>
      prevTranslated.includes(currentAyaIndex)
        ? prevTranslated.filter((item) => item !== currentAyaIndex)
        : [...prevTranslated, currentAyaIndex]
    );
  };

  // Get translation for a specific aya
  const getTranslationAya = (sura, aya_sura_id) => {
    const translation = translationData.find(
      (item) => item.sura === sura && item.aya_sura_id === aya_sura_id
    );
    return translation ? translation.aya_eng : 'Translation not found';
  };

  const isLiked = likedAyas.includes(currentAyaIndex); // Check if current aya is liked
  const isBookmarked = bookmarkedAyas.includes(currentAyaIndex); // Check if current aya is bookmarked

    // Close modal function
  const closeModal = () => {
    setModalVisible(false);
    setSelectedAya(null);
  };

  // Handle theme change
  const handleThemeChange = (index) => {
    applySettings({ themeIndex: index });
  };

  // Handle font size change
  const handleFontSizeChange = (size) => {
    applySettings({ fontSize: size });
  };

  // Handle font change
  const handleFontChange = (fontName) => {
    applySettings({ fontName });
  };

  // Toggle favorite/bookmark modal
  const toggleFavBookmarkModal = () => {
    setIsFavBookmarkModalVisible((prev) => !prev);
  };


  // Render favorite/bookmark list
  const renderFavBookmarkList = () => {
    const data = activeTab === 'favorites' ? likedAyas : bookmarkedAyas;

    // Map and group data to extract relevant details
    const groupedData = data
      .map((ayaIndex) => {
        const ayah = quranData[ayaIndex];
        return ayah
          ? { ...ayah.details, timestamp: ayaStates[ayaIndex]?.timestamp }
          : null;
      })
      .filter(Boolean);

    return (
      <FlatList
        data={groupedData}
        keyExtractor={(item) => `${item.sura}-${item.aya_sura_id}`}
        renderItem={({ item }) => (
          <View style={styles.surahContainer}>
            {/* Top Section: Surah Info and Timestamp */}
            <View style={styles.surahTopRow}>
              <View style={styles.surahInfoContainer}>
                <Text style={styles.surahInfoText}>
                  {item.sura}:{item.aya_sura_id}
                </Text>
              </View>
              {item.timestamp && (
                <Text style={styles.timestampText}>{item.timestamp}</Text>
              )}
            </View>

            {/* Ayah Text */}
            <Text style={styles.resultAya}>{item.aya}</Text>
          </View>
        )}
      />
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  const currentTheme = Themes[settings.themeIndex];
  const themeStyles = getThemeStyles(currentTheme);
  const themeTextStyles = getThemeTextStyles(currentTheme);

    return (
  <View style={{ flex: 1 }}>
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.backgroundColor },
      ]}
    >
      <View
        style={[
          styles.header,
          themeStyles,
        getFixedHeaderBackgroundColor(currentTheme),
        ]}
      >
        <Text style={[styles.surahName, themeTextStyles]}>
          ✧. {currentAya.details.name_eng} - {currentAya.details.name} .✧
        </Text>
        <View style={styles.centeredText}>
          <Text style={[styles.surahDetails, themeTextStyles]}>
            Juz {currentAya.details.juz}
          </Text>
          <Text style={styles.separator}>|</Text>
          <Text style={[styles.surahDetails, themeTextStyles]}>
            Hizb {currentAya.details.hizb}
          </Text>
        </View>
        <View style={styles.centeredText}>
          <Text style={[styles.surahDetails, themeTextStyles]}>
            Surah {currentAya.details.sura}
          </Text>
          <Text style={styles.separator}>|</Text>
          <Text style={[styles.surahDetails, themeTextStyles]}>
            Aya {currentAya.details.aya_sura_id}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Dropdown for Sura Selection */}
        <DropDownPicker
          open={open}
          value={selectedSura}
          items={suraList.map((sura, index) => ({
            label: `${index + 1}. ${sura} (${quranData.filter(aya => aya.details.name_eng === sura).length}) ${quranData.find(aya => aya.details.name_eng === sura).details.name}`,
            value: sura,
          }))}
          setOpen={setOpen}
          setValue={setSelectedSura}
          placeholder="Select a Sura"
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          dropDownContainerStyle={themeStyles.dropDownContainer}
          selectedItemContainerStyle={themeStyles.selectedItemContainer}
          selectedItemLabelStyle={themeStyles.selectedItemLabel}
          tickIconStyle={themeStyles.tickIcon}
          labelStyle={themeStyles.labelStyle}
          textStyle={styles.textStyle}
        />

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            onPress={previousAya}
            style={[styles.navButton, themeStyles.navButton]}
          >
            <Icon name="arrow-left" size={20} style={themeStyles.navButtonText} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={nextAya}
            style={[styles.navButton, themeStyles.navButton]}
          >
            <Icon name="arrow-right" size={20} style={themeStyles.navButtonText} />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.ayaBox,
            themeStyles.ayahBox, // Apply theme shadow color
            {
              backgroundColor: currentTheme.backgroundColor,
              borderColor:
                currentTheme.backgroundColor === '#F5F5DC' ? '#704214' : '#000',
            },
          ]}
        >
          <Text
            style={[
              styles.ayaText,
              {
                color: currentTheme.textColor,
                fontSize: settings.fontSize,
                fontFamily: settings.fontName,
              },
            ]}
          >
            {currentAya.details.aya}{' '}
            <Text style={themeStyles.ayahNumber}>
              ﴿{currentAya.details.aya_sura_id}﴾
            </Text>
          </Text>
          {translated.includes(currentAyaIndex) && (
            <View style={styles.translationContainerWrapper}>
              <View style={styles.translationContainer}>
                <Text style={styles.translationText}>
                  {getTranslationAya(
                    currentAya.details.sura,
                    currentAya.details.aya_sura_id
                  )}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.languageCodeContainer,
                  themeStyles.languageCodeContainer,
                ]}
                onPress={() => setLanguageModalVisible(true)}
              >
                <Text style={themeStyles.languageCodeText}>
                  {selectedLanguage}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.iconsContainer}>
          <TouchableOpacity
            onPress={toggleLike}
            style={[styles.iconButton, themeStyles.iconButton]}
          >
            <Icon
              name={isLiked ? 'heart' : 'heart-o'}
              size={30}
              style={[isLiked ? themeStyles.activeIcon : themeStyles.icon]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleBookmark}
            style={[styles.iconButton, themeStyles.iconButton]}
          >
            <Icon
              name={isBookmarked ? 'bookmark' : 'bookmark-o'}
              size={30}
              style={[isBookmarked ? themeStyles.activeIcon : themeStyles.icon]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (isPlaying) {
                handlePause();
              } else {
                handlePlay(currentAya.details);
              }
            }}
            style={[styles.iconButton, themeStyles.iconButton]}
          >
            <Icon
              name={isPlaying ? 'stop' : 'play'}
              size={30}
              style={[isPlaying ? themeStyles.activeIcon : themeStyles.icon]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleShare(currentAya)}
            style={[styles.iconButton, themeStyles.iconButton]}
          >
            <Icon
              name="share"
              size={30}
              style={[
                shared.includes(currentAyaIndex)
                  ? themeStyles.activeIcon
                  : themeStyles.icon,
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTranslate(currentAya.details)}
            style={[styles.iconButton, themeStyles.iconButton]}
          >
            <Icon
              name="language"
              size={30}
              style={[
                translated.includes(currentAyaIndex)
                  ? themeStyles.activeIcon
                  : themeStyles.icon,
              ]}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
    <View style={[styles.fixedBottomMenu, themeStyles.bottomMenu]}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home" size={24} style={themeStyles.menuButtonText} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('QuranReading')}
      >
        <Icon name="book" size={24} style={themeStyles.menuButtonText} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('SurahSelection')}
      >
        <Icon name="th-list" size={24} style={themeStyles.menuButtonText} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setIsThemeModalVisible(true)}
      >
        <Icon
          name="paint-brush"
          size={24}
          style={themeStyles.menuButtonText}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={toggleFavBookmarkModal}
      >
        <Icon name="star" size={24} style={themeStyles.menuButtonText} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('SearchPage')}
      >
        <Icon name="search" size={24} style={themeStyles.menuButtonText} />
      </TouchableOpacity>
    </View>

    {/* Modals */}
    {selectedAya && (
      <Modal
        transparent
        visible={isModalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalAyaText, { color: '#333' }]}>
              {selectedAya.details.aya}{' '}
            </Text>
            <View style={styles.modalDetails}>
              <Text style={[styles.modalDetailText, { color: '#666' }]}>
                {selectedAya.details.name_eng} [{selectedAya.details.sura}]{' '}
                {selectedAya.details.name}
              </Text>
              <Text style={[styles.modalDetailText, { color: '#666' }]}>
                Ayah n°{selectedAya.details.aya_sura_id}
              </Text>
            </View>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                onPress={() => {
                  toggleBookmark(selectedAya.id);
                }}
                style={styles.modalButton}
              >
                <Icon
                  name={
                    bookmarkedAyas.includes(selectedAya.id)
                      ? 'bookmark'
                      : 'bookmark-o'
                  }
                  size={20}
                  color={
                    bookmarkedAyas.includes(selectedAya.id)
                      ? '#800020'
                      : '#555'
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => toggleLike(selectedAya.id)}
                style={styles.modalButton}
              >
                <Icon
                  name={
                    likedAyas.includes(selectedAya.id) ? 'heart' : 'heart-o'
                  }
                  size={20}
                  color={
                    likedAyas.includes(selectedAya.id) ? '#800020' : '#555'
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleShare(selectedAya)}
                style={styles.modalButton}
              >
                <Icon name="share-alt" size={20} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleTranslate(selectedAya.details)}
                style={styles.modalButton}
              >
                <Icon
                  name="language"
                  size={20}
                  color={
                    translated.includes(selectedAya.id) ? '#800020' : '#555'
                  }
                />
              </TouchableOpacity>
            </View>
            {translated.includes(selectedAya?.details?.aya) && (
              <View style={styles.translationContainerWrapper}>
                <View
                  style={[
                    styles.translationContainer,
                    currentTheme.backgroundColor === '#F5F5DC' && {
                      backgroundColor: '#F0E68C',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.translationText,
                      currentTheme.backgroundColor === '#F5F5DC' && {
                        color: '#704214',
                      },
                    ]}
                  >
                    {getTranslationAya(
                      currentAya.details.sura,
                      currentAya.details.aya_sura_id
                    )}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.languageCodeContainer,
                    themeStyles.languageCodeContainer,
                  ]}
                  onPress={() => setLanguageModalVisible(true)}
                >
                  <Text style={themeStyles.languageCodeText}>
                    {selectedLanguage}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )}
    <Modal
      transparent
      visible={languageModalVisible}
      animationType="slide"
      onRequestClose={() => setLanguageModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.languageModalContent}>
          {['EN', 'FR', 'ES', 'PT', 'CN'].map((language) => (
            <TouchableOpacity
              key={language}
              style={styles.languageOption}
              onPress={() => handleLanguageSelect(language)}
            >
              <Text
                style={[
                  styles.languageOptionText,
                  selectedLanguage === language && styles.activeLanguage,
                ]}
              >
                {language}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setLanguageModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    <Modal
      transparent
      visible={isThemeModalVisible}
      animationType="slide"
      onRequestClose={() => setIsThemeModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.themeModalContent}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setIsThemeModalVisible(false)}
          >
            <Icon name="times" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, styles.titleSpacing]}>
            ✦•• Reading Theme ••✦
          </Text>
          {['Light', 'Dark', 'Sepia'].map((theme, index) => (
            <TouchableOpacity
              key={theme}
              style={[
                styles.themeButton,
                themeStyles.themePopup,
                settings.themeIndex === index &&
                  themeStyles.themePopupSelected,
              ]}
              onPress={() => handleThemeChange(index)}
            >
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
                  settings.themeIndex === index &&
                    themeStyles.themePopupSelected,
                ]}
              >
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
                key={size}
                style={[
                  styles.fontSizeButton,
                  themeStyles.themePopup,
                  settings.fontSize === (index + 1) * 10 &&
                    themeStyles.themePopupSelected,
                ]}
                onPress={() => handleFontSizeChange((index + 1) * 10)}
              >
                <Text
                  style={[
                    styles.fontSizeText,
                    { fontSize: (index + 1) * 10, fontWeight: 'bold' },
                    settings.fontSize === (index + 1) * 10 &&
                      themeStyles.themePopupSelected,
                  ]}
                >
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
                key={font.name}
                style={[
                  styles.fontButton,
                  themeStyles.themePopup,
                  settings.fontName === font.name &&
                    themeStyles.themePopupSelected,
                ]}
                onPress={() => handleFontChange(font.name)}
              >
                <Text
                  style={[
                    styles.fontButtonText,
                    { fontFamily: font.name },
                    settings.fontName === font.name &&
                      themeStyles.themePopupSelected,
                  ]}
                >
                  {font.name}
                </Text>
                <Text
                  style={[
                    styles.fontButtonText,
                    { fontFamily: font.name },
                    settings.fontName === font.name &&
                      themeStyles.themePopupSelected,
                  ]}
                >
                  {font.arabic}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
        </View>
      </View>
    </Modal>
    <Modal
      visible={isFavBookmarkModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={toggleFavBookmarkModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.favBookmarkModalContent}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={toggleFavBookmarkModal}
          >
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'favorites' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('favorites')}
            >
              <Text style={styles.tabText}>Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'bookmarks' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('bookmarks')}
            >
              <Text style={styles.tabText}>Bookmarks</Text>
            </TouchableOpacity>
          </View>
          {/* Render Favorites or Bookmarks List */}
          {renderFavBookmarkList()}
        </View>
      </View>
    </Modal>
  </View>
);
};

// Style

const styles = StyleSheet.create({
  /// Top container - fixed header
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 10,
    alignItems: 'center',
  },
  surahName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Amiri',
  },
  centeredText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    marginHorizontal: 1,
    color: '#fff',
    fontSize: 16,
  },
  surahDetails: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Amiri',
    width: '15%',
    textAlign: 'center',
  },
  /// End of top container
  ayaBox: {
    marginTop: 30,
    marginHorizontal: 20,
    padding: 30,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 4, height: 4 }, // Shadow offset for all sides
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 8, // Shadow radius
    elevation: 8, // Elevation for Android
    },
  ayaText: {
    fontSize: 28,
    lineHeight: 40,
    textAlign: 'center',
    color: '#333',
    writingDirection: 'rtl',
    fontFamily: 'Amiri',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginHorizontal: 60,
    marginTop: 20,
  },
  navButton: {
    padding: 10,
    borderRadius: 10,
    width: '27%',
    alignItems: 'center',
  },
  translationContainer: {
    backgroundColor: '#f2f0f0', // Translation text container background color
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  translationText: {
    fontSize: 16,
    color: '#000', // Translation text color
    textAlign: 'center',
    fontFamily: 'SF Pro',
  },
  languageCodeContainer: {
    padding: 5,
    borderRadius: 4,
    marginTop: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  iconButton: {
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  fixedBottomMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingBottom: 30, // Added space below the icons
    paddingTop: 20, // Added space above the icons
  },
  menuButton: {
    alignItems: 'center',
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
  favBookmarkModalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 15,
    width: Dimensions.get('window').width * 0.9,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
    fontFamily: 'Amiri',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    width: '100%',
  },
  modalButtonText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'SF Pro',
  },
  modalButtonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#800020',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Amiri',
  },
  translationContainerWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  translationContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  translationText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'SF Pro',
  },
  languageCodeContainer: {
    backgroundColor: '#800020',
    padding: 5,
    borderRadius: 4,
    marginTop: 10,
  },
  languageCodeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'SF Pro',
  },
  languageModalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 10,
    borderRadius: 15,
    width: Dimensions.get('window').width * 0.6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  languageOption: {
    padding: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  languageOptionText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'SF Pro',
  },
  activeLanguage: {
    fontWeight: 'bold',
    color: '#800020',
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  tabButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeTab: {
    backgroundColor: '#800020',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  surahContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  surahTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surahInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahInfoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestampText: {
    fontSize: 12,
    color: '#666',
  },
  resultAya: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
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
  modalCloseButton: {
    alignSelf: 'flex-end',
    padding: 5,
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
  dropdown: {
    marginTop: 10,
    marginBottom: 10,
    width: 300,
    alignSelf: 'center',
  },
  dropdownContainer: {
    alignSelf: 'center', // Center the dropdown container
    width: 300, // Dropdown window
    marginTop: 10, // Position slightly below
  },
selectedItemLabel: {
    fontFamily: 'Amiri', // Set Amiri font for selected item
  },
   textStyle: {
    fontFamily: 'Amiri', // Set Amiri font for text within the dropdown container
     fontSize: 16,
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
});

export default QuranReadingAyaView;