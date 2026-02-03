// src/screens/Bookmarks.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from './SettingsContext';

const BookmarksScreen = () => {
  const { settings } = useSettings();
  const [ayaStates, setAyaStates] = useState({});
  const [selectedAyah, setSelectedAyah] = useState(null);

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

  const openAyahModal = (ayah) => {
    setSelectedAyah(ayah);
  };

  const closeAyahModal = () => {
    setSelectedAyah(null);
  };

  // Get bookmarked ayahs from ayaStates
  const bookmarkedAyahs = Object.keys(ayaStates)
    .filter((ayaId) => ayaStates[ayaId].bookmarked)
    .map((ayaId) => ({
      ayah: ayaId,
      text: ayaStates[ayaId].notes || 'No notes available',
      timestamp: ayaStates[ayaId].timestamp || 'No timestamp available',
      surah: 'Surah Name', // Replace with actual surah name if available
    }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Bookmarks</Text>

      {/* Bookmarked Ayahs */}
      <View style={styles.sectionContent}>
        {bookmarkedAyahs.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => openAyahModal(item)} style={styles.ayahItem}>
            <Text style={styles.ayahText}>Ayah: {item.ayah}</Text>
            <Text style={styles.notesText}>Notes: {item.text}</Text>
            <Text style={styles.timestampText}>Timestamp: {item.timestamp}</Text>
          </TouchableOpacity>
        ))}
      </View>

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
                  <Text style={styles.modalTimestamp}>Timestamp: {selectedAyah.timestamp}</Text>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionContent: {
    marginBottom: 20,
  },
  ayahItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
  },
  ayahText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesText: {
    fontSize: 14,
    color: '#555555',
  },
  timestampText: {
    fontSize: 12,
    color: '#888888',
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
  modalTimestamp: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
});

export default BookmarksScreen;