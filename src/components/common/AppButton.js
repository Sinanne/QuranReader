import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { useSettings } from '../../screens/SettingsContext';
import { SPACING } from '../../theme/spacing';
import LoadingSpinner from './LoadingSpinner';

const AppButton = ({
    title,
    onPress,
    style,
    variant = 'primary',
    icon,
    disabled = false,
    loading = false,
    accessibilityLabel = null,
    accessibilityHint = null
}) => {
    const { theme } = useSettings();

    const buttonStyle = [
        styles.button,
        variant === 'primary' && { backgroundColor: theme.primary },
        variant === 'secondary' && { backgroundColor: theme.secondary },
        variant === 'outline' && {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: theme.primary
        },
        disabled && styles.disabled,
        loading && styles.loading,
        style
    ];

    const textStyle = [
        styles.text,
        variant === 'primary' && { color: theme.onPrimary },
        variant === 'secondary' && { color: theme.primary },
        variant === 'outline' && { color: theme.primary },
        disabled && styles.disabledText,
        loading && styles.loadingText
    ];

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            accessibilityLabel={accessibilityLabel || title}
            accessibilityHint={accessibilityHint}
            accessibilityRole="button"
            accessibilityState={{ disabled: disabled || loading }}
            style={buttonStyle}
        >
            <View style={styles.buttonContent}>
                {icon && !loading && (
                    <View style={styles.iconContainer}>
                        {icon}
                    </View>
                )}
                {loading && (
                    <LoadingSpinner
                        size="small"
                        color={variant === 'outline' ? theme.primary : 'transparent'}
                    />
                )}
                {!loading && (
                    <Text style={textStyle}>{title}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: SPACING.md,
        borderRadius: SPACING.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
    },
    text: {
        fontWeight: '600',
        fontSize: 16,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        opacity: 0.7,
    },
    disabled: {
        opacity: 0.5,
    },
    loadingText: {
        opacity: 0,
    },
    disabledText: {
        opacity: 0.5,
    },
});

export default AppButton;
