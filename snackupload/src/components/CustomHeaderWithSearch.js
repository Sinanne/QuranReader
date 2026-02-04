// src/components/CustomHeaderWithSearch.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomHeaderWithSearch = ({ title, onSearchPress }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity onPress={onSearchPress} style={styles.searchIcon}>
        <Icon name="search" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#800020', // Bordeaux background
    padding: 10,
    paddingTop: 60, // Increase paddingTop to add more space above the content
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#FFFFFF', // White text color
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchIcon: {
    padding: 10,
  },
});

export default CustomHeaderWithSearch;