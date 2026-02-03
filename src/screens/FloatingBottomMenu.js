// FloatingBottomMenu.js
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FloatingBottomMenu = ({
  onNavigate,
  currentTheme,
  onThemePress,
  onTranslationPress,
  onFavoritePress,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(100))[0];

  const toggleMenu = () => {
    setIsVisible(!isVisible);
    Animated.timing(slideAnim, {
      toValue: isVisible ? 100 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          {
            backgroundColor: currentTheme.bottomMenuBackgroundColor,
            opacity: 0.7, // Make the button more translucent
          },
        ]}
        onPress={toggleMenu}>
        <Icon
          name={isVisible ? 'times' : 'bars'}
          size={30}
          color={currentTheme.bottomMenuIconColor}
        />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.bottomMenu,
          {
            transform: [{ translateY: slideAnim }],
            backgroundColor: currentTheme.bottomMenuBackgroundColor,
          },
        ]}>
        <TouchableOpacity
          style={styles.circularButton}
          onPress={() => onNavigate('Home')} // Navigate to Home
        >
          <Icon
            name="home"
            size={24}
            color={currentTheme.bottomMenuIconColor}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.circularButton}
          onPress={() => onNavigate('SurahSelection')}>
          <Icon
            name="th-list"
            size={24}
            color={currentTheme.bottomMenuIconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.circularButton}
          onPress={() => onNavigate('QuranReadingAyaView')}>
          <Icon
            name="eye-slash"
            size={24}
            color={currentTheme.bottomMenuIconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circularButton} onPress={onThemePress}>
          <Icon
            name="paint-brush"
            size={24}
            color={currentTheme.bottomMenuIconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.circularButton}
          onPress={onTranslationPress}>
          <Icon
            name="language"
            size={24}
            color={currentTheme.bottomMenuIconColor}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.circularButton}
          onPress={onFavoritePress}>
          <Icon
            name="star"
            size={24}
            color={currentTheme.bottomMenuIconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.circularButton}
          onPress={() => onNavigate('SearchPage')}>
          <Icon
            name="search"
            size={24}
            color={currentTheme.bottomMenuIconColor}
          />
        </TouchableOpacity> 
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  bottomMenu: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 5,
  },
  circularButton: {
    width: 45,
    height: 45,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 120, // Move the button higher
    left: 20, // Position the button on the left
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});

export default FloatingBottomMenu;
