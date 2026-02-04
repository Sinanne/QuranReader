// HorizontalScrollableMenu.js
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HorizontalScrollableMenu = ({ onNavigate }) => {
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
        <ScrollView horizontal style={styles.scrollableMenu}>
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
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollableMenu: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: '#800020',
    borderRadius: 30,
    elevation: 5,
  },
  circularButton: {
    width: 45,
    height: 45,
    borderRadius: 35,
    backgroundColor: '#800020',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
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

export default HorizontalScrollableMenu;