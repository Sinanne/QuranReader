import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider } from './src/context/SettingsContext';
import LoadingScreen from './src/components/LoadingScreen';
import ErrorBoundary from './src/components/ErrorBoundary';
import { Platform } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        if (Platform.OS !== 'web') {
          await SplashScreen.preventAutoHideAsync();
        }

        const fontsToLoad = {
          'Amiri-Regular': require('./src/assets/fonts/Amiri-Regular.ttf'),
          'Amiri': require('./src/assets/fonts/Amiri-Regular.ttf'),
          'Amiri-Bold': require('./src/assets/fonts/Amiri-Bold.ttf'),
        };

        if (Platform.OS !== 'web') {
          fontsToLoad['SF Pro Display'] = require('./src/assets/fonts/SF-Pro.ttf');
        }

        await Font.loadAsync(fontsToLoad);
      } catch (e) {
        console.warn('Splash/Font Load Error:', e);
      } finally {
        setFontsLoaded(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return <LoadingScreen />;

  return (
    <SafeAreaProvider style={{ flex: 1, height: '100%', minHeight: 0 }}>
      <ErrorBoundary retryButton={true}>
        <SettingsProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SettingsProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

export default App;
