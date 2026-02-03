import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome'; // For circular icons
import { Accordion } from 'react-native-collapsible'; // Your existing code for Accordion/Toggles

const ProgressPage = () => {
  const [juzData, setJuzData] = useState([]);
  const [hizbData, setHizbData] = useState([]);
  const [surahData, setSurahData] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [progress, setProgress] = useState(0.6); // Example: 60% progress

  useEffect(() => {
    // Mock data (replace with actual API integration)
    const fetchData = async () => {
      const mockJuzData = Array.from({ length: 30 }, (_, i) => `Juz ${i + 1}`);
      const mockHizbData = Array.from({ length: 60 }, (_, i) => `Hizb ${i + 1}`);
      const mockSurahData = Array.from({ length: 114 }, (_, i) => `Surah ${i + 1}`);
      setJuzData(mockJuzData);
      setHizbData(mockHizbData);
      setSurahData(mockSurahData);
    };

    fetchData();
  }, []);

  const toggleExpand = (menu) => {
    setExpandedMenu((prev) => (prev === menu ? null : menu));
  };

  const handleCheckboxPress = (item) => {
    setCompletedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
    // Update progress here based on the number of completed items
    setProgress(completedItems.length / (juzData.length + hizbData.length + surahData.length));
  };

  const renderItems = (data) => (
    <ScrollView style={styles.scrollContainer}>
      {data.map((item, index) => (
        <View
          key={index}
          style={[
            styles.itemRow,
            completedItems.includes(item) && styles.completedItem,
          ]}
        >
          <Text style={styles.itemText}>{item}</Text>
          <TouchableOpacity
            style={[
              styles.checkbox,
              completedItems.includes(item) && styles.checkboxChecked,
            ]}
            onPress={() => handleCheckboxPress(item)}
          >
            {completedItems.includes(item) && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress Page</Text>

      {/* Juz' Menu */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => toggleExpand('juz')}
        >
          <Text style={styles.menuText}>Juz'</Text>
        </TouchableOpacity>
        {expandedMenu === 'juz' && renderItems(juzData)}
      </View>

      {/* Hizb Menu */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => toggleExpand('hizb')}
        >
          <Text style={styles.menuText}>Hizb</Text>
        </TouchableOpacity>
        {expandedMenu === 'hizb' && renderItems(hizbData)}
      </View>

      {/* Surah Menu */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => toggleExpand('surah')}
        >
          <Text style={styles.menuText}>Surah</Text>
        </TouchableOpacity>
        {expandedMenu === 'surah' && renderItems(surahData)}
      </View>

      
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Progress from Position 18 to 19</Text>
        <Progress.Bar
          progress={progress} // Example: dynamic progress
          width={350}
          height={15}
          color="#FFD700" // Gold color
          borderWidth={0}
          unfilledColor="#e0e0e0"
          borderRadius={10}
        />
      </View>

      {/* Key Metrics Grid */}

      
      <View style={styles.metricsContainer}>
        {/* Days */}
        <View style={styles.metric}>
          <View style={[styles.icon, { backgroundColor: '#FFD700' }]}>
            <Icon name="calendar" size={30} color="#fff" />
          </View>
          <Text style={styles.metricNumber}>13132</Text>
          <Text style={styles.metricLabel}>Days</Text>
        </View>

        {/* Words */}
        <View style={styles.metric}>
          <View style={[styles.icon, { backgroundColor: '#00BFFF' }]}>
            <Icon name="circle" size={30} color="#fff" />
          </View>
          <Text style={styles.metricNumber}>11678/350000</Text>
          <Text style={styles.metricLabel}>Words</Text>
        </View>

        {/* Ayah */}
        <View style={styles.metric}>
          <View style={[styles.icon, { backgroundColor: '#FFA500' }]}>
            <Icon name="circle" size={30} color="#fff" />
          </View>
          <Text style={styles.metricNumber}>354/6300</Text>
          <Text style={styles.metricLabel}>Ayah</Text>
        </View>

        {/* Surah */}
        <View style={styles.metric}>
          <View style={[styles.icon, { backgroundColor: '#800080' }]}>
            <Icon name="book" size={30} color="#fff" />
          </View>
          <Text style={styles.metricNumber}>13/114</Text>
          <Text style={styles.metricLabel}>Surah</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  progressLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menu: {
    marginBottom: 15,
  },
  menuButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  menuText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContainer: {
    maxHeight: 200,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  completedItem: {
    backgroundColor: '#d4edda',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProgressPage;
