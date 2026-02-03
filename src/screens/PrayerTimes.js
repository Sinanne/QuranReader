import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppText from '../components/common/AppText';
import Card from '../components/common/Card';
import { useSettings } from './SettingsContext';
import StorageService from '../services/StorageService';
import { SPACING } from '../theme/spacing';
import { Clock, MapPin, Bell, Settings } from 'lucide-react-native';

const PrayerTimes = ({ navigation }) => {
  const { theme, settings, applySettings } = useSettings();
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const prayerNames = {
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
  };

  // Calculate prayer times (simplified - real app would use Islamic calculations)
  const calculatePrayerTimes = async (lat, lng, date) => {
    // This is a simplified calculation - real app would use established Islamic prayer algorithms
    const prayerCalculation = {
      fajr: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 5, 0),
      sunrise: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 30),
      dhuhr: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 30),
      asr: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 16, 0),
      maghrib: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 19, 0),
      isha: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 20, 30),
    };

    return prayerCalculation;
  };

  const getLocation = async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location services for accurate prayer times',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Linking.openSettings() }
          ]
        );
        setIsLoading(false);
        return;
      }

      const locationResult = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationResult.coords;
      
      setLocation({ latitude, longitude });
      await StorageService.set(StorageService.KEYS.PRAYER_LOCATION, { latitude, longitude });
      
      // Calculate prayer times with new location
      const times = await calculatePrayerTimes(latitude, longitude, selectedDate);
      setPrayerTimes(times);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error getting location:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Could not get location. Please check your GPS settings.');
    }
  };

  const loadStoredData = async () => {
    try {
      const storedLocation = await StorageService.get(StorageService.KEYS.PRAYER_LOCATION);
      const storedTimes = await StorageService.get(StorageService.KEYS.PRAYER_TIMES);
      
      if (storedLocation) {
        setLocation(storedLocation);
        const times = await calculatePrayerTimes(
          storedLocation.latitude,
          storedLocation.longitude,
          selectedDate
        );
        setPrayerTimes(times);
      } else if (storedTimes) {
        setPrayerTimes(storedTimes);
      }
    } catch (error) {
      console.error('Error loading prayer data:', error);
    }
  };

  const dateChanged = async (newDate) => {
    setSelectedDate(newDate);
    if (location) {
      const times = await calculatePrayerTimes(
        location.latitude,
        location.longitude,
        newDate
      );
      setPrayerTimes(times);
      await StorageService.set(StorageService.KEYS.PRAYER_TIMES, times);
    }
  };

  const getCurrentPrayer = () => {
    if (!prayerTimes) return null;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
      { name: 'Fajr', time: prayerTimes.fajr },
      { name: 'Dhuhr', time: prayerTimes.dhuhr },
      { name: 'Asr', time: prayerTimes.asr },
      { name: 'Maghrib', time: prayerTimes.maghrib },
      { name: 'Isha', time: prayerTimes.isha },
    ];

    for (const prayer of prayers) {
      const prayerMinutes = prayer.time.getHours() * 60 + prayer.time.getMinutes();
      if (prayerMinutes > currentTime) {
        return prayer;
      }
    }
    
    return prayers[0]; // Return first prayer of next day
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    loadStoredData();
  }, []);

  const currentPrayer = getCurrentPrayer();

  return (
    <ScrollView style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText variant="header" style={styles.title}>Prayer Times</AppText>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={() => setShowLocationPicker(!showLocationPicker)}
            accessibilityLabel="Change location"
            accessibilityHint="Update your location for accurate prayer times"
          >
            <MapPin size={20} color={theme.primary} />
            <AppText style={styles.locationText}>
              {location ? `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°` : 'Set Location'}
            </AppText>
          </TouchableOpacity>
        </View>

        <Card style={styles.dateCard}>
          <View style={styles.dateHeader}>
            <Clock size={20} color={theme.primary} />
            <AppText variant="subheader" style={styles.dateTitle}>Date</AppText>
          </View>
          
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={dateChanged}
            style={styles.datePicker}
            maximumDate={new Date()}
            minimumDate={new Date(new Date().setDate(new Date().getDate() - 30))}
          />
        </Card>

        {isLoading ? (
          <Card>
            <View style={styles.loadingContainer}>
              <AppText>Loading prayer times...</AppText>
            </View>
          </Card>
        ) : prayerTimes ? (
          <Card style={styles.prayersCard}>
            <View style={styles.prayersHeader}>
              <Bell size={20} color={theme.primary} />
              <AppText variant="subheader" style={styles.prayersTitle}>Today's Prayers</AppText>
            </View>
            
            <View style={styles.prayersGrid}>
              {Object.entries(prayerTimes).map(([key, time]) => (
                <View key={key} style={styles.prayerRow}>
                  <AppText style={styles.prayerName}>
                    {prayerNames[key]}
                  </AppText>
                  <AppText style={styles.prayerTime}>
                    {formatTime(time)}
                  </AppText>
                </View>
              ))}
            </View>

            {currentPrayer && (
              <View style={styles.currentPrayer}>
                <AppText style={styles.currentPrayerText}>
                  Next: {currentPrayer.name} - {formatTime(currentPrayer.time)}
                </AppText>
              </View>
            )}
          </Card>
        ) : (
          <Card>
            <View style={styles.noDataContainer}>
              <AppText style={styles.noDataText}>
                No prayer times available. Please set your location.
              </AppText>
              <TouchableOpacity
                style={styles.getLocationButton}
                onPress={getLocation}
                accessibilityLabel="Get current location"
                accessibilityHint="Use GPS to determine prayer times"
              >
                <MapPin size={16} color="white" />
                <AppText style={styles.getLocationText}>Get Location</AppText>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        <Card>
          <View style={styles.settingsHeader}>
            <Settings size={20} color={theme.primary} />
            <AppText variant="subheader" style={styles.settingsTitle}>Notifications</AppText>
          </View>
          
          <View style={styles.settingRow}>
            <AppText>Prayer Reminders</AppText>
            <View style={styles.toggle}>
              {/* Simplified toggle - real app would have proper switch */}
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  settings.prayerNotifications ? styles.toggleOn : styles.toggleOff
                ]}
                onPress={() => applySettings({ prayerNotifications: !settings.prayerNotifications })}
                accessibilityLabel="Toggle prayer notifications"
              >
                <View style={[
                  styles.toggleKnob,
                  settings.prayerNotifications ? styles.knobOn : styles.knobOff
                ]} />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </View>

      {showLocationPicker && (
        <View style={styles.locationPickerOverlay}>
          <View style={[styles.locationPicker, { backgroundColor: theme.surface }]}>
            <AppText variant="subheader" style={styles.locationPickerTitle}>
              Manual Location
            </AppText>
            <AppText style={styles.locationPickerText}>
              Enter coordinates manually if GPS is not available
            </AppText>
            {/* Location input components would go here */}
            <TouchableOpacity
              style={styles.closeLocationPicker}
              onPress={() => setShowLocationPicker(false)}
            >
              <AppText>Close</AppText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    flex: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  locationText: {
    marginLeft: SPACING.sm,
    fontSize: 14,
  },
  dateCard: {
    marginBottom: SPACING.md,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  dateTitle: {
    marginLeft: SPACING.sm,
  },
  datePicker: {
    alignSelf: 'flex-start',
  },
  loadingContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  prayersCard: {
    marginBottom: SPACING.md,
  },
  prayersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  prayersTitle: {
    marginLeft: SPACING.sm,
  },
  prayersGrid: {
    gap: SPACING.sm,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007aff',
  },
  currentPrayer: {
    backgroundColor: '#007aff',
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  currentPrayerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noDataContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  getLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007aff',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  getLocationText: {
    color: 'white',
    marginLeft: SPACING.sm,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  settingsTitle: {
    marginLeft: SPACING.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  toggle: {
    width: 60,
    height: 32,
    backgroundColor: '#ddd',
    borderRadius: 16,
  },
  toggleButton: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  toggleOn: {
    backgroundColor: '#007aff',
  },
  toggleOff: {
    backgroundColor: '#ccc',
  },
  toggleKnob: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    position: 'absolute',
    top: 2,
    left: 2,
  },
  knobOn: {
    left: 30,
  },
  knobOff: {
    left: 2,
  },
  locationPickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationPicker: {
    width: '90%',
    padding: SPACING.lg,
    borderRadius: 12,
  },
  locationPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  locationPickerText: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  closeLocationPicker: {
    backgroundColor: '#007aff',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
});

export default PrayerTimes;