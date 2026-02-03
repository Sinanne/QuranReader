import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppText from './AppText';
import { useSettings } from '../../screens/SettingsContext';
import { SPACING } from '../../theme/spacing';

const LoadingSpinner = ({ 
  size = 'large', 
  color = null,
  text = null,
  overlay = false 
}) => {
  const { theme } = useSettings();
  const spinnerColor = color || theme.primary;

  const LoadingContent = () => (
    <View style={[styles.container, overlay && styles.overlay]}>
      <ActivityIndicator 
        size={size} 
        color={spinnerColor}
        style={styles.spinner}
      />
      {text && (
        <AppText style={[styles.loadingText, { color: spinnerColor }]}>
          {text}
        </AppText>
      )}
    </View>
  );

  if (overlay) {
    return (
      <View style={styles.overlayContainer}>
        <LoadingContent />
      </View>
    );
  }

  return <LoadingContent />;
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: SPACING.lg,
  },
  spinner: {
    marginBottom: SPACING.md,
  },
  loadingText: {
    marginTop: SPACING.sm,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default LoadingSpinner;