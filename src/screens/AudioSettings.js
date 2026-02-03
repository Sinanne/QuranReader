import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useSettings } from './SettingsContext';
import AppText from '../components/common/AppText';
import AppButton from '../components/common/AppButton';
import Card from '../components/common/Card';
import { SPACING } from '../theme/spacing';
import { Music, Zap, Settings as SettingsIcon, ChevronDown } from 'lucide-react-native';
import { RECITERS, RECITER_QUALITIES } from '../constants/Reciters';

const AudioSettings = () => {
  const { settings, applySettings, theme } = useSettings();
  const [showReciterDropdown, setShowReciterDropdown] = useState(false);
  const [showQualityDropdown, setShowQualityDropdown] = useState(false);

  const selectedReciter = RECITERS[settings.reciter] || RECITERS.alafasy;
  const selectedQuality = settings.reciterQuality || 'normal';

  const selectReciter = (reciterId) => {
    applySettings({ reciter: reciterId });
    setShowReciterDropdown(false);
  };

  const selectQuality = (quality) => {
    applySettings({ reciterQuality: quality });
    setShowQualityDropdown(false);
  };

  return (
    <ScrollView style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <AppText variant="header" style={styles.title}>Audio Settings</AppText>

        <Card>
          <View style={styles.sectionHeader}>
            <Music size={20} color={theme.primary} />
            <AppText variant="subheader" style={styles.sectionTitle}>Reciter Selection</AppText>
          </View>
          
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowReciterDropdown(!showReciterDropdown)}
            accessibilityLabel="Select reciter"
            accessibilityHint="Choose Quran recitation voice"
          >
            <AppText style={styles.dropdownText}>{selectedReciter.name}</AppText>
            <ChevronDown size={20} color={theme.text} />
          </TouchableOpacity>
          
          {showReciterDropdown && (
            <View style={styles.dropdown}>
              {Object.values(RECITERS).map((reciter) => (
                <TouchableOpacity
                  key={reciter.id}
                  style={[
                    styles.dropdownItem,
                    settings.reciter === reciter.id && styles.dropdownItemSelected
                  ]}
                  onPress={() => selectReciter(reciter.id)}
                >
                  <View>
                    <AppText style={styles.reciterName}>{reciter.name}</AppText>
                    <AppText style={styles.reciterDescription}>{reciter.description}</AppText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Zap size={20} color={theme.primary} />
            <AppText variant="subheader" style={styles.sectionTitle}>Audio Quality</AppText>
          </View>
          
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowQualityDropdown(!showQualityDropdown)}
            accessibilityLabel="Select audio quality"
            accessibilityHint="Choose audio quality for recitation"
          >
            <AppText style={styles.dropdownText}>
              {selectedQuality.charAt(0).toUpperCase() + selectedQuality.slice(1)} Quality
            </AppText>
            <ChevronDown size={20} color={theme.text} />
          </TouchableOpacity>
          
          {showQualityDropdown && (
            <View style={styles.dropdown}>
              {Object.entries(RECITER_QUALITIES).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.dropdownItem,
                    selectedQuality === key && styles.dropdownItemSelected
                  ]}
                  onPress={() => selectQuality(key)}
                >
                  <AppText style={styles.qualityText}>
                    {key.charAt(0).toUpperCase() + key.slice(1)} ({value})
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <SettingsIcon size={20} color={theme.primary} />
            <AppText variant="subheader" style={styles.sectionTitle}>Playback Settings</AppText>
          </View>
          <View style={styles.toggleRow}>
            <AppText>Auto-Play next Ayah</AppText>
            <Switch
              value={settings.autoPlay}
              onValueChange={(val) => applySettings({ autoPlay: val })}
              trackColor={{ true: theme.primary }}
            />
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Zap size={20} color={theme.primary} />
            <AppText variant="subheader" style={styles.sectionTitle}>Playback</AppText>
          </View>
          <View style={styles.controlRow}>
            <AppText>Speed: {settings.playbackSpeed}</AppText>
            {/* Implementation of speed selection buttons would go here */}
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <SettingsIcon size={20} color={theme.primary} />
            <AppText variant="subheader" style={styles.sectionTitle}>Quality</AppText>
          </View>
          <View style={styles.toggleRow}>
            <AppText>Download HQ Audio</AppText>
            <Switch
              value={settings.audioQuality === 'high'}
              onValueChange={(val) => applySettings({ audioQuality: val ? 'high' : 'low' })}
              trackColor={{ true: theme.primary }}
            />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    padding: SPACING.md,
    gap: SPACING.lg,
  },
  title: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    marginTop: SPACING.sm,
  },
  dropdownItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemSelected: {
    backgroundColor: '#f0f8ff',
  },
  reciterName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  reciterDescription: {
    fontSize: 14,
    color: '#666',
  },
  qualityText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AudioSettings;