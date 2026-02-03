import React from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { useSettings } from './SettingsContext';
import AppText from '../components/common/AppText';
import Card from '../components/common/Card';
import AppButton from '../components/common/AppButton';
import { SPACING } from '../theme/spacing';
import { Sun, Moon, Type, Layout } from 'lucide-react-native';

const DisplaySettings = () => {
  const { settings, applySettings, theme } = useSettings();

  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'sepia', name: 'Sepia', icon: Sun }, // Using Sun but colored sepia in UI if needed
  ];

  return (
    <ScrollView style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <AppText variant="header" style={styles.title}>Display Settings</AppText>

        <Card>
          <View style={styles.sectionHeader}>
            <Layout size={20} color={theme.primary} />
            <AppText variant="subheader" style={styles.sectionTitle}>Theme</AppText>
          </View>
          <View style={styles.themeGrid}>
            {themes.map((t) => (
              <AppButton
                key={t.id}
                title={t.name}
                onPress={() => applySettings({ themeMode: t.id })}
                variant={settings.themeMode === t.id ? 'primary' : 'secondary'}
                style={styles.themeButton}
              />
            ))}
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Type size={20} color={theme.primary} />
            <AppText variant="subheader" style={styles.sectionTitle}>Typography</AppText>
          </View>
          <View style={styles.controlRow}>
            <AppText>Font Size: {settings.fontSize}</AppText>
            <View style={styles.buttonGroup}>
              <AppButton
                title="-"
                onPress={() => applySettings({ fontSize: Math.max(12, settings.fontSize - 2) })}
                style={styles.smallButton}
              />
              <AppButton
                title="+"
                onPress={() => applySettings({ fontSize: Math.min(32, settings.fontSize + 2) })}
                style={styles.smallButton}
              />
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Layout size={20} color={theme.primary} />
            <AppText variant="subheader" style={styles.sectionTitle}>Reading Style</AppText>
          </View>
          <View style={styles.themeGrid}>
            {['Normal', 'Word by Word'].map((style) => (
              <AppButton
                key={style}
                title={style}
                onPress={() => applySettings({ readingStyle: style })}
                variant={settings.readingStyle === style ? 'primary' : 'secondary'}
                style={styles.themeButton}
              />
            ))}
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
    padding: SPACING.lg,
  },
  title: {
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  themeButton: {
    flex: 1,
    minWidth: '30%',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  smallButton: {
    padding: SPACING.sm,
    minWidth: 40,
  },
});

export default DisplaySettings;