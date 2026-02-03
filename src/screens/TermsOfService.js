// src/screens/TermsOfService.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const TermsOfService = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms of Service</Text>

      <Text style={styles.sectionTitle}>Introduction</Text>
      <Text style={styles.sectionContent}>
        Welcome to our app. By using our app, you agree to comply with and be bound by the following terms and conditions. Please review these terms carefully. If you do not agree with these terms, you should not use our app.
      </Text>

      <Text style={styles.sectionTitle}>Use of the App</Text>
      <Text style={styles.sectionContent}>
        You agree to use our app only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the app. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our app.
      </Text>

      <Text style={styles.sectionTitle}>Intellectual Property</Text>
      <Text style={styles.sectionContent}>
        All content included on our app, such as text, graphics, logos, images, and software, is the property of our app or its content suppliers and is protected by international copyright laws. The compilation of all content on this app is the exclusive property of our app, with copyright authorship for this collection by our app, and protected by international copyright laws.
      </Text>

      <Text style={styles.sectionTitle}>Limitation of Liability</Text>
      <Text style={styles.sectionContent}>
        Our app will not be liable for any damages of any kind arising from the use of this app, including, but not limited to, direct, indirect, incidental, punitive, and consequential damages.
      </Text>

      <Text style={styles.sectionTitle}>Changes to These Terms</Text>
      <Text style={styles.sectionContent}>
        We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new terms on this page. You are advised to review these terms periodically for any changes.
      </Text>

      <Text style={styles.sectionTitle}>Contact Us</Text>
      <Text style={styles.sectionContent}>
        If you have any questions about these Terms of Service, please contact us at [your contact information].
      </Text>
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
    color: '#800020', // Bordeaux color
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#800020', // Bordeaux color
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
  },
});

export default TermsOfService;