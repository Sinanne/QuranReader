// src/screens/PrivacyPolicy.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PrivacyPolicy = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.sectionTitle}>Introduction</Text>
      <Text style={styles.sectionContent}>
        Welcome to our app. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information.
      </Text>

      <Text style={styles.sectionTitle}>Information We Collect</Text>
      <Text style={styles.sectionContent}>
        We may collect personal information such as your name, email address, and usage data when you use our app. This information is used to provide and improve our services, communicate with you, and ensure the security of our app.
      </Text>

      <Text style={styles.sectionTitle}>How We Use Your Information</Text>
      <Text style={styles.sectionContent}>
        We use your information to provide and improve our services, communicate with you, and ensure the security of our app. We may also use your information for research and analytics purposes to better understand how our app is used and how we can improve it.
      </Text>

      <Text style={styles.sectionTitle}>Sharing Your Information</Text>
      <Text style={styles.sectionContent}>
        We do not sell, trade, or otherwise transfer your personal information to outside parties. We may share your information with trusted third parties who assist us in operating our app, conducting our business, or providing services to you, as long as those parties agree to keep this information confidential.
      </Text>

      <Text style={styles.sectionTitle}>Security</Text>
      <Text style={styles.sectionContent}>
        We take the security of your personal information seriously and implement a variety of security measures to protect your information from unauthorized access, use, or disclosure.
      </Text>

      <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
      <Text style={styles.sectionContent}>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
      </Text>

      <Text style={styles.sectionTitle}>Contact Us</Text>
      <Text style={styles.sectionContent}>
        If you have any questions about this Privacy Policy, please contact us at [your contact information].
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

export default PrivacyPolicy;