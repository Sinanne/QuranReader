export const COLORS = {
    // Legacy Support (remapped for stability)
    brand: {
        cream: '#FDFBF7',      // Light Mode Background
        deepGreen: '#2D5A27',  // Primary Brand Color
        textDark: '#1A1A1A',   // Primary Text
        gold: '#D4AF37',       // Accent

        // Dark Mode specifics
        darkBg: '#0D1F16',     // Existing Deep Green/Black
        darkSurface: '#152C22',

        // Original keys restored
        primary: '#2AD46A',
        secondary: '#1E3A2F',
        accent: '#F5B041',
        background: '#0D1F16',
        surface: '#152C22',
        highlight: '#1F4032',
    },

    text: {
        primary: '#FFFFFF',
        secondary: '#A0B3AA',
        tertiary: '#6B8E7E',
        inverse: '#0D1F16',
    },

    // Legacy/Utilities
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // Status
    status: {
        success: '#2D5A27',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
    },
};

export const THEMES = {
    light: {
        background: COLORS.brand.cream,
        text: COLORS.brand.textDark,
        textSecondary: '#5A6376', // Darkened for better readability
        surface: '#FFFFFF',
        primary: COLORS.brand.deepGreen,
        onPrimary: '#FFFFFF',
        secondary: '#E8E2D2', // More "paper-like" beige
        onSecondary: COLORS.brand.textDark,
        border: '#D1CCB9',
        card: '#FFFFFF',
        tabBar: '#FFFFFF',
        activeTab: COLORS.brand.deepGreen,
        inactiveTab: '#A0AEC0',
        highlight: '#F3EFE0',
    },
    dark: {
        background: '#0D1F16',
        text: '#FFFFFF',
        textSecondary: '#A0B3AA',
        surface: '#152C22',
        primary: '#2AD46A', // Classic Emerald
        onPrimary: '#FFFFFF',
        secondary: '#1E3A2F',
        onSecondary: '#FFFFFF',
        border: '#1E3A2F',
        card: '#152C22',
        tabBar: '#0D1F16',
        activeTab: '#2AD46A',
        inactiveTab: '#6B8E7E',
        highlight: '#1F4032',
    },
};
