import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import AppText from '../common/AppText';
import { useTheme } from '../../theme/useTheme';

const HomeHeader = ({ onProfilePress }) => {
    const { colors } = useTheme();
    const theme = colors; // Alias for convenience
    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <AppText style={[styles.appName, { color: theme.primary }]}>Tasneem</AppText>
                <AppText style={[styles.tagline, { color: theme.textSecondary }]}>Your Quran Companion</AppText>
            </View>
            <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: theme.surface, borderColor: theme.primary }]}
                accessibilityLabel="Profile & Settings"
                accessibilityRole="button"
                onPress={onProfilePress}
            >
                <User color={theme.text} size={22} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.md,
        paddingTop: SPACING.xl,
    },
    leftContainer: {
        flexDirection: 'column',
    },
    appName: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    tagline: {
        fontSize: 12,
        marginTop: 2,
    },
    iconButton: {
        padding: SPACING.xs,
        borderRadius: 22,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
});

export default HomeHeader;
