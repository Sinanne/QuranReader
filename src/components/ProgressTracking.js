import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axios from 'axios'; // Ensure axios is installed
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome'; // For circular icons

const data = require('../data/QuranStats.json');

const ProgressPage = () => {
  const [completedItems, setCompletedItems] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const toggleExpand = (menu) => {
    setExpandedMenu((prev) => (prev === menu ? null : menu));
  };

  const handleCheckboxPress = (item) => {
    const isSelected = completedItems.includes(item);
    const updatedCompletedItems = isSelected
      ? completedItems.filter((selectedItem) => selectedItem !== item)
      : [...completedItems, item];
    setCompletedItems(updatedCompletedItems);
  };

  const handleSelectAll = (category, isSelectAll) => {
    let itemsToToggle = [];

    if (category === 'juz') {
      itemsToToggle = [
        ...new Set(data.flatMap((item) => [
          `Juz ${item.juz}`,
          `Hizb ${item.hizb}`,
          `${item.sura}. ${item.name_eng}`,
        ])),
      ];
    } else if (category === 'hizb') {
      itemsToToggle = [
        ...new Set(data.flatMap((item) => [
          `Hizb ${item.hizb}`,
          `${item.sura}. ${item.name_eng}`,
        ])),
      ];
    } else if (category === 'surah') {
      itemsToToggle = [...new Set(data.map((item) => `${item.sura}. ${item.name_eng}`))];
    }

    setCompletedItems((prev) =>
      isSelectAll
        ? [...new Set([...prev, ...itemsToToggle])]
        : prev.filter((item) => !itemsToToggle.includes(item))
    );
  };

  const calculateProgress = () => {
    let totalNbr = 0;
    let completedNbr = 0;

    const selectedItems = new Set(completedItems); // Use a Set for unique values

    data.forEach((item) => {
      const isJuzSelected = selectedItems.has(`Juz ${item.juz}`);
      const isHizbSelected = selectedItems.has(`Hizb ${item.hizb}`);
      const isSuraSelected = selectedItems.has(`${item.sura}. ${item.name_eng}`);

      // Add item to completedNbr if Juz, Hizb, or Surah is selected
      if (isJuzSelected || isHizbSelected || isSuraSelected) {
        completedNbr += item.nbr;
      }

      totalNbr += item.nbr;
    });

    // Calculate percentage
    return totalNbr === 0 ? 100 : ((completedNbr / totalNbr) * 100).toFixed(2);
  };

  const calculateSums = () => {
    let totalNbrLtr = 0;
    let totalNbrWord = 0;
    let totalNbrPage = 0;
    let totalNbrAya = 0;
    let totalNbrSura = 0;

    const processedSurahs = new Set();
    const processedHizbs = new Set();
    const processedJuzs = new Set();

    completedItems.forEach((item) => {
      data.forEach((d) => {
        if (item === `Juz ${d.juz}` && !processedJuzs.has(d.juz)) {
          // Process Juz and mark its Hizbs and Surahs as processed
          processedJuzs.add(d.juz);
          processedHizbs.add(d.hizb);
          processedSurahs.add(d.sura);

          totalNbrLtr += d.nbr_ltr || 0;
          totalNbrWord += d.nbr_word || 0;
          totalNbrPage += d.nbr_page || 0;
          totalNbrAya += d.nbr_aya || 0;
        } else if (item === `Hizb ${d.hizb}` && !processedHizbs.has(d.hizb)) {
          // Process Hizb and mark its Surahs as processed
          processedHizbs.add(d.hizb);
          processedSurahs.add(d.sura);

          totalNbrLtr += d.nbr_ltr || 0;
          totalNbrWord += d.nbr_word || 0;
          totalNbrPage += d.nbr_page || 0;
          totalNbrAya += d.nbr_aya || 0;
        } else if (item === `${d.sura}. ${d.name_eng}` && !processedSurahs.has(d.sura)) {
          // Process Surah only if not already processed
          processedSurahs.add(d.sura);

          totalNbrLtr += d.nbr_ltr || 0;
          totalNbrWord += d.nbr_word || 0;
          totalNbrPage += d.nbr_page || 0;
          totalNbrAya += d.nbr_aya || 0;
        }
      });
    });

    // Count unique Surahs
    totalNbrSura = processedSurahs.size;

    return { totalNbrLtr, totalNbrWord, totalNbrPage, totalNbrAya, totalNbrSura };
  };

  const progressPercentage = calculateProgress();
  const { totalNbrLtr, totalNbrWord, totalNbrPage, totalNbrAya, totalNbrSura } = calculateSums();

  const totalNbrLtrAll = data.reduce((sum, item) => sum + (item.nbr_ltr || 0), 0);
  const totalNbrWordAll = data.reduce((sum, item) => sum + (item.nbr_word || 0), 0);
  const totalNbrPageAll = data.reduce((sum, item) => sum + (item.nbr_page || 0), 0);
  const totalNbrAyaAll = data.reduce((sum, item) => sum + (item.nbr_aya || 0), 0);

  const renderItems = (dataList) => (
    <ScrollView style={styles.scrollContainer}>
      {dataList.map((item, index) => (
        <View key={index} style={[styles.itemRow, completedItems.includes(item) && styles.completedItem]}>
          <Text style={styles.itemText}>{item}</Text>
          <TouchableOpacity
            style={[styles.checkbox, completedItems.includes(item) && styles.checkboxChecked]}
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

      {/* Juz Menu */}
      <View style={styles.menu}>
        <View style={styles.menuHeader}>
          <TouchableOpacity style={styles.menuButton} onPress={() => toggleExpand('juz')}>
            <Text style={styles.menuText}>
              Juz {data.filter((item) => completedItems.includes(`Juz ${item.juz}`)).length > 0 &&
                `(${data.filter((item) => completedItems.includes(`Juz ${item.juz}`)).length})`}
            </Text>
          </TouchableOpacity>
          <View style={styles.selectButtons}>
            <TouchableOpacity onPress={() => handleSelectAll('juz', true)}>
              <Text style={styles.selectButtonText}>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectAll('juz', false)}>
              <Text style={styles.selectButtonText}>Unselect All</Text>
            </TouchableOpacity>
          </View>
        </View>
        {expandedMenu === 'juz' &&
          renderItems([...new Set(data.map((item) => `Juz ${item.juz}`))])}
      </View>

      {/* Hizb Menu */}
      <View style={styles.menu}>
        <View style={styles.menuHeader}>
          <TouchableOpacity style={styles.menuButton} onPress={() => toggleExpand('hizb')}>
            <Text style={styles.menuText}>
              Hizb {data.filter((item) => completedItems.includes(`Hizb ${item.hizb}`)).length > 0 &&
                `(${data.filter((item) => completedItems.includes(`Hizb ${item.hizb}`)).length})`}
            </Text>
          </TouchableOpacity>
          <View style={styles.selectButtons}>
            <TouchableOpacity onPress={() => handleSelectAll('hizb', true)}>
              <Text style={styles.selectButtonText}>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectAll('hizb', false)}>
              <Text style={styles.selectButtonText}>Unselect All</Text>
            </TouchableOpacity>
          </View>
        </View>
        {expandedMenu === 'hizb' &&
          renderItems([...new Set(data.map((item) => `Hizb ${item.hizb}`))])}
      </View>

      {/* Surah Menu */}
      <View style={styles.menu}>
        <View style={styles.menuHeader}>
          <TouchableOpacity style={styles.menuButton} onPress={() => toggleExpand('surah')}>
            <Text style={styles.menuText}>
              Surah {completedItems.filter((item) =>
                data.some((d) => `${d.sura}. ${d.name_eng}` === item)
              ).length > 0 &&
                `(${completedItems.filter((item) =>
                  data.some((d) => `${d.sura}. ${d.name_eng}` === item)
                ).length})`}
            </Text>
          </TouchableOpacity>
          <View style={styles.selectButtons}>
            <TouchableOpacity onPress={() => handleSelectAll('surah', true)}>
              <Text style={styles.selectButtonText}>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectAll('surah', false)}>
              <Text style={styles.selectButtonText}>Unselect All</Text>
            </TouchableOpacity>
          </View>
        </View>
        {expandedMenu === 'surah' &&
          renderItems([...new Set(data.map((item) => `${item.sura}. ${item.name_eng}`))])}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={progressPercentage / 100}
          width={350}
          height={20}
          color="#FFD700"
          borderWidth={0}
          unfilledColor="#e0e0e0"
          borderRadius={10}
        />
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>{progressPercentage}%</Text>
        </View>
      </View>

      {/* Key Metrics Grid */}
      <View style={styles.metricsContainer}>
        {/* Days */}
        <View style={styles.metric}>
          <Icon name="calendar" size={50} color="#800000" />
          <Text style={styles.metricNumber}>132</Text>
          <Text style={styles.metricLabel}>Days</Text>
        </View>

        {/* Words */}
        <View style={styles.metric}>
          <Icon name="book" size={50} color="#800000" />
          <Text style={styles.metricNumber}>{totalNbrWord}/{totalNbrWordAll}</Text>
          <Text style={styles.metricLabel}>Words</Text>
        </View>

        {/* Ayah */}
        <View style={styles.metric}>
          <Icon name="file-text" size={50} color="#800000" />
          <Text style={styles.metricNumber}>{totalNbrAya}/{totalNbrAyaAll}</Text>
          <Text style={styles.metricLabel}>Ayah</Text>
        </View>

        {/* Surah */}
        <View style={styles.metric}>
          <Icon name="book" size={50} color="#800000" />
          <Text style={styles.metricNumber}>{totalNbrSura}/114</Text>
          <Text style={styles.metricLabel}>Surah</Text>
        </View>
      </View>

      {/* Counters */}
      <View style={styles.counters}>
        <Text style={styles.counterText}>Total Letters: {totalNbrLtr}</Text>
        <Text style={styles.counterText}>Total Words: {totalNbrWord}</Text>
        <Text style={styles.counterText}>Total Pages: {totalNbrAya}</Text>
        <Text style={styles.counterText}>Total Pages: {totalNbrPage}</Text>
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
  menu: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    flex: 1,
  },
  menuText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectButtons: {
    flexDirection: 'row',
    gap: 10, // Ensures spacing between buttons
  },
  selectButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
    marginHorizontal: 5,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: 20,
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: '#000', // Black text for good contrast
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Roboto', // Modern, clean font
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
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  metric: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%', // Each metric takes up about half the screen width
    marginBottom: 20,
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  metricLabel: {
    fontSize: 14,
    color: '#777',
  },
  counters: {
    marginTop: 20,
  },
  counterText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 5,
  },
});

export default ProgressPage;