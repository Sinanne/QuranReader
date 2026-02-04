import React, { useMemo, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { useStore } from '../store/useStore';
import { COLORS } from '../theme/colors';
import AppText from '../components/common/AppText';
import { ContributionGraph } from 'react-native-chart-kit';
import ProgressService from '../services/ProgressService';
import { ArrowLeft, Award, TrendingUp, Clock } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const MemorizationScreen = ({ navigation }) => {
    const { colors, isDarkMode } = useTheme();
    const memorizedAyahs = useStore(state => state.memorizedAyahs);
    const [heatmapData, setHeatmapData] = useState([]);

    useEffect(() => {
        loadActivity();
    }, []);

    const loadActivity = async () => {
        const log = await ProgressService.getActivityLog();
        const data = Object.keys(log).map(date => ({
            date: date,
            count: log[date]
        }));
        setHeatmapData(data);
    };

    // Calculate SRS / Strength Stats per Surah
    const surahStats = useMemo(() => {
        const stats = {};
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;

        memorizedAyahs.forEach(m => {
            if (!stats[m.sura]) {
                stats[m.sura] = { sura: m.sura, count: 0, totalStrength: 0 };
            }
            stats[m.sura].count += 1;

            // Simple decay: lost 10% strength per week if not reviewed
            // Base strength is stored (0-5) or we calculate dynamic "Retainment" (0-100)
            const daysSinceReview = (now - m.lastReviewed) / ONE_DAY;

            // Retainment % = 100 * (0.9 ^ weeks)
            const weeks = daysSinceReview / 7;
            const retainment = Math.max(0, 100 * Math.pow(0.9, weeks));

            stats[m.sura].totalStrength += retainment;
        });

        // Convert to array
        return Object.values(stats).map(s => ({
            ...s,
            avgRetainment: s.count > 0 ? s.totalStrength / s.count : 0
        })).sort((a, b) => a.sura - b.sura);

    }, [memorizedAyahs]);

    const StrengthBar = ({ percentage }) => (
        <View style={{ height: 6, backgroundColor: colors.secondary, borderRadius: 3, flex: 1, marginLeft: 10 }}>
            <View style={{
                height: 6,
                backgroundColor: percentage > 80 ? COLORS.status.success : (percentage > 50 ? COLORS.status.warning : COLORS.status.error),
                width: `${percentage}%`,
                borderRadius: 3
            }} />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color={colors.text} size={24} />
                </TouchableOpacity>
                <AppText style={[styles.title, { color: colors.text }]}>Hifz Dashboard</AppText>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* 1. Contribution Heatmap */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.cardHeader}>
                        <Clock size={20} color={colors.primary} style={{ marginRight: 8 }} />
                        <AppText style={[styles.cardTitle, { color: colors.text }]}>Review Activity</AppText>
                    </View>
                    <ContributionGraph
                        values={heatmapData}
                        endDate={new Date()}
                        numDays={90}
                        width={screenWidth - 64}
                        height={220}
                        chartConfig={{
                            backgroundColor: colors.surface,
                            backgroundGradientFrom: colors.surface,
                            backgroundGradientTo: colors.surface,
                            color: (opacity = 1) => isDarkMode
                                ? `rgba(42, 212, 106, ${opacity})`
                                : `rgba(45, 90, 39, ${opacity})`,
                            labelColor: (opacity = 1) => colors.textSecondary,
                        }}
                        tooltipDataAttrs={() => ({})}
                    />
                </View>

                {/* 2. Memorization Strength (SRS) */}
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.cardHeader}>
                        <TrendingUp size={20} color={colors.primary} style={{ marginRight: 8 }} />
                        <AppText style={[styles.cardTitle, { color: colors.text }]}>Memorization Strength</AppText>
                    </View>

                    {surahStats.length === 0 ? (
                        <AppText style={{ color: colors.textSecondary, fontStyle: 'italic' }}>
                            No memorized verses tracked yet.
                        </AppText>
                    ) : (
                        surahStats.map(stat => (
                            <View key={stat.sura} style={styles.statRow}>
                                <View style={{ width: 80 }}>
                                    <AppText style={{ color: colors.text, fontWeight: 'bold' }}>Surah {stat.sura}</AppText>
                                    <AppText style={{ color: colors.textSecondary, fontSize: 10 }}>{stat.count} verses</AppText>
                                </View>
                                <StrengthBar percentage={stat.avgRetainment} />
                                <AppText style={{ color: colors.text, fontSize: 12, width: 40, textAlign: 'right' }}>
                                    {Math.round(stat.avgRetainment)}%
                                </AppText>
                            </View>
                        ))
                    )}
                </View>

                {/* 3. Actions */}
                <View style={{ marginBottom: 40 }}>
                    <TouchableOpacity
                        style={[styles.manageBtn, { backgroundColor: colors.primary }]}
                        onPress={() => navigation.navigate('MemorizationPicker')}
                    >
                        <AppText style={styles.manageBtnText}>Manage Memorized Verses</AppText>
                    </TouchableOpacity>
                </View>

            </ScrollView>
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
        padding: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        // Shadow for "Book/Paper" feel
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    manageBtn: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    manageBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default MemorizationScreen;
