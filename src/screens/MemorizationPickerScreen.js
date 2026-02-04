import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store/useStore';
import AppText from '../components/common/AppText';
import SearchBar from '../components/quran/SearchBar';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react-native';
import { SPACING } from '../theme/spacing';

const QuranData = require('../data/QuranData.json');
const SurahInfo = require('../data/SurahInfo.json');

const MemorizationPickerScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const memorizedAyahs = useStore(state => state.memorizedAyahs);
    const toggleMemorizedAction = useStore(state => state.toggleMemorized);

    const toggleMemorized = (sura, aya) => {
        toggleMemorizedAction(sura, aya);
    };

    const [searchQuery, setSearchQuery] = useState('');

    const sections = useMemo(() => {
        const filteredSurahs = SurahInfo.filter(s =>
            s.name_eng.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.sura.toString().includes(searchQuery)
        );

        return filteredSurahs.map(surah => {
            const ayahsInSurah = QuranData.filter(a => a.details.sura === surah.sura);
            return {
                title: surah.name_eng,
                suraId: surah.sura,
                data: ayahsInSurah
            };
        });
    }, [searchQuery]);

    const renderItem = ({ item }) => {
        const suraId = item.details.sura;
        const ayahId = item.details.aya_sura_id;
        const id = `${suraId}:${ayahId}`;
        const isMemorized = memorizedAyahs.some(m => m.id === id);

        return (
            <TouchableOpacity
                style={[styles.item, { borderBottomColor: colors.border }]}
                onPress={() => toggleMemorized(suraId, ayahId)}
            >
                <View style={styles.itemContent}>
                    <AppText style={{ color: colors.textSecondary, width: 40 }}>{ayahId}</AppText>
                    <AppText style={[styles.arabicText, { color: colors.text }]} numberOfLines={1}>
                        {item.aya}
                    </AppText>
                </View>
                {isMemorized ? (
                    <CheckCircle2 color={colors.primary} size={24} />
                ) : (
                    <Circle color={colors.textSecondary} size={24} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color={colors.text} size={24} />
                </TouchableOpacity>
                <AppText style={[styles.title, { color: colors.text }]}>Select Verses</AppText>
            </View>

            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search Surah..."
            />

            <SectionList
                sections={sections}
                keyExtractor={(item) => `${item.sura}:${item.aya}`}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={[styles.sectionHeader, { backgroundColor: colors.secondary }]}>
                        <AppText style={{ color: colors.onSecondary, fontWeight: 'bold' }}>{title}</AppText>
                    </View>
                )}
                stickySectionHeadersEnabled={true}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        marginRight: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    sectionHeader: {
        padding: 10,
        paddingHorizontal: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        justifyContent: 'space-between',
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    arabicText: {
        fontSize: 18,
        textAlign: 'right',
        flex: 1,
        marginRight: 16,
    }
});

export default MemorizationPickerScreen;
