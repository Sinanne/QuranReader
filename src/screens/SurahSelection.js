import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';

// Sample Surah Data
const surahData = require('../data/QuranStats.json');

// Remove duplicates by id
const uniqueSurahData = Array.from(
  new Map(surahData.map((item) => [item.sura, item])).values()
);

const SurahSelection = () => {
  const navigation = useNavigation(); // Ensure useNavigation is used to get the navigation prop
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Amiri-Bold': require('../../assets/fonts/Amiri-Bold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const handleSurahSelect = (surah) => {
    console.log('Navigating to Surah:', surah.sura);
    navigation.navigate('Quran', {
      screen: 'QuranReading', // Specify which screen inside the Quran stack to navigate to
      params: { surahId: surah.sura }, // Pass surahId as a parameter
    });
  };
  // Render Surah Box
  const renderSurahItem = ({ item }) => (
    <TouchableOpacity
      style={styles.surahBox}
      onPress={() => handleSurahSelect(item)}>
      <Text style={styles.arabicName}>{item.name}</Text>
      <Text style={styles.englishName}>
        {item.sura}. {item.name_eng}
      </Text>
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#800020" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={uniqueSurahData}
        keyExtractor={(item) => item.sura.toString()}
        renderItem={renderSurahItem}
        numColumns={2} // This creates a two-column layout
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    justifyContent: 'space-between',
  },
  surahBox: {
    flex: 1,
    margin: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Adds shadow on Android
    shadowColor: '#000', // Shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  arabicName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Amiri-Bold', // Use Amiri-Bold font for Arabic text
  },
  englishName: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
});

export default SurahSelection;
