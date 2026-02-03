import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ArchiveScreen = () => {
  const [archivedSessions, setArchivedSessions] = useState([]);

  useEffect(() => {
    const loadArchivedSessions = async () => {
      const sessions = JSON.parse(await AsyncStorage.getItem('archivedSessions')) || [];
      setArchivedSessions(sessions);
    };

    loadArchivedSessions();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Start Date: {new Date(item.startDate).toLocaleDateString()}</Text>
      <Text style={styles.cardText}>End Date: {new Date(item.endDate).toLocaleDateString()}</Text>
      <Text style={styles.cardText}>Reading Progress: {item.selectedItems.length}</Text>
      <Text style={styles.cardText}>Last Surah Read: {item.selectedItems[item.selectedItems.length - 1]?.sura}</Text>
      {/* Add more details as needed */}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={archivedSessions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  card: {
    backgroundColor: '#F0E68C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#000',
  },
});

export default ArchiveScreen;