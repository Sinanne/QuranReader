export const COLORS = {
    // Primary colors
    primary: {
        50: '#fef2f2',
        100: '#fde8e8',
        200: '#fbd5d4',
        300: '#f8b4a0',
        400: '#f59e7b',
        500: '#800020', // Main Bordeaux
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
    },
    
    // Secondary colors
    secondary: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#F0E68C', // Main Khaki/Gold
        600: '#f59e0b',
        700: '#d97706',
        800: '#b45309',
        900: '#92400e',
    },
    
    // Neutral colors
    neutral: {
        50: '#fafafa',
        100: '#f5f5f4',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a',
    },
    
    // Semantic colors
    success: {
        50: '#f0fdf4',
        500: '#22c55e',
        600: '#16a34a',
    },
    warning: {
        50: '#fffbeb',
        500: '#f59e0b',
        600: '#d97706',
    },
    error: {
        50: '#fef2f2',
        500: '#ef4444',
        600: '#dc2626',
    },
    info: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
    },
    
    // Legacy colors (for backward compatibility)
    primaryLegacy: '#800020',
    secondaryLegacy: '#F0E68C',
    sepia: '#704214',
    sepiaBackground: '#F5F5DC',
    white: '#FFFFFF',
    black: '#000000',
    grey: {
        light: '#F0F0F0',
        medium: '#888888',
        dark: '#333333',
    },
    accent: '#f39c12',
    transparent: 'transparent',
};

export const THEMES = {
    light: {
        background: COLORS.neutral[50],
        text: COLORS.neutral[900],
        surface: COLORS.white,
        primary: COLORS.primary[500],
        primaryHover: COLORS.primary[600],
        secondary: COLORS.secondary[500],
        accent: COLORS.info[500],
        success: COLORS.success[500],
        warning: COLORS.warning[500],
        error: COLORS.error[500],
        border: COLORS.neutral[200],
        onPrimary: COLORS.white,
        onSurface: COLORS.neutral[900],
        tabBar: COLORS.primary[500],
        tabBarItem: COLORS.white,
        shadow: COLORS.neutral[300],
    },
    dark: {
        background: COLORS.neutral[950],
        text: COLORS.neutral[100],
        surface: COLORS.neutral[800],
        primary: COLORS.secondary[500],
        primaryHover: COLORS.secondary[600],
        secondary: COLORS.secondary[300],
        accent: COLORS.info[400],
        success: COLORS.success[400],
        warning: COLORS.warning[400],
        error: COLORS.error[400],
        border: COLORS.neutral[700],
        onPrimary: COLORS.neutral[950],
        onSurface: COLORS.neutral[100],
        tabBar: COLORS.neutral[900],
        tabBarItem: COLORS.neutral[100],
        shadow: COLORS.neutral[900],
    },
    sepia: {
        background: '#F5F5DC',
        text: COLORS.neutral[900],
        surface: '#E8E0D4',
        primary: COLORS.primary[500],
        primaryHover: COLORS.primary[600],
        secondary: COLORS.secondary[400],
        accent: COLORS.info[500],
        success: COLORS.success[500],
        warning: COLORS.warning[500],
        error: COLORS.error[500],
        border: '#D4C5A0',
        onPrimary: COLORS.white,
        onSurface: COLORS.neutral[900],
        tabBar: COLORS.sepia,
        tabBarItem: COLORS.white,
        shadow: COLORS.neutral[400],
    },
};
