import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { SettingsProvider } from './src/screens/SettingsContext';
import LoadingScreen from './src/components/LoadingScreen';
import ErrorBoundary from './src/components/ErrorBoundary';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import QuranReading from './src/screens/QuranReading';
import ProgressTracking from './src/screens/ProgressView';
import DisplaySettings from './src/screens/DisplaySettings';
import AudioSettings from './src/screens/AudioSettings';
import PrayerTimes from './src/screens/PrayerTimes';
import Bookmarks from './src/screens/Bookmarks';
import FavoritesScreen from './src/screens/FavoritesScreen';
import Archives from './src/screens/Archives';

const Stack = createStackNavigator();

const HEADER_STYLE = {
  headerStyle: { backgroundColor: '#800020' }, // Bordeaux
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: 'bold' },
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Prevent auto-hiding immediately
        await SplashScreen.preventAutoHideAsync();

        await Font.loadAsync({
          Amiri: require('./assets/fonts/Amiri-Regular.ttf'),
        });
      } catch (e) {
        console.warn('Splash/Font Load Error:', e);
      } finally {
        setFontsLoaded(true);
      }
    }
    prepare();
  }, []);

  // Separate effect to hide splash when ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {
        /* Ignore if already hidden or not registered */
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return <LoadingScreen />;

  const handleError = (error, errorInfo) => {
    // Log to analytics service here if needed
    console.error('Global error:', error, errorInfo);
  };

  return (
    <ErrorBoundary 
      onError={handleError}
      retryButton={true}
      showHomeButton={true}
    >
      <SettingsProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              ...HEADER_STYLE,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Quran" component={QuranReading} options={{ headerShown: false }} />
          <Stack.Screen name="Progress" component={ProgressTracking} />
          <Stack.Screen name="Bookmarks" component={Bookmarks} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="Archives" component={Archives} />
          <Stack.Screen name="PrayerTimes" component={PrayerTimes} options={{ title: 'Prayer Times' }} />
          <Stack.Screen name="Settings" component={DisplaySettings} options={{ title: 'Settings' }} />
          <Stack.Screen name="AudioSettings" component={AudioSettings} />
          </Stack.Navigator>
        </NavigationContainer>
      </SettingsProvider>
    </ErrorBoundary>
  );
};

export default App;
