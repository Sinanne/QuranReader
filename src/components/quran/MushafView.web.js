import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useStore } from '../../store/useStore';

const MushafView = ({ data }) => {
    const { colors } = useTheme();
    const { width } = useWindowDimensions();
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

        const sortedKeys = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));

        return sortedKeys.map(key => ({
            pageNumber: key,
            ayahs: grouped[key]
        }));
    }, [data]);

    const mushafFontSize = Math.min(fontSize, 28);

    return (
        <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.pager}
            contentContainerStyle={styles.scrollContent}
        >
            {pages.map((page) => (
                <View 
                    key={page.pageNumber} 
                    style={[styles.pageContainer, { width, backgroundColor: colors.background }]}
                >
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
                                    lineHeight: mushafFontSize * 1.9
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    pager: {
        flex: 1,
    },
    scrollContent: {
        flexDirection: 'row',
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
