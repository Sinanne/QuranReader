import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSettings } from '../../context/SettingsContext';
import { SPACING } from '../../theme/spacing';

const Card = ({ children, style }) => {
    const { theme } = useSettings();

    return (
        <View style={[
            styles.card,
            { backgroundColor: theme.surface, shadowColor: theme.text },
            style
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: SPACING.md,
        borderRadius: SPACING.md,
        marginVertical: SPACING.sm,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});

export default Card;
