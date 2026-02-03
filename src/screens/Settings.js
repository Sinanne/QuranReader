import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSettings } from './SettingsContext';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons

const Settings = ({ navigation }) => {
  const { settings, applySettings } = useSettings();
  const [themeIndex, setThemeIndex] = useState(settings.themeIndex);

  const handleThemeChange = (index) => {
    setThemeIndex(index);
    applySettings({ themeIndex: index });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://freeislamiccalligraphy.com/wp-content/uploads/2014/02/allah-w-akbar-mousque-scaled.jpg' }}
        style={{ width: '100%', height: 250, margintop: 20, marginBottom: 20 }} // Corrected typo in marginBottom
        resizeMode="contain" // Set resizeMode to 'cover' for cropping
      />
      <Ionicons name="settings" size={32} color="#800020" style={styles.icon} />

      {/* Theme Selection */}
      <Text style={styles.optionText}>Pick your theme when reading al-Quran</Text>
      <View style={styles.themeSelection}>
        <View style={styles.themeButtonContainer}>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: '#FFFFFF', borderColor: '#800020' }]}
            onPress={() => handleThemeChange(0)}
          >
            <Text style={[styles.themeButtonText, { color: '#000000' }]}>Light</Text>
          </TouchableOpacity>
          {themeIndex === 0 && <Ionicons name="checkmark-circle" size={24} color="#800020" style={styles.checkIcon} />}
        </View>
        <View style={styles.themeButtonContainer}>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: '#121212', borderColor: '#800020' }]}
            onPress={() => handleThemeChange(1)}
          >
            <Text style={[styles.themeButtonText, { color: '#FFFFFF' }]}>Dark</Text>
          </TouchableOpacity>
          {themeIndex === 1 && <Ionicons name="checkmark-circle" size={24} color="#800020" style={styles.checkIcon} />}
        </View>
        <View style={styles.themeButtonContainer}>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: '#F5F5DC', borderColor: '#800020' }]}
            onPress={() => handleThemeChange(2)}
          >
            <Text style={[styles.themeButtonText, { color: '#333333' }]}>Sepia</Text>
          </TouchableOpacity>
          {themeIndex === 2 && <Ionicons name="checkmark-circle" size={24} color="#800020" style={styles.checkIcon} />}
        </View>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('QuranReading')}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.fabText}>Back to Quran Reading</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF', // Set background color to white
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  optionText: {
    fontSize: 18,
    marginBottom: 20, // Add more space between the text and the buttons
    textAlign: 'center',
  },
  themeSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  themeButtonContainer: {
    alignItems: 'center',
  },
  themeButton: {
    padding: 10,
    borderRadius: 5,
    width: 80,
    alignItems: 'center',
    borderWidth: 3, // Thick border
  },
  themeButtonText: {
    fontSize: 18, // Bigger font size
    fontWeight: 'bold', // Bold text
    textAlign: 'center',
  },
  checkIcon: {
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 40, // Add space between the FAB and the main bottom tab
    right: 20,
    backgroundColor: '#800020',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    position: 'absolute',
    bottom: 15, // Position the text closer to the FAB
    right: 20,
    color: '#800020',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Settings;