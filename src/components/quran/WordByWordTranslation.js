import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AppText from '../common/AppText';
import Card from '../common/Card';
import { useSettings } from '../../screens/SettingsContext';
import { SPACING } from '../../theme/spacing';
import { ChevronDown, Book, Volume2 } from 'lucide-react-native';

const WordByWordTranslation = ({ aya, translation, onWordPress }) => {
  const { theme, settings } = useSettings();
  const [showTranslation, setShowTranslation] = useState(settings.showWordByWord || false);
  const [expandedWords, setExpandedWords] = useState({});

  // Split Arabic text into words
  const arabicWords = aya.details.aya.trim().split(/\s+/).filter(word => word.length > 0);
  
  // Split English translation into words
  const englishWords = translation.trim().split(/\s+/).filter(word => word.length > 0);

  // Create word mappings (simplified - in real app, this would come from a structured dataset)
  const wordMappings = arabicWords.map((arabicWord, index) => ({
    id: `word-${index}`,
    arabic: arabicWord,
    english: englishWords[index] || '',
    number: index + 1,
    morphology: {
      root: getWordRoot(arabicWord),
      type: getWordType(arabicWord),
      pronunciation: getWordPronunciation(arabicWord),
    }
  }));

  const toggleWordDetails = (wordId) => {
    setExpandedWords(prev => ({
      ...prev,
      [wordId]: !prev[wordId]
    }));
  };

  const handleWordPress = (word) => {
    if (onWordPress) {
      onWordPress(word);
    }
  };

  if (!showTranslation) {
    return (
      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => setShowTranslation(true)}
        accessibilityLabel="Show word-by-word translation"
        accessibilityHint="Tap to see detailed word translation"
      >
        <Book size={16} color={theme.primary} />
        <AppText variant="caption" style={styles.expandText}>
          Word-by-Word
        </AppText>
      </TouchableOpacity>
    );
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setShowTranslation(false)}
          style={styles.collapseButton}
          accessibilityLabel="Hide word-by-word translation"
        >
          <AppText variant="caption" style={styles.headerText}>
            {aya.details.sura}:{aya.details.aya_sura_id}
          </AppText>
        </TouchableOpacity>
        
        <AppText style={styles.title}>Word-by-Word Analysis</AppText>
        
        <TouchableOpacity style={styles.audioButton}>
          <Volume2 size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.wordsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {wordMappings.map((word, index) => (
          <View key={word.id} style={styles.wordContainer}>
            <View style={styles.wordHeader}>
              <TouchableOpacity
                style={styles.wordNumber}
                onPress={() => handleWordPress(word)}
                accessibilityLabel={`Word ${word.number} details`}
              >
                <AppText style={styles.numberText}>{word.number}</AppText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.arabicWordContainer}
                onPress={() => toggleWordDetails(word.id)}
                accessibilityLabel={`${word.arabic}. Tap for details`}
              >
                <AppText variant="arabic" style={styles.arabicWord}>
                  {word.arabic}
                </AppText>
              </TouchableOpacity>
            </View>

            {expandedWords[word.id] && (
              <View style={styles.wordDetails}>
                <View style={styles.detailRow}>
                  <AppText style={styles.detailLabel}>Root:</AppText>
                  <AppText style={styles.detailValue}>{word.morphology.root}</AppText>
                </View>
                
                <View style={styles.detailRow}>
                  <AppText style={styles.detailLabel}>Type:</AppText>
                  <AppText style={styles.detailValue}>{word.morphology.type}</AppText>
                </View>
                
                <View style={styles.detailRow}>
                  <AppText style={styles.detailLabel}>Pronunciation:</AppText>
                  <AppText style={styles.detailValue}>{word.morphology.pronunciation}</AppText>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </Card>
  );
};

// Helper functions (simplified for demo)
const getWordRoot = (word) => {
  // In a real app, this would use a comprehensive Arabic morphology database
  const roots = {
    'بِسْمِ': 'بسم',
    'اللَّهِ': 'له',
    'الرَّحْمَـٰنِ': 'رحمن',
    'الرَّحِيمِ': 'رحيم',
  };
  
  return roots[word] || word;
};

const getWordType = (word) => {
  const types = {
    'بِسْمِ': 'Noun - Prefixed',
    'اللَّهِ': 'Noun - Definite',
    'الرَّحْمَـٰنِ': 'Adjective - Superlative',
    'الرَّحِيمِ': 'Adjective - Elative',
  };
  
  return types[word] || 'Unknown';
};

const getWordPronunciation = (word) => {
  const pronunciations = {
    'بِسْمِ': 'bis-mi',
    'اللَّهِ': 'al-la-hi',
    'الرَّحْمَـٰنِ': 'ar-raḥ-ma-ni',
    'الرَّحِيمِ': 'ar-raḥi-mi',
  };
  
  return pronunciations[word] || word;
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  expandText: {
    marginLeft: SPACING.sm,
    color: '#007aff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  collapseButton: {
    flex: 1,
  },
  headerText: {
    fontSize: 12,
    color: '#6c757d',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  audioButton: {
    padding: SPACING.sm,
  },
  wordsContainer: {
    maxHeight: 400,
  },
  scrollContent: {
    paddingBottom: SPACING.lg,
  },
  wordContainer: {
    marginBottom: SPACING.md,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  wordNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  numberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  arabicWordContainer: {
    flex: 1,
    padding: SPACING.sm,
  },
  arabicWord: {
    fontSize: 20,
    lineHeight: 32,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  wordDetails: {
    padding: SPACING.md,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#212529',
    flex: 2,
    textAlign: 'right',
  },
});

export default WordByWordTranslation;