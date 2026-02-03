// src/screens/GiftApp.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const GiftApp = ({ navigation }) => {
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
      navigation.navigate('Gift');
    });
  };

  const animatedStyle = {
    transform: [{ scale: animatedValue }],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image at the top */}
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4213/4213958.png' }}
        style={styles.topImage}
        resizeMode="contain"
      />

      <Text style={styles.title}>Gift the App to a Loved One</Text>

      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitText}>
          <FontAwesome name="check" size={18} color="#800020" /> Share the blessings of the Quran
        </Text>
        <Text style={styles.benefitText}>
          <FontAwesome name="check" size={18} color="#800020" /> Provide access to premium features
        </Text>
        <Text style={styles.benefitText}>
          <FontAwesome name="check" size={18} color="#800020" /> Help them stay connected with their faith
        </Text>
        <Text style={styles.benefitText}>
          <FontAwesome name="check" size={18} color="#800020" /> Show your love and care
        </Text>
      </View>

      <Animated.View style={[styles.giftButtonContainer, animatedStyle]}>
        <TouchableOpacity
          style={styles.giftButton}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.giftButtonText}>Gift Now</Text>
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
  giftButtonContainer: {
    alignItems: 'center',
  },
  giftButton: {
    backgroundColor: '#F0E68C', // New color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '50%', // 30% narrower
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowRadius: 3, // Shadow for iOS
    elevation: 5, // Shadow for Android
  },
  giftButtonText: {
    fontSize: 18, // Same size as other text
    color: '#000000', // Black text color
    fontWeight: 'bold',
  },
});

export default GiftApp;