import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useSettings } from '../../context/SettingsContext';
import { TYPOGRAPHY } from '../../theme/spacing';

const AppText = ({ children, style, variant = 'body', ...props }) => {
    const { theme, settings } = useSettings();

    const baseStyle = {
        color: theme.text,
        fontFamily: variant === 'arabic' ? TYPOGRAPHY.families.arabic[0] : TYPOGRAPHY.families.english[0],
        fontSize: variant === 'arabic' ? settings.fontSize + 4 : settings.fontSize,
    };

    return (
        <Text
            style={[baseStyle, styles[variant], style]}
            {...props}
            accessible={true}
            accessibilityRole="text"
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: TYPOGRAPHY.sizes.xl,
        fontWeight: 'bold',
    },
    subheader: {
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: '600',
    },
    body: {
        fontSize: TYPOGRAPHY.sizes.md,
    },
    caption: {
        fontSize: TYPOGRAPHY.sizes.sm,
        opacity: 0.8,
    },
    arabic: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});

export default AppText;
