import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, BookOpen } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import AppText from '../common/AppText';
import { useTheme } from '../../theme/useTheme';

const LastReadCard = ({ lastRead, onResume }) => {
    const { colors, isDarkMode } = useTheme();
    const theme = colors;
    const hasLastRead = lastRead && lastRead.surahName;

    const surahName = lastRead?.surahName || 'Surah Al-Fatiha';
    const ayahInfo = lastRead
        ? `Ayah ${lastRead.ayahId || 1} • Juz ${lastRead.juz || 1}`
        : 'Start your journey';

    return (
        <View style={[styles.container, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <View style={styles.cardContent}>

                <View style={styles.topRow}>
                    <View style={styles.badge}>
                        <AppText style={styles.badgeText}>
                            {hasLastRead ? 'LAST READ' : 'START READING'}
                        </AppText>
                    </View>
                </View>

                <View style={[styles.middleRow, { paddingHorizontal: 4 }]}>
                    <View>
                        <AppText style={[styles.surahTitle, { color: colors.onSecondary || '#FFF' }]}>{surahName}</AppText>
                        <AppText style={[styles.ayahInfo, { color: colors.onSecondary || '#FFF', opacity: 0.8 }]}>{ayahInfo}</AppText>
                    </View>
                    <BookOpen color={colors.onSecondary || '#FFF'} size={28} />
                </View>

                <View style={styles.bottomRow}>
                    <View style={styles.progressBadge}>
                        {/* Empty for now */}
                    </View>

                    <TouchableOpacity
                        style={[styles.continueBtn, { backgroundColor: colors.onSecondary || '#FFF' }]}
                        onPress={onResume}
                        accessibilityRole="button"
                        accessibilityLabel={hasLastRead ? "Continue reading" : "Start reading"}
                    >
                        <Play fill={colors.secondary} color={colors.secondary} size={16} />
                        <AppText style={[styles.continueText, { color: colors.secondary }]}>
                            {hasLastRead ? 'Continue' : 'Start'}
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
        borderRadius: 16,
        overflow: 'hidden',
        height: 180,
        backgroundColor: COLORS.brand.secondary, // Fallback
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardContent: {
        padding: SPACING.md,
        flex: 1,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 6,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    middleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: SPACING.sm,
    },
    surahTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    ayahInfo: {
        fontSize: 14,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    continueBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    continueText: {
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 14,
    }
});

export default LastReadCard;
