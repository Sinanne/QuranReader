import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { COLORS } from '../theme/colors';

const LoadingScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Amiri-Bold': require('../../assets/fonts/Amiri-Bold.ttf'),
        });
      } catch (e) {
        console.warn('LoadingScreen Font Load Error:', e);
      } finally {
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={[styles.overlay, { backgroundColor: COLORS.brand.background }]}>
        <ActivityIndicator color={COLORS.brand.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.overlay, { backgroundColor: COLORS.brand.background }]}>
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2850/2850981.png' }} // Quran icon or similar
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Tasneem</Text>
        <Text style={styles.appNameArabic}>تسنيم</Text>

        <ActivityIndicator color={COLORS.brand.primary} size="small" style={{ marginTop: 20 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  content: {
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    tintColor: COLORS.brand.primary,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  appNameArabic: {
    fontSize: 38,
    color: COLORS.brand.primary,
    fontFamily: 'Amiri-Bold',
    marginBottom: 10,
  },
});

export default LoadingScreen;