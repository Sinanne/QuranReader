import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Platform } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons'; // Importing FontAwesome5 for icons
import Themes, { getThemeStyles } from './Themes'; // Import themes
import { useSettings } from './SettingsContext'; // Import useSettings

const data = require('../data/QuranStats.json');

const ProgressTracking = ({ navigation }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    juz: false,
    hizb: false,
    sura: false,
  });
const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today's date
  const [totalWords, setTotalWords] = useState(0);
const onChange = (event, date) => {
  if (date) {
    setSelectedDate(date);
  }
};
  const [totals, setTotals] = useState({
    totalNbrLtr: 0,
    totalNbrWord: 0,
    totalNbrPage: 0,
    totalNbrAya: 0,
    totalNbrSura: 0,
  });

  const totalNbr = data.reduce((sum, item) => sum + item.nbr, 0);

  const calculateProgress = () => {
    const selectedNbr = selectedItems.reduce((sum, item) => {
      const matchingData = data.find(
        (d) => d.juz === item.juz && d.hizb === item.hizb && d.sura === item.sura
      );
      return sum + (matchingData ? matchingData.nbr : 0);
    }, 0);
    return Math.floor((selectedNbr / totalNbr) * 100);
  };

   const progressPercentage = calculateProgress();

  const calculateWords = () => {
    const selectedNbr = selectedItems.reduce((sum, item) => {
      const matchingData = data.find(
        (d) => d.juz === item.juz && d.hizb === item.hizb && d.sura === item.sura
      );
      return sum + (matchingData ? matchingData.nbr_word : 0);
    }, 0);
    return Math.floor(selectedNbr);
  };

  const progressWords = calculateWords();

    const calculateAyas = () => {
    const selectedNbr = selectedItems.reduce((sum, item) => {
      const matchingData = data.find(
        (d) => d.juz === item.juz && d.hizb === item.hizb && d.sura === item.sura
      );
      return sum + (matchingData ? matchingData.nbr_aya : 0);
    }, 0);
    return Math.floor(selectedNbr);
  };
  const progressAyas = calculateAyas();

  const calculateDistinctSura = () => {
  const distinctSura = new Set();

  selectedItems.forEach((item) => {
    data.forEach((d) => {
      if (d.juz === item.juz && d.hizb === item.hizb && d.sura === item.sura) {
        distinctSura.add(d.sura); // Assuming `d.sura` is the unique identifier for an aya
      }
    });
  });

  return distinctSura.size; // Return the count of distinct suras
};

  const progressSuras = calculateDistinctSura();


  const toggleSection = (section) => {
    setExpandedSections((prevSections) => ({
      juz: section === 'juz' ? !prevSections.juz : false,
      hizb: section === 'hizb' ? !prevSections.hizb : false,
      sura: section === 'sura' ? !prevSections.sura : false,
    }));
  };

  const totalNbrLtrAll = data.reduce((sum, item) => sum + (item.nbr_ltr || 0), 0);
  const totalNbrWordAll = data.reduce((sum, item) => sum + (item.nbr_word || 0), 0);
  const totalNbrPageAll = data.reduce((sum, item) => sum + (item.nbr_page || 0), 0);
  const totalNbrAyaAll = data.reduce((sum, item) => sum + (item.nbr_aya || 0), 0);
  

    const getColor = (itemType, itemValue) => {
    const relatedItems = data.filter((d) => d[itemType] === itemValue);

    const allRelatedSelected = relatedItems.every((d) =>
      selectedItems.some(
        (sel) =>
          sel.juz === d.juz && sel.hizb === d.hizb && sel.sura === d.sura
      )
    );

    const someRelatedSelected = relatedItems.some((d) =>
      selectedItems.some(
        (sel) =>
          sel.juz === d.juz && sel.hizb === d.hizb && sel.sura === d.sura
      )
    );

    if (allRelatedSelected) return "#0B6623"; // Emerald Green
    if (someRelatedSelected) return "#c7eA46"; // Light Green
    return "#f1e3A4"; // Ivory
  };

  const getTextStyle = (itemType, itemValue) => {
    const relatedItems = data.filter((d) => d[itemType] === itemValue);

    const allRelatedSelected = relatedItems.every((d) =>
      selectedItems.some(
        (sel) =>
          sel.juz === d.juz && sel.hizb === d.hizb && sel.sura === d.sura
      )
    );

    const someRelatedSelected = relatedItems.some((d) =>
      selectedItems.some(
        (sel) =>
          sel.juz === d.juz && sel.hizb === d.hizb && sel.sura === d.sura
      )
    );

    if (allRelatedSelected) return styles.boldText;
    if (someRelatedSelected) return styles.blackText;
    return styles.darkText;
  };

  const toggleSelection = (itemType, itemValue) => {
    const relatedItems = data.filter((d) => d[itemType] === itemValue);

    const isSelected = relatedItems.every((d) =>
      selectedItems.some(
        (sel) =>
          sel.juz === d.juz && sel.hizb === d.hizb && sel.sura === d.sura
      )
    );

    let updatedSelection;
    if (isSelected) {
      updatedSelection = selectedItems.filter(
        (sel) =>
          !relatedItems.some(
            (d) => sel.juz === d.juz && sel.hizb === d.hizb && sel.sura === d.sura
          )
      );
    } else {
      updatedSelection = [
        ...selectedItems,
        ...relatedItems.filter(
          (d) =>
            !selectedItems.some(
              (sel) =>
                sel.juz === d.juz && sel.hizb === d.hizb && sel.sura === d.sura
            )
        ),
      ];
    }
    setSelectedItems(updatedSelection);
  };

  const renderSurahItem = (sura, suraName) => {
    const arabicNumbers = {
      0: '٠',
      1: '١',
      2: '٢',
      3: '٣',
      4: '٤',
      5: '٥',
      6: '٦',
      7: '٧',
      8: '٨',
      9: '٩',
    };

    const convertToArabicNumbers = (num) => {
      return num.toString().split('').map(digit => arabicNumbers[digit]).join('');
    };

    const arabicLabel = `${convertToArabicNumbers(sura)}. ${data.find(d => d.sura === sura).name}`;

    return (
      <TouchableOpacity
      style={[styles.checkboxContainer, { backgroundColor: getColor("sura", sura) }]}
         onPress={() => toggleSelection("sura", sura)}
      >
        <View style={styles.checkboxTextContainer}>
          <Text style={[styles.checkboxText, getTextStyle("sura", sura)]}>{`${sura}. ${suraName}`}</Text>
          <Text style={[styles.checkboxText, getTextStyle("sura", sura)]}>{arabicLabel}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = (itemType, itemValue, label) => {
    const arabicNumbers = {
      0: '٠',
      1: '١',
      2: '٢',
      3: '٣',
      4: '٤',
      5: '٥',
      6: '٦',
      7: '٧',
      8: '٨',
      9: '٩',
    };

    const convertToArabicNumbers = (num) => {
      return num.toString().split('').map(digit => arabicNumbers[digit]).join('');
    };

    const arabicLabel = itemType === "juz" ? `جزء ${convertToArabicNumbers(itemValue)}` : itemType === "hizb" ? `حزب ${convertToArabicNumbers(itemValue)}` : '';

    return (
      <TouchableOpacity
        style={[
          styles.checkboxContainer, 
          { backgroundColor: getColor(itemType, itemValue) }]}
        onPress={() => toggleSelection(itemType, itemValue)}
      >
        <View style={styles.checkboxTextContainer}>
          <Text style={[styles.checkboxText, getTextStyle(itemType, itemValue)]}>{label}</Text>
          <Text style={[styles.checkboxText, getTextStyle(itemType, itemValue)]}>{arabicLabel}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - selectedDate);
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  useEffect(() => {
    const loadInitialData = async () => {
      const savedDate = await loadSessionData('readingStartDate');
      const savedSelections = await loadSessionData('selectedItems');
      if (savedDate) setSelectedDate(new Date(savedDate));
      if (savedSelections) setSelectedItems(savedSelections);
    };

    loadInitialData();
  }, []);
  useEffect(() => {
    saveSessionData('readingStartDate', selectedDate);
    saveSessionData('selectedItems', selectedItems);
  }, [selectedDate, selectedItems]);
  useEffect(() => {
  if (selectedItems.length > 0) {
    const lastReadSurah = selectedItems[selectedItems.length - 1].sura;
    const lastReadSurahName = data.find(d => d.sura === lastReadSurah).name_eng;
    saveSessionData('lastReadSurah', lastReadSurahName);
    saveSessionData('progressPercentage', progressPercentage);
  }
}, [selectedItems, progressPercentage]);
  const saveSessionData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Failed to save data", e);
    }
  };

  const loadSessionData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

      return (
    <View style={styles.container}>
    <Image
  source={{ uri: 'https://freeislamiccalligraphy.com/wp-content/uploads/2013/06/Shahada-Square-Kufic.png' }}
  style={{ width: '100%', height: 80, marginTop: 0, marginBottom: 10 }} // Corrected typo in marginBottom and marginTop
  resizeMode="cover" // Set resizeMode to 'cover' for cropping
  />

<View style={styles.datePickerContainer}>
  <DateTimePicker
    value={selectedDate}
    mode="date"
    display="default"
    onChange={onChange}
    textColor="black" // Set the text color to typical Apple blue
  />
</View>

      {/* Juz Section */}
      <TouchableOpacity
        style={[styles.accordionHeader, expandedSections.juz ? styles.expandedHeader : styles.collapsedHeader]}
        onPress={() => toggleSection("juz")}
      >
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Juz</Text>
          <Text style={styles.arabicText}>جزء</Text>
        </View>
      </TouchableOpacity>
      {expandedSections.juz && (
        <FlatList
          data={[...new Set(data.map((d) => d.juz))]}
          renderItem={({ item }) => renderItem("juz", item, `Juz ${item}`)}
          keyExtractor={(item) => `juz-${item}`}
          style={styles.flatList}
        />
      )}

      {/* Hizb Section */}
      <TouchableOpacity
        style={[styles.accordionHeader, expandedSections.hizb ? styles.expandedHeader : styles.collapsedHeader]}
        onPress={() => toggleSection("hizb")}
      >
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Hizb</Text>
          <Text style={styles.arabicText}>حزب</Text>
        </View>
      </TouchableOpacity>
      
      {expandedSections.hizb && (
        <FlatList
          data={[...new Set(data.map((d) => d.hizb))]}
          renderItem={({ item }) => renderItem("hizb", item, `Hizb ${item}`)}
          keyExtractor={(item) => `hizb-${item}`}
          style={styles.flatList}
        />
      )}

      {/* Surah Section */}
      <TouchableOpacity
        style={[styles.accordionHeader, expandedSections.sura ? styles.expandedHeader : styles.collapsedHeader]}
        onPress={() => toggleSection("sura")}
      >
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Surah</Text>
          <Text style={styles.arabicText}>سورة</Text>
        </View>
      </TouchableOpacity>

      {expandedSections.sura && (
        <FlatList
          data={[
            ...new Map(
              data.map((d) => [d.sura, { sura: d.sura, name: d.name_eng }])
            ).values(),
          ]}
          renderItem={({ item }) => renderSurahItem(item.sura, item.name)}
          keyExtractor={(item) => `sura-${item.sura}`}
          style={styles.flatList}
        />
      )}

import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient component

<View style={styles.progressBarRow}>
  <Text style={styles.progressLabel}>Progress</Text>
  <View style={[styles.progressBarContainer, { width: '70%' }]}>
    <LinearGradient
      colors={['#f1c232', '#FFD700', '#f1c232', '#FFD700', '#f1c232', '#FFD700']}
      start={[0, 0]}
      end={[1, 0]}
      style={[styles.progressBar, { width: `${progressPercentage}%` }]}
    >
    </LinearGradient>
  </View>
  <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
</View>

      {/* Key Metrics Grid */}
      <View style={styles.metricsContainer}>
        {/* Days */}
        <View style={styles.metric}>
          <FontAwesome5 name="calendar-alt" size={30} color="#800020" />
          <Text style={styles.metricNumber}>{totalDays}</Text>
          <Text style={styles.metricLabel}>days</Text>
        </View>

        {/* Ayah */}
        <View style={styles.metric}>
          <FontAwesome5 name="terminal" size={30} color="#800020" />
          <Text style={styles.metricNumber}> {progressAyas}/{totalNbrAyaAll} </Text>
          <Text style={styles.metricLabel}>ayahs</Text>
        </View>

        {/* Surah */}
        <View style={styles.metric}>
          <FontAwesome5 name="align-justify" size={30} color="#800020" />
          <Text style={styles.metricNumber}> {progressSuras}/114</Text>
          <Text style={styles.metricLabel}>surahs</Text>
        </View>
      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 100, 
    backgroundColor: "#FFFFFF",
  },
  topImage: {
    width: '100%',
    height: 100, // Adjust the height as needed
    resizeMode: 'contain',
    marginBottom: 10, // Add some space below the image
  },
  icon: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 16,
  },
progressBarRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
},
progressBarContainer: {
  height: 26,
  backgroundColor: '#E0E0E0',
  borderRadius: 12,
  overflow: 'hidden',
  marginTop: 24,
  marginBottom: 20,
  position: 'relative',
  flexDirection: 'row',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
},
progressBar: {
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  position: 'relative',
},
progressText: {
  fontSize: 12,
  fontFamily:'SF-Pro',
  fontWeight: "bold",
  color: "#FFFFFF",
  position: 'absolute',
  left: 5,
  top: '50%',
  transform: [{ translateY: -12 }],
},
progressTextOutside: {
  fontSize: 12,
  fontFamily:'SF-Pro',
  fontWeight: "bold",
  color: "#000000",
  position: 'absolute',
  left: 5,
  top: '50%',
  transform: [{ translateY: -12 }],
},
progressLabel: {
  fontSize: 14,
  fontWeight: "bold",
  color: "#800020", // Bordeaux color
  marginRight: 5, // Add some space between the label and the progress bar
},
progressPercentage: {
  fontSize: 14,
  fontWeight: "bold",
  color: '#800020', // Bordeaux color
  marginLeft: 5, // Add some space between the progress bar and the percentage
},
  accordionHeader: {
    padding: 12,
    marginBottom: 4,
    borderRadius: 8,
  },
  expandedHeader: {
    backgroundColor: '#800020', // Bordeaux
     width: '90%', // Set the width to 85%
    alignSelf: 'center', // Center the FlatList
  },
  collapsedHeader: {
    backgroundColor: '#800020', // Jaune
     width: '85%', // Set the width to 85%
    alignSelf: 'center', // Center the FlatList
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 19,
    fontFamily: 'Amiri',
    fontWeight: "bold",
    color: '#FFFFFF',
  },
  arabicText: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#FFFFFF',
    fontFamily:'Amiri',
  },
  checkboxContainer: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
      },
  checkboxTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkboxText: {
    fontSize: 14,
    fontFamily: 'Amiri',
    color: '#800020',
  },
  boldText: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  blackText: {
    color: "#000000",
  },
  darkText: {
    color: "#000000",
  },
  flatList: {
    maxHeight: 172, // Increased height to show more rows
    width: '85%', // Set the width to 85%
    alignSelf: 'center', // Center the FlatList
   },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    position: 'absolute', // Make the metrics container fixed
    bottom: 0, // Position it at the bottom
    left: 40,
    right: 40,
    zIndex: 10, // Ensure it stays above other elements
    backgroundColor: 'white', // Optional: Set a background color to match the page
    padding: 8, // Reduced padding for less space around the metrics
  },
  metric: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%', // Adjusted width to fit all metrics in one row
    marginBottom: 10, // Reduced marginBottom for less space below each metric
  },
  metricNumber: {
    fontSize: 14,
    color: '#800020',
    marginTop: 5,
    whiteSpace: 'nowrap', // Prevent text wrapping (for web)
  },
  metricLabel: {
    fontSize: 14,
    color: '#800020',
  },
  datePickerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop:10,
  marginBottom: 20,
  position: 'relative',
},
});

export default ProgressTracking;