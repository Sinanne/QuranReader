import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Switch,
  Share,
} from 'react-native';
import { debounce } from 'lodash';
import { FontAwesome } from '@expo/vector-icons';

const quranData = require('../data/QuranData.json');
const quranEnData = require('../data/QuranEn.json');

const SearchPage = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [exactMatch, setExactMatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [played, setPlayed] = useState([]);
  const [shared, setShared] = useState([]);
  const [translated, setTranslated] = useState([]);

  // Function to remove Tashkeel (diacritical marks) from Arabic text
  const removeTashkeel = (str) => str.replace(/[ً-َِّْْ]/g, '');

  // Function to highlight the matching text in white font on Bordeaux background
  const highlightText = (text, query) => {
    if (!query) return text;

    // Normalize both the text and the query by removing Tashkeel
    const normalizedText = removeTashkeel(text);
    const normalizedQuery = removeTashkeel(query);

    const parts = normalizedText.split(
      new RegExp(`(${normalizedQuery})`, 'gi')
    );

    return parts.map((part, index) => {
      if (part.toLowerCase() === normalizedQuery.toLowerCase()) {
        // Match found, highlight it in white font on Bordeaux background while preserving original Tashkeel
        return (
          <Text key={index} style={styles.highlightedText}>
            {part}
          </Text>
        );
      }
      return part;
    });
  };

  // Handle search logic
  const handleSearch = () => {
    if (query.trim().length < 2) {
      setFilteredData([]);
      return;
    }

    setLoading(true); // Start loading

    const normalizedQuery = removeTashkeel(query).trim();

    const filtered = quranData.filter((aya) => {
      const { aya: ayaText, name, name_eng, name_trns } = aya.details;

      const normalizedAyaText = removeTashkeel(ayaText);

      if (exactMatch) {
        // Exact match with regex to ensure full word match ignoring Tashkeel

        const exactMatchRegex = new RegExp(
          `(^|\\s)${normalizedQuery}(\\s|$)`,
          'g'
        );

        return exactMatchRegex.test(normalizedAyaText);
      } else {
        // Partial match ignoring Tashkeel

        return normalizedAyaText.includes(normalizedQuery);
      }
    });

    // Group results by Surah
    const groupedResults = filtered.reduce((acc, aya) => {
      const surahName = aya.details.name;
      if (!acc[surahName]) {
        acc[surahName] = [];
      }
      acc[surahName].push(aya);
      return acc;
    }, {});

    setFilteredData(groupedResults);
    setLoading(false); // Stop loading
  };

  const debouncedSearch = debounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, exactMatch]);

  const handleExactMatchToggle = () => {
    setExactMatch(!exactMatch);
  };

  const handleClearSearch = () => {
    setQuery('');
    setFilteredData([]);
  };

  const handleFavorite = (ayah) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(ayah)
        ? prevFavorites.filter((fav) => fav !== ayah)
        : [...prevFavorites, ayah]
    );
  };

  const handleBookmark = (ayah) => {
    setBookmarked((prevBookmarked) =>
      prevBookmarked.includes(ayah)
        ? prevBookmarked.filter((item) => item !== ayah)
        : [...prevBookmarked, ayah]
    );
  };

  const handlePlay = (ayah) => {
    setPlayed((prevPlayed) =>
      prevPlayed.includes(ayah)
        ? prevPlayed.filter((item) => item !== ayah)
        : [...prevPlayed, ayah]
    );
  };

  const handleShare = async (ayah) => {
    setShared((prevShared) =>
      prevShared.includes(ayah)
        ? prevShared.filter((item) => item !== ayah)
        : [...prevShared, ayah]
    );

    try {
      await Share.share({
        message: `${ayah.details.name_eng} (${ayah.details.sura}:${ayah.details.aya_sura_id}): '${ayah.details.aya}'\n\nShared from Tasneem app (link to the app)`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleTranslate = (ayah) => {
    setTranslated((prevTranslated) =>
      prevTranslated.includes(ayah)
        ? prevTranslated.filter((item) => item !== ayah)
        : [...prevTranslated, ayah]
    );
  };

  const getTranslation = (sura, aya_sura_id) => {
    const translation = quranEnData.find(
      (item) => item.sura === sura && item.aya_sura_id === aya_sura_id
    );
    return translation ? translation.aya_eng : 'Translation not found';
  };

  const totalResults = Object.values(filteredData).reduce(
    (acc, surah) => acc + surah.length,
    0
  );
  const totalSurahs = Object.keys(filteredData).length;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Quran</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for an aya or surah..."
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearSearch}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Exact Match</Text>
          <Switch
            value={exactMatch}
            onValueChange={handleExactMatchToggle}
            trackColor={{ false: '#767577', true: '#800020' }} // Bordeaux color when on
            thumbColor={exactMatch ? '#ffffff' : '#f4f3f4'} // White thumb color when on
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.resultSummaryContainer}>
          <Text style={styles.resultSummary}>
            {totalResults} result{totalResults !== 1 ? 's' : ''} in{' '}
            {totalSurahs} surah{totalSurahs !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
      <FlatList
        data={Object.keys(filteredData)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.surahContainer}>
            <Text style={styles.surahHeader}>
              {filteredData[item][0].details.name_eng} (
              {filteredData[item][0].details.sura}) {item}
            </Text>
            <Text style={styles.resultCount}>
              {filteredData[item].length} result
              {filteredData[item].length !== 1 ? 's' : ''}
            </Text>
            {filteredData[item].map((aya) => (
              <View key={aya.aya_id} style={styles.resultItem}>
                <View style={styles.iconsContainer}>
                  <FontAwesome
                    name={
                      favorites.includes(aya.details.aya) ? 'heart' : 'heart-o'
                    }
                    size={20} // Increased size by 20%
                    color={
                      favorites.includes(aya.details.aya) ? '#800020' : 'grey'
                    }
                    onPress={() => handleFavorite(aya.details.aya)}
                    style={styles.icon}
                  />
                  <FontAwesome
                    name={bookmarked.includes(aya.details.aya) ? "bookmark" : "bookmark-o"}
                    size={20} // Increased size by 20%
                    color={
                      bookmarked.includes(aya.details.aya) ? '#800020' : 'grey'
                    }
                    onPress={() => handleBookmark(aya.details.aya)}
                    style={styles.icon}
                  />
                  <FontAwesome
                    name="play"
                    size={20} // Increased size by 20%
                    color={
                      played.includes(aya.details.aya) ? '#800020' : 'grey'
                    }
                    onPress={() => handlePlay(aya.details.aya)}
                    style={styles.icon}
                  />
                  <FontAwesome
                    name="share"
                    size={20} // Increased size by 20%
                    color={
                      shared.includes(aya.details.aya) ? '#800020' : 'grey'
                    }
                    onPress={() => handleShare(aya)}
                    style={styles.icon}
                  />
                  <FontAwesome
                    name="language"
                    size={20} // Increased size by 20%
                    color={
                      translated.includes(aya.details.aya) ? '#800020' : 'grey'
                    }
                    onPress={() => handleTranslate(aya.details.aya)}
                    style={styles.icon}
                  />
                </View>
                <View style={styles.surahInfoContainer}>
                  <Text style={styles.surahInfoText}>
                    {aya.details.sura}:{aya.details.aya_sura_id}
                  </Text>
                </View>
                <Text style={styles.resultAya}>
                  {highlightText(aya.details.aya, query)}
                </Text>
                {translated.includes(aya.details.aya) && (
                  <Text style={styles.translatedText}>
                    {getTranslation(aya.details.sura, aya.details.aya_sura_id)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  searchInput: {
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    fontFamily: 'Amiri', // Apply Amiri font to the search input
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    marginRight: 10,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  resultSummaryContainer: {
    backgroundColor: '#F0E68C',
    padding: 7.5,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    width: '60%',
    alignSelf: 'center',
  },
  resultSummary: {
    fontSize: 16,
    color: '#333',
  },
  surahContainer: {
    marginBottom: 20,
  },
  surahHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginLeft: -5, // Removed the little space before the start of the name
  },
  resultCount: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  resultItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
    fontFamily: 'Amiri', // Apply Amiri font to the result items
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  icon: {
    marginRight: 15, // Increased space between icons
  },
  surahInfoContainer: {
    backgroundColor: '#800020',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginBottom: 5,
  },
  surahInfoText: {
    color: '#FFF',
    fontSize: 14,
  },
  resultAya: {
    fontSize: 20,
    color: '#333',
    writingDirection: 'rtl',
    fontFamily: 'Amiri', // Apply Amiri font to the ayah text
  },
  resultSurah: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  highlightedText: {
    color: '#FFF',
    backgroundColor: '#800020',
    fontWeight: 'bold',
  },
  suraInfo: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  translatedText: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
    fontFamily: 'Amiri', // Apply Amiri font to the translated text
  },
});

export default SearchPage;
