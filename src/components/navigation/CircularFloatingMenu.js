// CircularFloatingMenu.js
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CircularFloatingMenu = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    setIsVisible(!isVisible);
    Animated.timing(animation, {
      toValue: isVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const menuStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
  };

  return (
    <>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleMenu}>
        <Icon name={isVisible ? 'times' : 'bars'} size={30} color="#FFF" />
      </TouchableOpacity>
      <Animated.View style={[styles.circularMenu, menuStyle]}>
        <TouchableOpacity style={styles.circularButton} onPress={() => onNavigate('SearchPage')}>
          <Icon name="search" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circularButton} onPress={() => onNavigate('SurahSelection')}>
          <Icon name="th-list" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circularButton} onPress={() => onNavigate('ThemeSelection')}>
          <Icon name="paint-brush" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circularButton} onPress={() => onNavigate('TranslationToggle')}>
          <Icon name="language" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circularButton} onPress={() => onNavigate('QuranReadingAyaView')}>
          <Icon name="crop" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circularButton} onPress={() => onNavigate('FavoritesBookmarks')}>
          <Icon name="star" size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  circularMenu: {
    position: 'absolute',
    bottom: 80,
    right: 80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#800020',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  circularButton: {
    width: 45,
    height: 45,
    borderRadius: 35,
    backgroundColor: '#800020',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#800020',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});

export default CircularFloatingMenu;