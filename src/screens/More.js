// src/screens/More.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const More = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Image at the top */}
      <Image
        source={{ uri: 'https://freeislamiccalligraphy.com/wp-content/uploads/2013/05/Huwa-Allah-Kufic.png' }}
        style={styles.topImage}
        resizeMode="contain"
      />

      {/* Privacy Policy */}
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('PrivacyPolicy')}>
        <Text style={styles.settingText}>Privacy Policy</Text>
      </TouchableOpacity>

      {/* Terms of Service */}
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('TermsOfService')}>
        <Text style={styles.settingText}>Terms of Service</Text>
      </TouchableOpacity>

      {/* Feedback and Support */}
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('FeedbackAndSupport')}>
        <Text style={styles.settingText}>Feedback and Support</Text>
      </TouchableOpacity>

      {/* Reset Settings */}
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ResetSettings')}>
        <Text style={styles.settingText}>Reset Settings</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 40, // Add space below the image
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#800020', // Bordeaux color
    textAlign: 'center', // Center the title
  },
  settingItem: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#800020', // Bordeaux color
    borderRadius: 10,
    alignItems: 'center',
  },
  settingText: {
    fontSize: 18,
    color: '#ffffff', // White text color
    fontWeight: 'bold',
  },
});

export default More;