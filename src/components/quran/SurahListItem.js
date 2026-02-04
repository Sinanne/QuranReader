import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import AppText from '../common/AppText';
import { CheckCircle, PlayCircle } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

const SurahListItem = ({ surah, onPress, isCompleted, progress = 0, readCount = 0, index }) => {
    const { colors } = useTheme();
    const theme = colors;
    const totalAyahs = surah.ayas || 0;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Open Surah ${surah.name_eng}`}
        >
            {/* Diamond Number */}
            <View style={styles.diamondContainer}>
                <View style={[styles.diamond, { backgroundColor: theme.surface, borderColor: theme.border }]} />
                <AppText style={[styles.number, { color: theme.primary }]}>{surah.sura || index + 1}</AppText>
            </View>

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <View style={{ flex: 1 }}>
                        <AppText style={[styles.nameEng, { color: theme.text }]}>{surah.name_eng}</AppText>
                        <AppText style={[styles.meaning, { color: theme.textSecondary }]}>{surah.name_eng /* using name_eng as meaning fallback for now if no meaning provided */}</AppText>
                    </View>
                    <AppText style={[styles.nameArabic, { color: theme.primary }]} variant="arabic">{surah.name}</AppText>
                </View>

                <View style={styles.infoRow}>
                    <AppText style={[styles.details, { color: theme.textSecondary }]}>
                        {(surah.type || 'MECCAN').toUpperCase()} • {totalAyahs} AYAHS
                    </AppText>

                    <View style={styles.readStatusContainer}>
                        {/* Show read count / total */}
                        <AppText style={[styles.readCount, { color: theme.primary }]}>
                            {readCount}/{totalAyahs}
                        </AppText>

                        {isCompleted ? (
                            <CheckCircle size={20} color={theme.primary} fill={theme.surface} />
                        ) : readCount > 0 ? (
                            <CheckCircle size={20} color={theme.secondary || COLORS.brand.secondary} />
                        ) : (
                            <PlayCircle size={20} color={theme.textSecondary} />
                        )}
                    </View>
                </View>

                {/* Progress Bar Line */}
                <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                    <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: theme.primary }]} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: SPACING.md,
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginBottom: 8,
    },
    diamondContainer: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    diamond: {
        position: 'absolute',
        width: 36,
        height: 36,
        transform: [{ rotate: '45deg' }],
        borderRadius: 6,
        borderWidth: 1,
    },
    number: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    content: {
        flex: 1,
        paddingBottom: SPACING.sm,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nameEng: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    meaning: {
        fontSize: 12,
        marginTop: 2,
    },
    nameArabic: {
        fontSize: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.xs,
        marginBottom: SPACING.sm,
        alignItems: 'center',
    },
    details: {
        fontSize: 10,
        letterSpacing: 1,
        fontWeight: 'bold',
    },
    readStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    readCount: {
        fontSize: 12,
        fontWeight: '600',
    },
    progressBarBg: {
        height: 3,
        borderRadius: 2,
        width: '100%',
        marginTop: 4,
    },
    progressBar: {
        height: 3,
        borderRadius: 2,
    }
});

export default SurahListItem;
