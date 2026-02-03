import { useSettings } from './SettingsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useSettingsManager = () => {
  const { settings, applySettings } = useSettings();

  const handleThemeChange = (index) => {
    applySettings({ themeIndex: index });
  };

  const handleFontSizeChange = (size) => {
    applySettings({ fontSize: size });
  };

  const handleFontChange = (fontName) => {
    applySettings({ fontName });
  };

  return {
    settings,
    handleThemeChange,
    handleFontSizeChange,
    handleFontChange,
  };
};