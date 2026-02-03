import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './src/screens/HomeScreen';
import QuranReading from './src/screens/QuranReading';
import ProgressTracking from './src/screens/ProgressTracking';
import SearchPage from './src/screens/SearchPage';
import About from './src/screens/About';
import LangNotifSettings from './src/screens/LangNotifSettings';
import DisplaySettings from './src/screens/DisplaySettings';
import AudioSettings from './src/screens/AudioSettings';
import BookmarksAndFavorites from './src/screens/BookmarksAndFavorites';
import More from './src/screens/More';
import PrivacyPolicy from './src/screens/PrivacyPolicy';
import TermsOfService from './src/screens/TermsOfService';
import FavoritesScreen from './src/screens/FavoritesScreen';
import SurahSelection from './src/screens/SurahSelection';
import QuranReadingAyaView from './src/screens/QuranReadingView1';
import Archives from './src/screens/Archives';
import { SettingsProvider } from './src/screens/SettingsContext';
import LoadingScreen from './src/components/LoadingScreen';
import Bookmarks from './src/screens/Bookmarks'
import Themes from './src/screens/Themes';
import { TransitionPresets } from '@react-navigation/stack';



// Constants
const FONT_LOAD_TIMEOUT = 2500;
const HEADER_STYLE = {
  headerStyle: { backgroundColor: '#800020' }, // Bordeaux
  headerTintColor: '#FFFFF0', // Ivory
  headerTitleStyle: { fontWeight: 'bold' },
};
const Stack = createStackNavigator();

// Load Fonts
const loadFonts = async () => {
  try {
    await Font.loadAsync({
      Amiri: require('./assets/fonts/Amiri-Regular.ttf'),
      Scheherazade: require('./assets/fonts/Scheherazade-Regular.ttf'),
      Lateef: require('./assets/fonts/Lateef-Regular.ttf'),
    });
  } catch (error) {
    console.error('Error loading fonts:', error);
  }
};


// Quran Stack
const QuranStack = React.memo(() => (
  <Stack.Navigator screenOptions={HEADER_STYLE}>
    <Stack.Screen name="QuranReading" component={QuranReading} options={{ headerShown: false }} />
    <Stack.Screen name="SearchPage" component={SearchPage} options={{ title: '' }} />
    <Stack.Screen name="QuranReadingAyaView" component={QuranReadingAyaView} options= {{ headerShown: false }} />
  </Stack.Navigator>
));

// Settings Stack
const SettingsStack = React.memo(() => (
  <Stack.Navigator screenOptions={HEADER_STYLE}>
    <Stack.Screen name="About" component={About} options={{ title: 'About Tasneem' }} />
    <Stack.Screen name="LangNotifSettings" component={LangNotifSettings} options={{ title: 'Language & Notifications' }} />
    <Stack.Screen name="DisplaySettings" component={DisplaySettings} options={{ title: 'Display Settings' }} />
    <Stack.Screen name="AudioSettings" component={AudioSettings} options={{ title: 'Audio Settings' }} />
    <Stack.Screen name="BookmarksAndFavorites" component={BookmarksAndFavorites} options={{ title: 'Bookmarks & Favorites' }} />
    <Stack.Screen name="More" component={More} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    <Stack.Screen name="TermsOfService" component={TermsOfService} />
  </Stack.Navigator>
));

// Main Stack
const MainStack = React.memo(() => (
    <Stack.Navigator
    screenOptions={{
      ...HEADER_STYLE,
      ...TransitionPresets.FadeFromBottomAndroid, // Apply the transition preset here
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Quran" component={QuranStack} options={{ headerShown: false }} />
    <Stack.Screen name="Settings" component={SettingsStack} options={{ headerShown: false }} />
    <Stack.Screen name="Progress" component={ProgressTracking} options={{ title: 'Progress Tracking' }} />
    <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorites' }} />
    <Stack.Screen name="Archives" component={Archives} options={{ title: 'Archives' }} />
    <Stack.Screen name="SurahSelection" component={SurahSelection} options={{ title: 'Surah Selection' }} />
    <Stack.Screen name='Bookmarks' component={Bookmarks} options={{title: 'Bookmarks'}} />
  </Stack.Navigator>
));

// App Component
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);

  // Load saved data from AsyncStorage
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem('favorites');
        const savedBookmarked = await AsyncStorage.getItem('bookmarked');

        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        if (savedBookmarked) setBookmarked(JSON.parse(savedBookmarked));
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    };

    const initializeApp = async () => {
      await loadFonts();
      await loadSavedData();
      setTimeout(() => setIsLoading(false), FONT_LOAD_TIMEOUT);
    };

    initializeApp();
  }, []);

  // Save data to AsyncStorage when favorites or bookmarked change
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        await AsyncStorage.setItem('bookmarked', JSON.stringify(bookmarked));
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    };

    saveData();
  }, [favorites, bookmarked]);


  useEffect(() => {
    const initializeApp = async () => {
      await loadFonts();
      setTimeout(() => setIsLoading(false), FONT_LOAD_TIMEOUT);
    };
    initializeApp();
  }, []);

  return (
    <SettingsProvider>
      <NavigationContainer>
        {isLoading ? <LoadingScreen /> : <MainStack />}
      </NavigationContainer>
    </SettingsProvider>
  );
};

export default App;
