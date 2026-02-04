import React, { memo } from 'react';
import { StyleSheet, View, TouchableOpacity, Share, Alert } from 'react-native';
import AppText from '../common/AppText';
import { SPACING } from '../../theme/spacing';
import { COLORS } from '../../theme/colors';
import { Bookmark, Heart, Share2 } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

const AyaItem = memo(({
    aya,
    englishText,
    onBookmark,
    onFavorite,
    isBookmarked,
    isFavorited,
    isActive
}) => {
    const { colors } = useTheme();
    const theme = colors; // Alias for convenience since the rest of the file uses 'theme'
    const containerStyle = isActive
        ? [styles.activeContainer, { backgroundColor: theme.secondary, borderColor: theme.primary }]
        : [styles.container, { borderBottomColor: theme.border }];

    const handleShare = async () => {
        const surahName = aya.details?.name_eng?.trim() || 'Quran';
        const ayahNumber = aya.details?.aya_sura_id || '';
        const arabicText = aya.aya || aya.details?.aya || '';
        const translation = englishText || '';

        const message = `${arabicText}\n\n${translation}\n\n— ${surahName}, Ayah ${ayahNumber}`;

        try {
            await Share.share({
                message,
                title: `${surahName} - Ayah ${ayahNumber}`,
            });
        } catch (error) {
            Alert.alert('Error', 'Could not share this ayah');
        }
    };

    return (
        <View style={containerStyle}>
            {/* Top Row: Number Badge + Actions */}
            <View style={styles.topRow}>
                <View style={[styles.numberBadge, { backgroundColor: colors.primary + '15' }, isActive && { backgroundColor: colors.primary + '30' }]}>
                    <AppText style={[styles.numberText, { color: colors.primary }]}>
                        {aya.details?.aya_sura_id}
                    </AppText>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        onPress={() => onFavorite && onFavorite(aya.aya_id)}
                        style={styles.actionBtn}
                        accessibilityLabel={isFavorited ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Heart
                            size={20}
                            color={isFavorited ? '#FF6B6B' : theme.textSecondary}
                            fill={isFavorited ? '#FF6B6B' : 'none'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => onBookmark && onBookmark(aya.aya_id)}
                        style={styles.actionBtn}
                        accessibilityLabel={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                        <Bookmark
                            size={20}
                            color={isBookmarked ? theme.primary : theme.textSecondary}
                            fill={isBookmarked ? theme.primary : 'none'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleShare}
                        style={styles.actionBtn}
                        accessibilityLabel="Share this ayah"
                    >
                        <Share2 size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Arabic Text */}
            <View style={styles.textContainer}>
                <AppText variant="arabic" style={[styles.arabicText, { color: theme.text }]}>
                    {aya.aya || aya.details?.aya}
                </AppText>
            </View>

            {/* English Translation */}
            {englishText && (
                <View style={styles.translationContainer}>
                    <AppText style={[styles.translationText, { color: theme.textSecondary }]}>
                        {englishText}
                    </AppText>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        padding: SPACING.lg,
        borderBottomWidth: 1,
    },
    activeContainer: {
        padding: SPACING.lg,
        margin: SPACING.md,
        borderRadius: 16,
        borderWidth: 1,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    numberBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    activeBadge: {
        opacity: 0.1,
    },
    numberText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionBtn: {
        padding: 8,
    },
    textContainer: {},
    arabicText: {
        fontSize: 26,
        textAlign: 'right',
        lineHeight: 48,
        marginBottom: SPACING.md,
    },
    translationContainer: {
        marginTop: SPACING.sm,
    },
    translationText: {
        fontSize: 14,
        lineHeight: 22,
    },
});

export default AyaItem;
