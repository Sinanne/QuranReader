import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AccountSettings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Settings</Text>
      {/* Add your account settings content here */}
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
});

export default AccountSettings;