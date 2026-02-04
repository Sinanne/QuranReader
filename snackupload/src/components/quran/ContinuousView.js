import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useStore } from '../../store/useStore';

const ContinuousView = ({ data, onScroll }) => {
    const { colors } = useTheme();
    const fontSize = useStore(state => state.settings.fontSize);
    const fontName = useStore(state => state.settings.fontName);

    // Group by Bismillah logic or just flow
    // User requested: "Paragraph per Surah"

    // Construct the text
    // Embedding ayah number: \u06DD is End of Ayah Arabic Mark. 
    // We usually put the number inside it, but native rendering varies.
    // Unicode for Ayah End: ۝ (U+06DD)

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
            onScroll={onScroll} // Forward scroll events if tracking
            scrollEventThrottle={16}
        >
            <Text style={[
                styles.text,
                {
                    color: colors.text,
                    fontSize: fontSize,
                    fontFamily: fontName,
                    lineHeight: fontSize * 1.8
                }
            ]}>
                {data.map((item, index) => (
                    <Text key={item.aya_id}>
                        <Text style={{ color: colors.text }}>{item.aya}</Text>
                        <Text style={{ color: colors.primary, fontSize: fontSize * 0.7, fontFamily: 'Amiri' }}>
                            {` \u06DD${item.details?.aya_sura_id} `}
                        </Text>
                    </Text>
                ))}
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
        paddingBottom: 100,
    },
    text: {
        textAlign: 'justify',
        writingDirection: 'rtl',
    }
});

export default ContinuousView;
