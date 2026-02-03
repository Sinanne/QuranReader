// src/screens/FundAppAndCharity.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const FundAppAndCharity = ({ navigation }) => {
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
      navigation.navigate('Donate');
    });
  };

  const animatedStyle = {
    transform: [{ scale: animatedValue }],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image at the top */}
      <Image
        source={{ uri: 'https://s.tmimgcdn.com/scr/1200x627/346400/love-heart-family-logo-support-template-v1_346422-original.jpg' }}
        style={styles.topImage}
        resizeMode="contain"
      />

      <Text style={styles.title}>We need your support!</Text>

      <Text style={styles.description}>
        This app is developed and maintained by a dedicated and benevolent team committed to making a positive impact. Your support helps us in three key ways:
      </Text>

      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitText}>
          <FontAwesome name="check" size={18} color="#800020" /> Enhancing Features: Drive the development of new and innovative features.
        </Text>
        <Text style={styles.benefitText}>
          <FontAwesome name="check" size={18} color="#800020" /> Maintaining Excellence: Ensure the app remains reliable and user-friendly.
        </Text>
        <Text style={styles.benefitText}>
          <FontAwesome name="check" size={18} color="#800020" /> Supporting Charities: Fund charitable initiatives that benefit our community.
        </Text>
      </View>

      <Text style={styles.callToAction}>Together, we can make a difference!</Text>

      <Animated.View style={[styles.fundButtonContainer, animatedStyle]}>
        <TouchableOpacity
          style={styles.fundButton}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.fundButtonText}>Fund Now</Text>
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
    width: '80%', // 20% smaller
    height: 120, // Adjusted height to maintain aspect ratio
    marginTop: 10, // Smaller space above the image
    marginBottom: 10, // Smaller space below the image
    alignSelf: 'center', // Center the image
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800020', // Bordeaux color
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16, // Smaller size
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  benefitsContainer: {
    marginBottom: 30,
  },
  benefitText: {
    fontSize: 16, // Smaller size
    color: '#333333',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  callToAction: {
    fontSize: 18, // Same size as other text
    color: '#800020', // Bordeaux color
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  fundButtonContainer: {
    alignItems: 'center',
  },
  fundButton: {
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
  fundButtonText: {
    fontSize: 18, // Same size as other text
    color: '#000000', // Black text color
    fontWeight: 'bold',
  },
});

export default FundAppAndCharity;