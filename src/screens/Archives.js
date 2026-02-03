// src/screens/Archives.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { FontAwesome } from '@expo/vector-icons';

const Archives = () => {
  const [isCurrentSessionCollapsed, setIsCurrentSessionCollapsed] = useState(true);
  const [isPreviousSessionsCollapsed, setIsPreviousSessionsCollapsed] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const currentSessionNumbers = [1, 2, 3, 4, 5]; // Example data
  const previousSessions = [
    { sessionNumber: 1, endDate: '2023-01-01', progress: '80%', startDate: '2022-12-01', duration: '1 month', record: 'Shortest session' },
    { sessionNumber: 2, endDate: '2023-02-01', progress: '90%', startDate: '2023-01-01', duration: '1 month', record: 'Most progress' },
    // Add more sessions as needed
  ];

  const toggleCurrentSessionSection = () => {
    setIsCurrentSessionCollapsed(!isCurrentSessionCollapsed);
  };

  const togglePreviousSessionsSection = () => {
    setIsPreviousSessionsCollapsed(!isPreviousSessionsCollapsed);
  };

  const openSessionModal = (session) => {
    setSelectedSession(session);
    setIsModalVisible(true);
  };

  const closeSessionModal = () => {
    setSelectedSession(null);
    setIsModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Current Session Numbers */}
      <TouchableOpacity onPress={toggleCurrentSessionSection} style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>Current Session Numbers</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isCurrentSessionCollapsed}>
        <View style={styles.accordionContent}>
          {currentSessionNumbers.map((number, index) => (
            <Text key={index} style={styles.sessionNumber}>{number}</Text>
          ))}
        </View>
      </Collapsible>

      {/* Previous Sessions Records */}
      <TouchableOpacity onPress={togglePreviousSessionsSection} style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>Previous Sessions Records</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isPreviousSessionsCollapsed}>
        <View style={styles.accordionContent}>
          {previousSessions.map((session, index) => (
            <TouchableOpacity key={index} onPress={() => openSessionModal(session)} style={styles.sessionItem}>
              <Text style={styles.sessionText}>Session {session.sessionNumber}</Text>
              <Text style={styles.sessionText}>End Date: {session.endDate}</Text>
              <Text style={styles.sessionText}>Progress: {session.progress}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Collapsible>

      {/* Session Details Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeSessionModal}
      >
        <TouchableWithoutFeedback onPress={closeSessionModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedSession && (
                <>
                  <Text style={styles.modalTitle}>Session {selectedSession.sessionNumber} Details</Text>
                  <Text style={styles.modalText}>Start Date: {selectedSession.startDate}</Text>
                  <Text style={styles.modalText}>End Date: {selectedSession.endDate}</Text>
                  <Text style={styles.modalText}>Duration: {selectedSession.duration}</Text>
                  <Text style={styles.modalText}>Progress: {selectedSession.progress}</Text>
                  <Text style={styles.modalText}>Record: {selectedSession.record}</Text>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  sessionNumber: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
  },
  sessionItem: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sessionText: {
    fontSize: 16,
    color: '#333333',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#800020', // Bordeaux color
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
  },
});

export default Archives;