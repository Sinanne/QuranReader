// MinimalisticTopBar.js
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const MinimalisticTopBar = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleMenu = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleMenu}>
        <Icon name={isVisible ? 'times' : 'bars'} size={30} color="#FFF" />
      </TouchableOpacity>
      {isVisible && (
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('SearchPage')}>
            <Icon name="search" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('SurahSelection')}>
            <Icon name="th-list" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('ThemeSelection')}>
            <Icon name="paint-brush" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('TranslationToggle')}>
            <Icon name="language" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('QuranReadingAyaView')}>
            <Icon name="crop" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('FavoritesBookmarks')}>
            <Icon name="star" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#800020',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  iconButton: {
    padding: 10,
  },
  toggleButton: {
    position: 'absolute',
    top: 20,
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

export default MinimalisticTopBar;