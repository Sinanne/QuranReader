// src/screens/FavoritesScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from './SettingsContext';
import { FlatList } from 'react-native';

const FavoritesScreen = () => {
  const { settings } = useSettings();
  const [ayaStates, setAyaStates] = useState({});
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [groupBy, setGroupBy] = useState('surah'); // 'surah' or 'month'
  const [sortBy, setSortBy] = useState('surah'); // 'surah', 'date', 'mostFavorited'

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

  // Get favorited ayahs from ayaStates
  const favoritedAyahs = Object.keys(ayaStates)
    .filter((ayaId) => ayaStates[ayaId].favorite)
    .map((ayaId) => ({
      ayah: ayaId,
    timestamp: ayaStates[ayaId].timestamp || '',
       surah: 'Surah Name', // Replace with actual surah name if available
    }));

  // Group favorited ayahs by surah or month
  const groupedAyahs = favoritedAyahs.reduce((acc, ayah) => {
    const key = groupBy === 'surah' ? ayah.surah : new Date(ayah.timestamp).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(ayah);
    return acc;
  }, {});

  // Sort favorited ayahs by surah, date/timestamp, or most favorited by other users
  const sortedAyahs = Object.entries(groupedAyahs).sort(([keyA, ayahsA], [keyB, ayahsB]) => {
    if (sortBy === 'surah') {
      return keyA.localeCompare(keyB);
    } else if (sortBy === 'date') {
      return new Date(ayahsA[0].timestamp) - new Date(ayahsB[0].timestamp);
    } else if (sortBy === 'mostFavorited') {
      return ayahsB.length - ayahsA.length;
    }
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Favorites</Text>

      {/* Group By Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setGroupBy('surah')} style={[styles.button, groupBy === 'surah' && styles.activeButton]}>
          <Text style={styles.buttonText}>Group by Surah</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setGroupBy('month')} style={[styles.button, groupBy === 'month' && styles.activeButton]}>
          <Text style={styles.buttonText}>Group by Month</Text>
        </TouchableOpacity>
      </View>

      {/* Sort By Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setSortBy('surah')} style={[styles.button, sortBy === 'surah' && styles.activeButton]}>
          <Text style={styles.buttonText}>Sort by Surah</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('date')} style={[styles.button, sortBy === 'date' && styles.activeButton]}>
          <Text style={styles.buttonText}>Sort by Date</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('mostFavorited')} style={[styles.button, sortBy === 'mostFavorited' && styles.activeButton]}>
          <Text style={styles.buttonText}>Sort by Most Favorited</Text>
        </TouchableOpacity>
      </View>

      {/* Favorited Ayahs */}
      {sortedAyahs.map(([group, ayahs], index) => (
        <View key={index} style={styles.group}>
          <Text style={styles.groupHeader}>{group}</Text>
          {ayahs.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => openAyahModal(item)} style={styles.ayahItem}>
              <Text style={styles.ayahText}>Ayah: {item.ayah}</Text>
              <Text style={styles.notesText}>Notes: {item.text}</Text>
              <Text style={styles.timestampText}>Timestamp: {item.timestamp}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#800020',
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: '#ff6347',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  group: {
    marginBottom: 20,
  },
  groupHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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

export default FavoritesScreen;