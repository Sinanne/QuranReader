// src/screens/BookmarkAndHighlightSettings.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from './SettingsContext';

const BookmarkAndHighlightSettings = () => {
  const { settings } = useSettings();
  const [isBookmarkedAyahCollapsed, setIsBookmarkedAyahCollapsed] = useState(true);
  const [isFavoriteAyahCollapsed, setIsFavoriteAyahCollapsed] = useState(true);
  const [isGlobalFavoritesCollapsed, setIsGlobalFavoritesCollapsed] = useState(true);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [ayaStates, setAyaStates] = useState({});

  // Load ayaStates from AsyncStorage when the component mounts
  useEffect(() => {
    const loadAyaStates = async () => {
      try {
        const storedAyaStates = await AsyncStorage.getItem('ayaStates');
        if (storedAyaStates) {
          setAyaStates(JSON.parse(storedAyaStates));
        }
      } catch (error) {
        console.error('Error loading ayaStates from AsyncStorage:', error);
      }
    };

    loadAyaStates();
  }, []);

  // Save ayaStates to AsyncStorage whenever it changes
  useEffect(() => {
    const saveAyaStates = async () => {
      try {
        await AsyncStorage.setItem('ayaStates', JSON.stringify(ayaStates));
      } catch (error) {
        console.error('Error saving ayaStates to AsyncStorage:', error);
      }
    };

    saveAyaStates();
  }, [ayaStates]);

  const toggleBookmarkedAyahSection = () => {
    setIsBookmarkedAyahCollapsed(!isBookmarkedAyahCollapsed);
  };

  const toggleFavoriteAyahSection = () => {
    setIsFavoriteAyahCollapsed(!isFavoriteAyahCollapsed);
  };

  const toggleGlobalFavoritesSection = () => {
    setIsGlobalFavoritesCollapsed(!isGlobalFavoritesCollapsed);
  };

  const openAyahModal = (ayah) => {
    setSelectedAyah(ayah);
  };

  const closeAyahModal = () => {
    setSelectedAyah(null);
  };

  // Get bookmarked and favorite ayahs from ayaStates
  const bookmarkedAyahs = Object.keys(ayaStates)
    .filter((ayaId) => ayaStates[ayaId].bookmarked)
    .map((ayaId) => ({
      ayah: ayaId,
      text: ayaStates[ayaId].notes || 'No notes available',
      surah: 'Surah Name', // Replace with actual surah name if available
    }));

  const favoriteAyahs = Object.keys(ayaStates)
    .filter((ayaId) => ayaStates[ayaId].favorite)
    .map((ayaId) => ({
      ayah: ayaId,
      text: ayaStates[ayaId].notes || 'No notes available',
      surah: 'Surah Name', // Replace with actual surah name if available
    }));

  const globalFavorites = [
    { ayah: '2:255', text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', surah: 'Al-Baqarah', votes: 1500 },
    { ayah: '3:190', text: 'إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ', surah: 'Aal-E-Imran', votes: 1400 },
    { ayah: '36:1', text: 'يس', surah: 'Ya-Sin', votes: 1300 },
    // Add more ayahs as needed
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Image at the top */}
      <Image
        source={{ uri: 'https://i.etsystatic.com/22980878/r/il/450bff/3029537476/il_fullxfull.3029537476_je4y.jpg' }}
        style={styles.topImage}
        resizeMode="contain"
      />
      {/* Bookmarked Ayah and Related Notes */}
      <TouchableOpacity onPress={toggleBookmarkedAyahSection} style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>Bookmarked Ayah and Related Notes</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isBookmarkedAyahCollapsed}>
        <View style={styles.accordionContent}>
          {bookmarkedAyahs.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => openAyahModal(item)} style={styles.bookmarkItem}>
              <Text style={styles.bookmarkText}>Ayah: {item.ayah}</Text>
              <Text style={styles.notesText}>Notes: {item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Collapsible>

      {/* Ayah Chosen as Favorite by the User */}
      <TouchableOpacity onPress={toggleFavoriteAyahSection} style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>Ayah Chosen as Favorite by the User</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isFavoriteAyahCollapsed}>
        <View style={styles.accordionContent}>
          {favoriteAyahs.map((ayah, index) => (
            <TouchableOpacity key={index} onPress={() => openAyahModal(ayah)} style={styles.favoriteAyahItem}>
              <Text style={styles.favoriteAyahText}>Ayah: {ayah.ayah}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Collapsible>

      {/* Global Favorites */}
      <TouchableOpacity onPress={toggleGlobalFavoritesSection} style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>Global Favorites</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isGlobalFavoritesCollapsed}>
        <View style={styles.accordionContent}>
          {globalFavorites.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => openAyahModal(item)} style={styles.globalFavoriteItem}>
              <Text style={styles.globalFavoriteText}>Ayah: {item.ayah}</Text>
              <Text style={styles.votesText}>Votes: {item.votes}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Collapsible>

      {/* Ayah Modal */}
      <Modal
        transparent={true}
        visible={!!selectedAyah}
        animationType="slide"
        onRequestClose={closeAyahModal}
      >
        <TouchableWithoutFeedback onPress={closeAyahModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedAyah && (
                <>
                  <Text style={styles.modalAyahText}>{selectedAyah.text}</Text>
                  <Text style={styles.modalAyahInfo}>({selectedAyah.ayah} - {selectedAyah.surah})</Text>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Export Bookmarks */}
      <View style={styles.exportBookmarksContainer}>
        <Text style={styles.exportBookmarksText}>Export Bookmarks</Text>
        <FontAwesome name="download" size={24} color="#800020" />
      </View>
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
    marginTop: 20, // Add space above the image
    marginBottom: 20, // Add more space below the image
  },
  accordionHeader: {
    padding: 15,
    backgroundColor: '#800020', // Bordeaux color
    borderRadius: 10,
    marginBottom: 10,
  },
  accordionHeaderText: {
    fontSize: 18,
    color: '#ffffff', // White text color
    fontWeight: 'bold',
  },
  accordionContent: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
  },
  bookmarkItem: {
    marginBottom: 15,
  },
  bookmarkText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesText: {
    fontSize: 14,
    color: '#555555',
  },
  favoriteAyahItem: {
    marginBottom: 15,
  },
  favoriteAyahText: {
    fontSize: 16,
  },
  globalFavoriteItem: {
    marginBottom: 15,
  },
  globalFavoriteText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  votesText: {
    fontSize: 14,
    color: '#555555',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalAyahText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalAyahInfo: {
    fontSize: 18,
    color: '#800020', // Bordeaux color
    textAlign: 'center',
  },
  exportBookmarksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
  },
  exportBookmarksText: {
    fontSize: 18,
    color: '#800020', // Bordeaux color
    fontWeight: 'bold',
  },
});

export default BookmarkAndHighlightSettings;