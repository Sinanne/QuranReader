import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import * as Font from 'expo-font';

const LoadingScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Amiri-Bold': require('../../assets/fonts/Amiri-Bold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Return null until fonts are loaded
  }

  return (
      <View style={styles.overlay}>
        <Image
          source={{ uri: 'https://freeislamiccalligraphy.com/wp-content/uploads/2014/02/shahada_006.jpg' }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Tasneem</Text>
        <Text style={styles.appNameArabic}>تسنيم</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0)', // Add a slight white overlay for better readability
    width: '100%',
    height: '100%',
  },
  image: {
    width: 210, // 40% bigger than 150
    height: 450, // 40% bigger than 150
    marginBottom: 10,
    marginTop: 80, // Move closer to the top
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#800020', // Bordeaux color
    marginBottom: 0,
  },
  appNameArabic: {
    fontSize: 38,
    color: '#800020', // Bordeaux color
    fontFamily: 'Amiri-Bold', // Use Amiri-Bold font for Arabic text
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#800020', // Bordeaux color
  },
});

export default LoadingScreen;