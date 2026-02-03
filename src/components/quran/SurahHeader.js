import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../common/AppText';
import { SPACING } from '../../theme/spacing';
import { useSettings } from '../../screens/SettingsContext';

const SurahHeader = ({ surah }) => {
    const { theme } = useSettings();

    return (
        <View style={[styles.container, { borderBottomColor: theme.primary }]}>
            <AppText variant="subheader" style={styles.title}>
                {surah.number}. {surah.name_eng}
            </AppText>
            <AppText variant="arabic" style={styles.arabic}>
                {surah.name}
            </AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2,
        marginTop: SPACING.lg,
        marginHorizontal: SPACING.md,
    },
    title: {
        fontWeight: 'bold',
    },
    arabic: {
        fontSize: 24,
    },
});

export default SurahHeader;
