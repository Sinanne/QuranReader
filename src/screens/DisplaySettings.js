import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Animated,
  Switch,
  Appearance,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import { useSettings } from './SettingsContext';
import { useNavigation } from '@react-navigation/native';

const DisplaySettings = () => {
  const { settings, applySettings } = useSettings();
  const [isThemeCollapsed, setIsThemeCollapsed] = useState(true);
  const [isFontCollapsed, setIsFontCollapsed] = useState(true);
  const [themeIndex, setThemeIndex] = useState(settings.themeIndex || 0);
  const [fontSize, setFontSize] = useState(settings.fontSize || 14);
  const [fontName, setFontName] = useState(settings.fontName || 'Amiri');
  const [readingStyle, setReadingStyle] = useState(settings.readingStyle || 'Normal');
  const [isFontSizeModalVisible, setIsFontSizeModalVisible] = useState(false);
  const [isFontNameModalVisible, setIsFontNameModalVisible] = useState(false);
  const navigation = useNavigation();
  const [scaleValue] = useState(new Animated.Value(1));
  const [isDarkMode, setIsDarkMode] = useState(settings.isDarkMode || false);
  const [isAutoDarkMode, setIsAutoDarkMode] = useState(settings.isAutoDarkMode || false);

  useEffect(() => {
    // Sync state with settings context
    setReadingStyle(settings.readingStyle || 'Normal');
  }, [settings.readingStyle]);

  useEffect(() => {
    if (isAutoDarkMode) {
      const colorScheme = Appearance.getColorScheme();
      setIsDarkMode(colorScheme === 'dark');
    }
  }, [isAutoDarkMode]);

  useEffect(() => {
    if (isDarkMode) {
      applySettings({ themeIndex: 1 }); // Assuming dark theme is at index 1
    } else {
      applySettings({ themeIndex: 0 }); // Assuming light theme is at index 0
    }
  }, [isDarkMode]);

  const handleThemeChange = (index) => {
    setThemeIndex(index);
    applySettings({ themeIndex: index });
  };

  const handleReadingStyleChange = (style) => {
    setReadingStyle(style);
    applySettings({ readingStyle: style });
  };

  const handlePressOut = () => {
    const targetScreen =
      readingStyle === 'Normal' ? 'QuranReading' : 'QuranReadingAyaView';
    navigation.navigate('Quran', {
      screen: targetScreen,
      params: { readingStyle },
    });
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3827/3827490.png' }}
        style={styles.topImage}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={() => setIsThemeCollapsed(!isThemeCollapsed)} style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>Themes for Reading Quran</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isThemeCollapsed}>
        <View style={styles.themeSelection}>
          {['Light', 'Dark', 'Sepia'].map((theme, index) => (
            <TouchableOpacity
              key={theme}
              style={[
                styles.themeButton,
                themeIndex === index && styles.selectedButton,
              ]}
              onPress={() => handleThemeChange(index)}
            >
              <Text style={styles.themeButtonText}>{theme}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Collapsible>

      <TouchableOpacity onPress={() => setIsFontCollapsed(!isFontCollapsed)} style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>Fonts for Reading Quran</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isFontCollapsed}>
        <View style={styles.accordionContent}>
          {/* Font Selection */}
          <Text style={styles.sectionTitle}>Font Size</Text>
          <Text style={styles.sectionTitle}>Font Name</Text>
        </View>
      </Collapsible>

      <Text style={styles.sectionTitle}>Reading Style</Text>
      <View style={styles.readingStyleContainer}>
        {['Normal', 'Aya'].map((style) => (
          <TouchableOpacity
            key={style}
            style={[
              styles.readingStyleButton,
              readingStyle === style && styles.selectedButton,
            ]}
            onPress={() => handleReadingStyleChange(style)}
          >
            <Text style={styles.readingStyleButtonText}>{style} View</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={(value) => {
            setIsDarkMode(value);
            applySettings({ isDarkMode: value });
          }}
        />
      </View>

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Auto Dark Mode</Text>
        <Switch
          value={isAutoDarkMode}
          onValueChange={(value) => {
            setIsAutoDarkMode(value);
            applySettings({ isAutoDarkMode: value });
          }}
        />
      </View>

      <Animated.View style={[styles.readQuranButtonContainer, animatedStyle]}>
        <TouchableOpacity
          style={styles.readQuranButton}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.readQuranButtonText}>Resume Reading Quran</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  topImage: {
    width: '100%',
    height: 150,
    marginVertical: 20,
  },
  accordionHeader: {
    padding: 15,
    backgroundColor: '#800020',
    borderRadius: 10,
    marginBottom: 10,
  },
  accordionHeaderText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  themeSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  themeButtonContainer: {
    alignItems: 'center',
  },
  themeButton: {
    padding: 10,
    borderRadius: 5,
    width: 80,
    alignItems: 'center',
    borderWidth: 1,
  },
  selectedButton: {
    borderColor: '#800020',
  },
  readingStyleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  readingStyleButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: '#800020',
    width: '40%',
    alignItems: 'center',
  },
  readingStyleButtonText: {
    fontSize: 16,
    color: '#800020',
  },
  readQuranButtonContainer: {
    alignItems: 'center',
  },
  readQuranButton: {
    backgroundColor: '#F0E68C', // New color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '60%', 
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowRadius: 3, // Shadow for iOS
    elevation: 5, // Shadow for Android
    marginBottom: 30,
  },
  readQuranButtonText: {
    fontSize: 14, // Same size as other text
    color: '#000000', // Black text color
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
  },
});

export default DisplaySettings;