import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { SettingsProvider } from './src/context/SettingsContext';
import LoadingScreen from './src/components/LoadingScreen';
import ErrorBoundary from './src/components/ErrorBoundary';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          'Amiri-Regular': require('./assets/fonts/Amiri-Regular.ttf'),
          'Amiri': require('./assets/fonts/Amiri-Regular.ttf'),
          'Amiri-Bold': require('./assets/fonts/Amiri-Bold.ttf'),
          'SF Pro Display': require('./assets/fonts/SF-Pro.ttf'),
        });
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
    <ErrorBoundary retryButton={true}>
      <SettingsProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SettingsProvider>
    </ErrorBoundary>
  );
};

export default App;
