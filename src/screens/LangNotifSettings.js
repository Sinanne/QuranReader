// src/screens/LanguageAndNotificationSettings.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { FontAwesome } from '@expo/vector-icons';

const LanguageAndNotificationSettings = () => {
  const [isLanguageCollapsed, setIsLanguageCollapsed] = useState(true);
  const [isRemindersCollapsed, setIsRemindersCollapsed] = useState(true);
  const [primaryLanguage, setPrimaryLanguage] = useState('english');
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [dailyReminders, setDailyReminders] = useState({
    suratMulk: false,
    suratKahf: false,
    suratBaraqarah: false,
    siyamAyamBaydh: false,
    siyamMondayThursday: false,
    siyamRajab: false,
  });
  const [verseOfTheDay, setVerseOfTheDay] = useState(false);
  const [allNotifications, setAllNotifications] = useState(false);

  const toggleLanguageSection = () => {
    setIsLanguageCollapsed(!isLanguageCollapsed);
  };

  const toggleRemindersSection = () => {
    setIsRemindersCollapsed(!isRemindersCollapsed);
  };

  const openLanguageModal = () => {
    setIsLanguageModalVisible(true);
  };

  const closeLanguageModal = () => {
    setIsLanguageModalVisible(false);
  };

  const selectLanguage = (language) => {
    setPrimaryLanguage(language);
    closeLanguageModal();
  };

  const toggleAllNotifications = (value) => {
    setAllNotifications(value);
    setDailyReminders({
      suratMulk: value,
      suratKahf: value,
      suratBaraqarah: value,
      siyamAyamBaydh: value,
      siyamMondayThursday: value,
      siyamRajab: value,
    });
    setVerseOfTheDay(value);
  };

  return (
    <ScrollView style={styles.container}>
      {/* App Language */}
      <TouchableOpacity onPress={toggleLanguageSection} style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>App Language</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isLanguageCollapsed}>
        <View style={styles.accordionContent}>
          <TouchableOpacity onPress={openLanguageModal} style={styles.languageButton}>
            <FontAwesome name="language" size={24} color="#ffffff" />
            <Text style={styles.languageButtonText}>{primaryLanguage === 'english' ? 'English' : primaryLanguage === 'arabic' ? 'Arabic' : 'French'}</Text>
          </TouchableOpacity>
        </View>
      </Collapsible>

      {/* Language Modal */}
      <Modal
        transparent={true}
        visible={isLanguageModalVisible}
        animationType="slide"
        onRequestClose={closeLanguageModal}
      >
        <TouchableWithoutFeedback onPress={closeLanguageModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => selectLanguage('english')} style={styles.modalItem}>
                <Text style={styles.modalItemText}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectLanguage('arabic')} style={styles.modalItem}>
                <Text style={styles.modalItemText}>Arabic</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectLanguage('french')} style={styles.modalItem}>
                <Text style={styles.modalItemText}>French</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Reminders */}
      <TouchableOpacity onPress={toggleRemindersSection} style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>Reminders</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isRemindersCollapsed}>
        <View style={styles.accordionContent}>
          <ScrollView style={styles.scrollContainer}>
            {/* All Notifications */}
            <View style={styles.reminderItem}>
              <Text style={styles.reminderText}>All Notifications</Text>
              <Switch
                value={allNotifications}
                onValueChange={(value) => toggleAllNotifications(value)}
              />
            </View>

            {/* Reading Mustahab */}
            <Text style={styles.sectionTitle}>Reading Mustahab</Text>
            <View style={styles.reminderItem}>
              <Text style={styles.reminderText}>Surah al-Mulk</Text>
              <Switch
                value={dailyReminders.suratMulk}
                onValueChange={(value) => setDailyReminders({ ...dailyReminders, suratMulk: value })}
              />
            </View>
            <View style={styles.reminderItem}>
              <Text style={styles.reminderText}>Surah al-Kahf</Text>
              <Switch
                value={dailyReminders.suratKahf}
                onValueChange={(value) => setDailyReminders({ ...dailyReminders, suratKahf: value })}
              />
            </View>
            <View style={styles.reminderItem}>
              <Text style={styles.reminderText}>Surah al-Baqara</Text>
              <Switch
                value={dailyReminders.suratBaraqarah}
                onValueChange={(value) => setDailyReminders({ ...dailyReminders, suratBaraqarah: value })}
              />
            </View>

            {/* Fasting */}
            <Text style={styles.sectionTitle}>Fasting</Text>
            <View style={styles.reminderItem}>
              <Text style={styles.reminderText}>Rajab</Text>
              <Switch
                value={dailyReminders.siyamRajab}
                onValueChange={(value) => setDailyReminders({ ...dailyReminders, siyamRajab: value })}
              />
            </View>
            <View style={styles.reminderItem}>
              <Text style={styles.reminderText}>Mondays and Thursdays</Text>
              <Switch
                value={dailyReminders.siyamMondayThursday}
                onValueChange={(value) => setDailyReminders({ ...dailyReminders, siyamMondayThursday: value })}
              />
            </View>
            <View style={styles.reminderItem}>
              <Text style={styles.reminderText}>White Days</Text>
              <Switch
                value={dailyReminders.siyamAyamBaydh}
                onValueChange={(value) => setDailyReminders({ ...dailyReminders, siyamAyamBaydh: value })}
              />
            </View>

            {/* Verse of the Day */}
            <Text style={styles.sectionTitle}>Verse of the Day</Text>
            <View style={styles.reminderItem}>
              <Text style={styles.reminderText}>Verse of the Day</Text>
              <Switch
                value={verseOfTheDay}
                onValueChange={(value) => setVerseOfTheDay(value)}
              />
            </View>
          </ScrollView>
        </View>
      </Collapsible>
    </ScrollView>
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
    color: '#800020', // Bordeaux color
    textAlign: 'center', // Center the title
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
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#800020', // Bordeaux color
    borderRadius: 10,
    alignItems: 'center',
    width: '45%', // Make the container narrower by 20%
    alignSelf: 'center', // Center the container
  },
  languageButtonText: {
    fontSize: 18,
    color: '#ffffff', // White text color
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 18,
    color: '#800020', // Bordeaux color
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#800020', // Bordeaux color
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  reminderText: {
    fontSize: 16,
  },
  scrollContainer: {
    maxHeight: 400, // Adjust the height as needed
  },
});

export default LanguageAndNotificationSettings;