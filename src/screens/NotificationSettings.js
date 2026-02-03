// src/screens/NotificationSettings.js
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const NotificationSettings = () => {
  const [dailyReminders, setDailyReminders] = React.useState(false);
  const [prayerTimeNotifications, setPrayerTimeNotifications] = React.useState(false);
  const [verseOfTheDay, setVerseOfTheDay] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>

      {/* Daily Reminders */}
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Daily Reminders</Text>
        <Switch
          value={dailyReminders}
          onValueChange={(value) => setDailyReminders(value)}
        />
      </View>

      {/* Prayer Time Notifications */}
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Prayer Time Notifications</Text>
        <Switch
          value={prayerTimeNotifications}
          onValueChange={(value) => setPrayerTimeNotifications(value)}
        />
      </View>

      {/* Verse of the Day */}
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Verse of the Day</Text>
        <Switch
          value={verseOfTheDay}
          onValueChange={(value) => setVerseOfTheDay(value)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
  },
});

export default NotificationSettings;