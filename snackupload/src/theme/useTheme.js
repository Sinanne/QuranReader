import { useStore } from '../store/useStore';
import { THEMES } from './colors';

export const useTheme = () => {
    const isDarkMode = useStore((state) => state.settings.isDarkMode);
    const theme = isDarkMode ? THEMES.dark : THEMES.light;

    // Actions to toggle theme
    const toggleTheme = () => {
        useStore.getState().updateSetting('isDarkMode', !isDarkMode);
    };

    return {
        theme,
        isDarkMode,
        toggleTheme,
        colors: theme, // Alias for easier migration
    };
};
