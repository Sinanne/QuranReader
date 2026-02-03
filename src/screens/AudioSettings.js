// src/screens/AudioSettings.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Picker } from '@react-native-picker/picker';
import { useSettings } from './SettingsContext';

const AudioSettings = () => {
  const { settings, applySettings } = useSettings();
  const [isReciterCollapsed, setIsReciterCollapsed] = useState(true);
  const [isPlaybackSpeedCollapsed, setIsPlaybackSpeedCollapsed] = useState(true);
  const [isAudioQualityCollapsed, setIsAudioQualityCollapsed] = useState(true);
  const [reciter, setReciter] = useState(settings.reciter || 'Reciter1');
  const [playbackSpeed, setPlaybackSpeed] = useState(settings.playbackSpeed || 'normal');
  const [audioQuality, setAudioQuality] = useState(settings.audioQuality || 'high');
  const [autoPlay, setAutoPlay] = useState(settings.autoPlay || false);

  const toggleReciterSection = () => {
    setIsReciterCollapsed(!isReciterCollapsed);
  };

  const togglePlaybackSpeedSection = () => {
    setIsPlaybackSpeedCollapsed(!isPlaybackSpeedCollapsed);
  };

  const toggleAudioQualitySection = () => {
    setIsAudioQualityCollapsed(!isAudioQualityCollapsed);
  };

  const handleReciterChange = (value) => {
    setReciter(value);
    applySettings({ reciter: value });
  };

  const handlePlaybackSpeedChange = (value) => {
    setPlaybackSpeed(value);
    applySettings({ playbackSpeed: value });
  };

  const handleAudioQualityChange = (value) => {
    setAudioQuality(value);
    applySettings({ audioQuality: value });
  };

  const handleAutoPlayChange = (value) => {
    setAutoPlay(value);
    applySettings({ autoPlay: value });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Reciter Selection */}
      <TouchableOpacity onPress={toggleReciterSection} style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>Reciter Selection</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isReciterCollapsed}>
        <View style={styles.accordionContent}>
          <Picker
            selectedValue={reciter}
            style={styles.picker}
            onValueChange={(itemValue) => handleReciterChange(itemValue)}
          >
            <Picker.Item label="Reciter 1" value="Reciter1" />
            <Picker.Item label="Reciter 2" value="Reciter2" />
            <Picker.Item label="Reciter 3" value="Reciter3" />
          </Picker>
        </View>
      </Collapsible>

      {/* Playback Speed */}
      <TouchableOpacity onPress={togglePlaybackSpeedSection} style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>Playback Speed</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isPlaybackSpeedCollapsed}>
        <View style={styles.accordionContent}>
          <Picker
            selectedValue={playbackSpeed}
            style={styles.picker}
            onValueChange={(itemValue) => handlePlaybackSpeedChange(itemValue)}
          >
            <Picker.Item label="Slow" value="slow" />
            <Picker.Item label="Normal" value="normal" />
            <Picker.Item label="Fast" value="fast" />
          </Picker>
        </View>
      </Collapsible>

      {/* Audio Quality */}
      <TouchableOpacity onPress={toggleAudioQualitySection} style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>Audio Quality</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isAudioQualityCollapsed}>
        <View style={styles.accordionContent}>
          <Picker
            selectedValue={audioQuality}
            style={styles.picker}
            onValueChange={(itemValue) => handleAudioQualityChange(itemValue)}
          >
            <Picker.Item label="Low" value="low" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="High" value="high" />
          </Picker>
        </View>
      </Collapsible>

      {/* Auto-Play */}
      <View style={styles.autoPlayContainer}>
        <Text style={styles.autoPlayText}>Auto-Play</Text>
        <Switch
          value={autoPlay}
          onValueChange={(value) => handleAutoPlayChange(value)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  accordionHeader: {
    padding: 15,
    backgroundColor: '#800020', // Bordeaux color
    borderRadius: 10,
    marginBottom: 10,
  },
  accordionHeaderText: {
    fontSize: 18,
    color: '#ffffff', // White text color
    fontWeight: 'bold',
  },
  accordionContent: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  autoPlayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
  },
  autoPlayText: {
    fontSize: 18,
    color: '#800020', // Bordeaux color
    fontWeight: 'bold',
  },
});

export default AudioSettings;