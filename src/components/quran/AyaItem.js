import React, { memo } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import AppText from '../common/AppText';
import Card from '../common/Card';
import { useSettings } from '../../screens/SettingsContext';
import { SPACING } from '../../theme/spacing';
import { Share2, Play, Heart, Bookmark } from 'lucide-react-native';

const AyaItem = memo(({
    aya,
    onPlay,
    onShare,
    onFavorite,
    onBookmark,
    isBookmarked,
    isFavorite,
    showTranslation,
    translation
}) => {
    const { theme } = useSettings();

    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <AppText variant="caption">
                    {aya.details.sura}:{aya.details.aya_sura_id}
                </AppText>
                <AppText variant="caption">
                    {aya.details.name_eng}
                </AppText>
            </View>

            <View style={styles.ayaContainer}>
                <AppText variant="arabic" style={styles.ayaText}>
                    {aya.details.aya}
                </AppText>
                <AppText variant="arabic" style={[styles.ayaNumber, { color: theme.primary }]}>
                    ﴿{aya.details.aya_sura_id}﴾
                </AppText>
            </View>

            {showTranslation && (
                <AppText variant="body" style={styles.translation}>
                    {translation}
                </AppText>
            )}

            <View style={styles.actions}>
                <TouchableOpacity 
                    onPress={() => onPlay(aya)}
                    accessibilityLabel="Play verse audio"
                    accessibilityHint="Plays audio recitation of current verse"
                    accessibilityRole="button"
                >
                    <Play size={22} color={theme.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => onFavorite(aya)}
                    accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    accessibilityHint={isFavorite ? "Remove this verse from favorites" : "Add this verse to favorites"}
                    accessibilityRole="button"
                >
                    <Heart size={22} color={isFavorite ? 'red' : theme.text} fill={isFavorite ? 'red' : 'none'} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => onBookmark(aya)}
                    accessibilityLabel={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    accessibilityHint={isBookmarked ? "Remove bookmark from this verse" : "Add bookmark to this verse"}
                    accessibilityRole="button"
                >
                    <Bookmark size={22} color={isBookmarked ? theme.primary : theme.text} fill={isBookmarked ? theme.primary : 'none'} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => onShare(aya)}
                    accessibilityLabel="Share verse"
                    accessibilityHint="Share this verse with others"
                    accessibilityRole="button"
                >
                    <Share2 size={22} color={theme.text} />
                </TouchableOpacity>
            </View>
        </Card>
    );
});

const styles = StyleSheet.create({
    card: {
        marginHorizontal: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
        opacity: 0.6,
    },
    ayaText: {
        lineHeight: 48,
        flex: 1,
    },
    translation: {
        fontStyle: 'italic',
        marginBottom: SPACING.md,
    },
    ayaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        marginBottom: SPACING.md,
    },
    ayaNumber: {
        marginLeft: SPACING.xs,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: SPACING.md,
    },
});

export default AyaItem;
