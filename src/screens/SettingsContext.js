import React, { createContext, useState, useContext, useEffect } from 'react';
import { THEMES } from '../theme/colors';
import StorageService from '../services/StorageService';
import { DEFAULT_RECITER, RECITERS } from '../constants/Reciters';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const DEFAULT_SETTINGS = {
  themeMode: 'light',
  fontSize: 18,
  readingStyle: 'Normal',
  autoPlay: false,
  isDarkMode: false,
  isAutoDarkMode: false,
  reciter: DEFAULT_RECITER,
  reciterQuality: 'normal',
  playbackSpeed: 'normal',
  audioQuality: 'high',
  fontName: 'Amiri',
  showWordByWord: false,
  showTafsir: false,
  prayerNotifications: true,
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await StorageService.getAppSettings();
        if (saved) {
          // CRITICAL: Force validation to prevent native bridge crashes
          const validated = {
            ...DEFAULT_SETTINGS,
            ...saved,
            // Ensure booleans are actually booleans
            autoPlay: saved.autoPlay === true || saved.autoPlay === 'true',
            isDarkMode: saved.isDarkMode === true || saved.isDarkMode === 'true',
            isAutoDarkMode: saved.isAutoDarkMode === true || saved.isAutoDarkMode === 'true',
          };

          setSettings(validated);
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      } finally {
        setIsReady(true);
      }
    };
    loadSettings();
  }, []);

  const applySettings = async (newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      // Async save using StorageService
      StorageService.setAppSettings(updated);
      return updated;
    });
  };

  const theme = THEMES[settings.themeMode] || THEMES.light;

  return (
    <SettingsContext.Provider value={{ settings, applySettings, theme, isReady }}>
      {children}
    </SettingsContext.Provider>
  );
};
