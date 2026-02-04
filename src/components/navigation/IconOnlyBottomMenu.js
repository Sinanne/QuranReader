// IconOnlyBottomMenu.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const IconOnlyBottomMenu = ({ onNavigate }) => {
  return (
    <View style={styles.bottomMenu}>
      <TouchableOpacity onPress={() => onNavigate('SearchPage')}>
        <Icon name="search" size={30} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('SurahSelection')}>
        <Icon name="th-list" size={30} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('ThemeSelection')}>
        <Icon name="paint-brush" size={30} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('TranslationToggle')}>
        <Icon name="language" size={30} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('QuranReadingAyaView')}>
        <Icon name="crop" size={30} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('FavoritesBookmarks')}>
        <Icon name="star" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#800020',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default IconOnlyBottomMenu;