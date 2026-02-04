import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useTheme } from '../../theme/useTheme';
import { useStore } from '../../store/useStore';

const MushafView = ({ data }) => {
    const { colors } = useTheme();
    const fontSize = useStore(state => state.settings.fontSize);
    const fontName = useStore(state => state.settings.fontName);

    // Group data by page
    const pages = useMemo(() => {
        const grouped = {};
        data.forEach(item => {
            const pageNum = item.details?.page || 0;
            if (!grouped[pageNum]) grouped[pageNum] = [];
            grouped[pageNum].push(item);
        });

        // Sort keys to ensure order, then reverse for RTL feel if needed
        // Most Quran readers swipe Right-to-Left, which means higher indices are on the LEFT
        // react-native-pager-view responds to device RTL but we can also manually order
        const sortedKeys = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));

        return sortedKeys.map(key => ({
            pageNumber: key,
            ayahs: grouped[key]
        }));
    }, [data]);

    // For Mushaf View, we cap the font size to ensure it doesn't overflow the "page"
    const mushafFontSize = Math.min(fontSize, 28);

    return (
        <PagerView
            style={styles.pager}
            initialPage={0}
            layoutDirection="rtl" // Explicit RTL for PagerView
        >
            {pages.map((page, index) => (
                <View key={page.pageNumber} style={[styles.pageContainer, { backgroundColor: colors.background }]}>
                    <View style={[
                        styles.pageFrame,
                        {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowRadius: 5,
                            elevation: 5
                        }
                    ]}>
                        <View style={[styles.ornament, { borderColor: colors.primary + '30' }]} />

                        <View style={styles.textWrapper}>
                            <Text style={[
                                styles.text,
                                {
                                    color: colors.text,
                                    fontSize: mushafFontSize,
                                    fontFamily: fontName,
                                    lineHeight: mushafFontSize * 1.9 // Slightly tighter for Mushaf
                                }
                            ]}>
                                {page.ayahs.map(item => (
                                    <Text key={item.aya_id}>
                                        {item.aya}
                                        <Text style={{ color: colors.primary, fontSize: mushafFontSize * 0.7, fontFamily: 'Amiri' }}>
                                            {` \u06DD${item.details?.aya_sura_id} `}
                                        </Text>
                                    </Text>
                                ))}
                            </Text>
                        </View>

                        <View style={styles.footer}>
                            <View style={[styles.pageIndicator, { backgroundColor: colors.primary }]}>
                                <Text style={[styles.pageNumberText, { color: '#FFF' }]}>
                                    {page.pageNumber}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            ))}
        </PagerView>
    );
};

const styles = StyleSheet.create({
    pager: {
        flex: 1,
    },
    pageContainer: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    pageFrame: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 4,
        padding: 20,
        justifyContent: 'space-between',
        position: 'relative',
    },
    ornament: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: 8,
        bottom: 8,
        borderWidth: 0.5,
        borderRadius: 2,
    },
    textWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
        writingDirection: 'rtl',
    },
    footer: {
        alignItems: 'center',
        marginTop: 12,
    },
    pageIndicator: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageNumberText: {
        fontSize: 10,
        fontWeight: 'bold',
    }
});

export default MushafView;
