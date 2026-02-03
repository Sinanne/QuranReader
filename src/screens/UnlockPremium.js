// src/screens/UnlockPremium.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const UnlockPremium = ({ navigation }) => {
  const animatedValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Upgrade');
    });
  };

  const animatedStyle = {
    transform: [{ scale: animatedValue }],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image at the top */}
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/256/3649/3649611.png' }}
        style={styles.topImage}
        resizeMode="contain"
      />

      <Text style={styles.title}>Unlock Premium Features</Text>

      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitText}>
          <FontAwesome name="check" size={18} color="#800020" /> Ad-Free Experience
        </Text>
        <Text style={styles.benefitText}>
          <FontAwesome name="check" size={18} color="#800020" /> Access to Exclusive Content
        </Text>
        <Text style={styles.benefitText}>
          <FontAwesome name="check" size={18} color="#800020" /> Priority Customer Support
        </Text>
        <Text style={styles.benefitText}>
          <FontAwesome name="check" size={18} color="#800020" /> Offline Access
        </Text>
        <Text style={styles.benefitText}>
          <FontAwesome name="check" size={18} color="#800020" /> Early Access to New Features
        </Text>
      </View>

      <Animated.View style={[styles.upgradeButtonContainer, animatedStyle]}>
        <TouchableOpacity
          style={styles.upgradeButton}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  topImage: {
    width: '100%',
    height: 150,
    marginTop: 20, // Add space above the image
    marginBottom: 20, // Add more space below the image
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800020', // Bordeaux color
    textAlign: 'center',
    marginBottom: 20,
  },
  benefitsContainer: {
    marginBottom: 30,
  },
  benefitText: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 10,
  },
  upgradeButtonContainer: {
    alignItems: 'center',
  },
  upgradeButton: {
    backgroundColor: '#F0E68C', // New color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '60%', // 30% narrower
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowRadius: 3, // Shadow for iOS
    elevation: 5, // Shadow for Android
  },
  upgradeButtonText: {
    fontSize: 18, // Same size as other text
    color: '#000000', // Black text color
    fontWeight: 'bold',
  },
});

export default UnlockPremium;