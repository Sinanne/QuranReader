import { StyleSheet } from 'react-native';

const Themes = [
  {
    backgroundColor: '#FFFFFF',
    textColor: '#333333',
    fontSize: 18,
    fontName: 'Amiri',
    bottomMenuBackgroundColor: 'rgba(128, 0, 32, 1)',
    bottomMenuIconColor: '#FFFFFF',
    dropdownBackgroundColor: '#800020', // Light theme dropdown background color
    dropdownTextColor: '#FFFFFF', // Light theme dropdown text color
    dropdownTickColor: '#FFFFFF', // Light theme dropdown tick color
    shadowColor: '#grey', // Light theme shadow color
    buttonBGColor: '#800020',
    mainImage: 'https://parspng.com/wp-content/uploads/2022/09/quranpng.parspng.com-5.png',
    backgroundImage: 'https://i.pinimg.com/originals/c3/df/6d/c3df6d19e2133aec066b60940a0c63cc.jpg',
    socialIconColor:'#800020',
  },
  {
    backgroundColor: '#000000',
    textColor: '#E0E0E0',
    fontSize: 18,
    fontName: 'Amiri',
    bottomMenuBackgroundColor: 'rgba(255, 255, 255, 1)',
    bottomMenuIconColor: '#000000',
    dropdownBackgroundColor: '#757575', // Dark theme dropdown background color
    dropdownTextColor: '#FFFFFF', // Dark theme dropdown text color
    dropdownTickColor: '#FFFFFF', // Dark theme dropdown tick color
    shadowColor: '#FFFFFF', // Dark theme shadow color
    buttonBGColor: 'white',
    mainImage: 'https://istanbultarihi.ist/assets/uploads/files/cilt-7/i%CC%87stanbulda-hat-sanati/30-tugrakes-ismail-hakki-altunbezerin-celi-sulus-zerendud-levhasi.jpg',
    backgroundImage: 'https://i.pinimg.com/736x/0b/3f/ac/0b3facff7117cacf282bd18c4d8c3e13.jpg',
    socialIconColor:'white',
  },
  {
    backgroundColor: '#F5F5DC',
    textColor: '#333333',
    fontSize: 18,
    fontName: 'Amiri',
    bottomMenuBackgroundColor: 'rgba(122, 66, 20, 1)',
    bottomMenuIconColor: '#FFFFFF',
    dropdownBackgroundColor: '#704214', // Sepia theme dropdown background color
    dropdownTextColor: '#FFFFFF', // Sepia theme dropdown text color
    dropdownTickColor: '#FFFFFF', // Sepia theme dropdown tick color
    shadowColor: '#704214', // Sepia theme shadow color
    buttonBGColor: '#704214',
    mainImage: 'https://lh3.googleusercontent.com/proxy/jLH3ESmiySvOp29IJ66kxseWo2_lzOGI_MovNjWGeQ22e1Axl-qBwUBgYsTk8ULI71gwdBI7D9yXELPAQY7yb9zS042dl10',
    backgroundImage: 'https://img.freepik.com/free-vector/white-textured-paper_53876-86282.jpg',
    socialIconColor:'#704214',
  },
];

export const getThemeStyles = (currentTheme) => {
  switch (currentTheme.backgroundColor) {
    case '#000000':
      return {
        topContainer: styles.darkThemeTopContainer,
        navButton: styles.darkNavButton,
        navButtonText: styles.darkNavButtonText,
        ayahNumber: styles.darkAyahNumber,
        languageCodeContainer: styles.darkLanguageCodeContainer,
        languageCodeText: styles.darkLanguageCodeText,
        iconButton: styles.darkIconButton,
        icon: styles.darkIcon,
        activeIcon: styles.darkThemeActiveIcon,
        bottomMenu: styles.darkBottomMenu,
        menuButtonText: styles.darkMenuButtonText,
        fixedHeader: styles.darkThemeFixedHeader,
        fixedHeaderText: styles.darkThemeFixedHeaderText,
        fixedHeaderTextArabic: styles.darkfixedHeaderTextArabic,
        themePopup: styles.themePopupDark,
        themePopupSelected: styles.themePopupDarkSelected,
        dropdownContainer: { backgroundColor: currentTheme.dropdownBackgroundColor },
        selectedItemContainer: { backgroundColor: currentTheme.dropdownBackgroundColor },
        selectedItemLabel: { color: currentTheme.dropdownTextColor, fontFamily: 'Amiri' },
        tickIcon: { tintColor: currentTheme.dropdownTickColor },
        labelStyle: { fontFamily: 'Amiri' },
        ayahBox: { shadowColor: currentTheme.shadowColor }, // Add shadow color for ayahBox
        translationText: styles.darkTranslationText,
        themeSurahHeader: styles.darkThemeSurahHeader,
        themeSurahHeaderText: styles.darkThemeSurahHeaderText,
        startButton: styles.darkStartButton,
        resumeButton: styles.darkResumeButton,
        startButtonText: styles.darkStartButtonText,
        resumeButtonText: styles.darkResumeButtonText,
        smallButton: styles.darkSmallButton,
      };
    case '#F5F5DC':
      return {
        topContainer: styles.sepiaThemeTopContainer,
        navButton: styles.sepiaNavButton,
        navButtonText: styles.sepiaNavButtonText,
        ayahNumber: styles.sepiaAyahNumber,
        languageCodeContainer: styles.sepiaLanguageCodeContainer,
        languageCodeText: styles.sepiaLanguageCodeText,
        iconButton: styles.sepiaIconButton,
        icon: styles.sepiaIcon,
        activeIcon: styles.sepiaActiveIcon,
        bottomMenu: styles.sepiaBottomMenu,
        menuButtonText: styles.sepiaMenuButtonText,
        fixedHeader: styles.sepiaThemeFixedHeader,
        fixedHeaderText: styles.sepiaThemeFixedHeaderText,
        fixedHeaderTextArabic: styles.sepiafixedHeaderTextArabic,
        themePopup: styles.themePopupSepia,
        themePopupSelected: styles.themePopupSepiaSelected,
        dropdownContainer: { backgroundColor: currentTheme.dropdownBackgroundColor },
        selectedItemContainer: { backgroundColor: currentTheme.dropdownBackgroundColor },
        selectedItemLabel: { color: currentTheme.dropdownTextColor, fontFamily: 'Amiri' },
        tickIcon: { tintColor: currentTheme.dropdownTickColor },
        labelStyle: { fontFamily: 'Amiri', fontSize: 16, color: '#000'},
        ayahBox: { shadowColor: currentTheme.shadowColor }, // Add shadow color for ayahBox
        translationText: styles.sepiaTranslationText,
        themeSurahHeader: styles.sepiaThemeSurahHeader,
        themeSurahHeaderText: styles.sepiaThemeSurahHeaderText,
        startButton: styles.sepiaStartButton,
        resumeButton: styles.sepiaResumeButton,
        startButtonText: styles.sepiaStartButtonText,
        resumeButtonText: styles.sepiaResumeButtonText,
        smallButton: styles.sepiaSmallButton,
      };
    case '#FFFFFF':
      return {
        topContainer: styles.lightThemeTopContainer,
        navButton: styles.lightNavButton,
        navButtonText: styles.lightNavButtonText,
        ayahNumber: styles.lightAyahNumber,
        languageCodeContainer: styles.lightLanguageCodeContainer,
        languageCodeText: styles.lightLanguageCodeText,
        iconButton: styles.lightIconButton,
        icon: styles.lightIcon,
        activeIcon: styles.activeIcon,
        bottomMenu: styles.lightBottomMenu,
        menuButtonText: styles.lightMenuButtonText,
        fixedHeader: styles.lightThemeFixedHeader,
        fixedHeaderText: styles.lightThemeFixedHeaderText,
        fixedHeaderTextArabic: styles.lightfixedHeaderTextArabic,
        themePopup: styles.themePopupLight,
        themePopupSelected: styles.themePopupLightSelected,
        dropdownContainer: { backgroundColor: currentTheme.dropdownBackgroundColor },
        selectedItemContainer: { backgroundColor: currentTheme.dropdownBackgroundColor },
        selectedItemLabel: { color: currentTheme.dropdownTextColor, fontFamily: 'Amiri' },
        tickIcon: { tintColor: currentTheme.dropdownTickColor },
        labelStyle: { fontFamily: 'Amiri', fontSize: 16, color: '#000'},      
        ayahBox: { shadowColor: currentTheme.shadowColor }, // Add shadow color for ayahBox
        translationText: styles.lightTranslationText,
        themeSurahHeader: styles.lightThemeSurahHeader,
        themeSurahHeaderText: styles.lightThemeSurahHeaderText,
        startButton: styles.lightStartButton,
        resumeButton: styles.lightResumeButton,
        startButtonText: styles.lightStartButtonText,
        resumeButtonText: styles.lightResumeButtonText,
        smallButton: styles.lightSmallButton,
      };
    default:
      return {};
  }
};

/// Used in Quran Aya View
export const getThemeTextStyles = (currentTheme) => {
  switch (currentTheme.backgroundColor) {
    case '#000000':
      return styles.ayaViewSurahHeaderText;
    case '#F5F5DC':
      return styles.ayaViewSurahHeaderText;
    case '#FFFFFF':
      return styles.ayaViewSurahHeaderText;
    default:
      return {};
  }
};

export const getFixedHeaderBackgroundColor = (currentTheme) => {
  switch (currentTheme.backgroundColor) {
    case '#000000':
      return styles.darkFixedHeaderAyaViewBG;
    case '#F5F5DC':
      return styles.sepiaFixedHeaderAyaViewBG;
    case '#FFFFFF':
      return styles.lightFixedHeaderAyaViewBG;
    default:
      return {};
  }
};

const styles = StyleSheet.create({

  /// Top container for Fixed Surah Header in Quran Reading
  darkThemeTopContainer: {
   backgroundColor: '#000000',
    borderBottomColor: '#F0E68C',
  },
  sepiaThemeTopContainer: {
    backgroundColor: '#F5F5DC',
    borderBottomColor: '#704214',
  },
  lightThemeTopContainer: {
   backgroundColor: '#FFFFFF',
    borderBottomColor: '#800020',
  },

  /// Fixed Header in Quran Reading
  darkThemeFixedHeader: {
    backgroundColor: '#F0E68C',
  },
   lightThemeFixedHeader: {
    backgroundColor: '#800020',
  },
   sepiaThemeFixedHeader: {
    backgroundColor: '#704214',
  },
  darkThemeFixedHeaderText: {
    color: 'black',
  },
  lightThemeFixedHeaderText: {
    color: 'white',
  },
  sepiaThemeFixedHeaderText: {
    color: 'white',
  },
  sepiafixedHeaderTextArabic: {
    fontSize: 20,
    color: 'white',
  },
  darkfixedHeaderTextArabic: {
    fontSize: 20,
    color: 'black',
  },
  lightfixedHeaderTextArabic: {
    fontSize: 20,
    color: 'white',
  },

/// Surah Header in Quran Reading
   darkThemeSurahHeader: {
    borderBottomColor: '#F0E68C',
    borderBottomWidth: 3,
  },
  sepiaThemeSurahHeader: {
    borderBottomColor: '#704214',
    borderBottomWidth: 3,
  },
  lightThemeSurahHeader: {
    borderBottomColor: ' ',
    borderBottomWidth: 3,
  },
  darkThemeSurahHeaderText: {
    fontSize: 20,
    color: '#F0E68C',
    fontWeight: 'bold',
  },
  lightThemeSurahHeaderText: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
  },
  sepiaThemeSurahHeaderText: {
    fontSize: 20,
    color: '#704214',
    fontWeight: 'bold',
  },

  /// Fixed Header in Aya View
  ayaViewSurahHeaderText: {
    color: 'white',
    fontWeight: 'bold',
  },
 
darkFixedHeaderAyaViewBG: {
   backgroundColor:'black'
  },

sepiaFixedHeaderAyaViewBG: {
    backgroundColor:'#704214'
  },

lightFixedHeaderAyaViewBG: {
   backgroundColor:'#800020'
  },
/// End of fixed header in Aya View

  navButton: {
    padding: 10,
    borderRadius: 10,
    width: '27%',
    alignItems: 'center',
  },
  navButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Amiri',
  },
  darkNavButton: {
    backgroundColor: 'white', // Dark theme arrow background color
  },
  sepiaNavButton: {
    backgroundColor: '#704214', // Sepia theme arrow background color
  },
  lightNavButton: {
    backgroundColor: '#800020', // Light theme arrow background color
  },
  darkNavButtonText: {
    color: '#000', // Dark theme arrow color
  },
  sepiaNavButtonText: {
    color: '#FFF', // Sepia theme arrow color
  },
  lightNavButtonText: {
    color: '#FFF', // Light theme arrow color
  },
  ayahNumber: {
    fontSize: 28,
    lineHeight: 40,
    textAlign: 'center',
    color: '#333',
    writingDirection: 'rtl',
    fontFamily: 'Amiri',
  },
  darkAyahNumber: {
    color: '#F0E68C', // Dark theme ayah number color
  },
  sepiaAyahNumber: {
    color: '#704214', // Sepia theme ayah number color
  },
  lightAyahNumber: {
    color: '#800020', // Light theme ayah number color
  },
  languageCodeContainer: {
    padding: 5,
    borderRadius: 4,
    marginTop: 10,
  },
  darkLanguageCodeContainer: {
    backgroundColor: '#F0E68C', // Dark theme language code container background color
  },
  sepiaLanguageCodeContainer: {
    backgroundColor: '#704214', // Sepia theme language code container background color
  },
  lightLanguageCodeContainer: {
    backgroundColor: '#800020', // Light theme language code container background color
  },
  languageCodeText: {
    fontWeight: 'bold',
    fontFamily: 'SF Pro',
  },
  darkLanguageCodeText: {
    color: '#000', // Dark theme language code text color
  },
  sepiaLanguageCodeText: {
    color: '#FFF', // Sepia theme language code text color
  },
  lightLanguageCodeText: {
    color: '#FFF', // Light theme language code text color
  },
  iconButton: {
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  darkIconButton: {
    backgroundColor: '#000', // Dark theme icon background color
  },
  sepiaIconButton: {
    backgroundColor: '#F5F5DC', // Sepia theme icon background color
  },
  lightIconButton: {
    backgroundColor: '#FFF', // Light theme icon background color
  },
  icon: {
    color: 'grey', // Light theme icon color
  },
  darkIcon: {
    color: 'white', // Dark theme icon color
  },
  sepiaIcon: {
    color: '#704214', // Sepia theme icon color
  },
  activeIcon: {
    color: '#800020', // Active/selected icon color
  },
  darkThemeActiveIcon: {
    color: '#F0E68C', // Dark theme active/selected icon color
  },
  sepiaActiveIcon: {
    color: '#800020', // Sepia theme active/selected icon color
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
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingBottom: 30,
    paddingTop: 20,
  },
  darkBottomMenu: {
    backgroundColor: '#000', // Dark theme bottom menu color
  },
  sepiaBottomMenu: {
    backgroundColor: '#704214', // Sepia theme bottom menu color
  },
  lightBottomMenu: {
    backgroundColor: '#800020', // Light theme bottom menu color
  },
  menuButtonText: {
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'SF Pro',
  },
  darkMenuButtonText: {
    color: 'white', // Dark theme bottom menu icon color
  },
  sepiaMenuButtonText: {
    color: '#F5F5DC', // Sepia theme bottom menu icon color
  },
  lightMenuButtonText: {
    color: '#FFF', // Light theme bottom menu icon color
  },

  
/// Theme Popup Window
    themePopupLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // white 90% transparent background
    color: 'black', // black font
  },
  themePopupLightSelected: {
    backgroundColor: '#800020', // selected button background
    fontWeight: 'bold',
    color: 'white', // bold white font
  },
  themePopupDark: {
    backgroundColor: 'rgba(211, 211, 211, 0.7)', // light grey 70% transparency background
    color: 'black', // black font
  },
  themePopupDarkSelected: {
    backgroundColor: 'black', // selected button background
    borderColor: 'white', // black thick border
    fontWeight: 'bold',
    color: 'white', // bold black font
  },
  themePopupSepia: {
    backgroundColor: '#F5F5DC', // sepia background
    color: 'black', // black font
  },
  themePopupSepiaSelected: {
    backgroundColor: '#704214', // selected button background
    borderColor: '#704214', // thick border
    fontWeight: 'bold',
    color: 'white', // bold white font
  },
  /// End of Theme Popup Window

  /// Homescreen
  lightStartButtonText: {
  color: 'white',
  },
  darkStartButtonText: {
    color: 'black',
  },
  sepiaStartButtonText: {
    color: 'white',
  },
  lightResumeButtonText: {
    color: 'white',
  },
  darkResumeButtonText: {
    color: '#333',
  },
  sepiaResumeButtonText: {
    color: 'white',
  },
  lightSmallButton: {
    backgroundColor: '#800020',
   },
  darkSmallButton: {
    backgroundColor: 'black',
   },
  sepiaSmallButton: {
    backgroundColor: '#704214',
   },
  /// End of Homescreen
});

export default Themes;