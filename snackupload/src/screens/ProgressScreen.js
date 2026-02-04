import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import AppText from '../components/common/AppText';
import ActivityChart from '../components/progress/ActivityChart';
import ProgressService from '../services/ProgressService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../theme/useTheme';
import { ArrowLeft, BookOpen, Flame, Trophy, Lock, BarChart2, Calendar, Target } from 'lucide-react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;

const ProgressScreen = () => {
    const { colors, theme, isDarkMode } = useTheme();
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Weekly');
    const [stats, setStats] = useState({
        totalAyahs: 0,
        completionPercent: 0,
        streak: 0,
        weeklyData: null,
        weeklyTotal: 0,
        monthlyData: null,
        monthlyTotal: 0,
        yearlyData: null,
        yearlyTotal: 0,
        analytics: null
    });

    const loadStats = async () => {
        const [total, percent, streak, weekly, monthly, yearly, analytics] = await Promise.all([
            ProgressService.getCompletedCount(),
            ProgressService.getCompletionPercentage(),
            ProgressService.getStreak(),
            ProgressService.getWeeklyActivity(),
            ProgressService.getMonthlyActivity(),
            ProgressService.getYearlyActivity(),
            ProgressService.getAnalytics()
        ]);

        const weeklyTotal = weekly.reduce((acc, sum) => acc + sum.count, 0);
        const monthlyTotal = monthly.reduce((acc, sum) => acc + sum.count, 0);
        const yearlyTotal = yearly.reduce((acc, sum) => acc + sum.count, 0);

        setStats({
            totalAyahs: total,
            completionPercent: percent,
            streak: streak,
            weeklyData: {
                labels: weekly.map(w => w.day),
                datasets: [{ data: weekly.map(w => w.count) }]
            },
            weeklyTotal,
            monthlyData: {
                labels: monthly.map(m => m.label),
                datasets: [{ data: monthly.map(m => m.count) }]
            },
            monthlyTotal,
            yearlyData: {
                labels: yearly.map(y => y.label),
                datasets: [{ data: yearly.map(y => y.count) }]
            },
            yearlyTotal,
            analytics
        });
    };

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );

    const handleReset = () => {
        Alert.alert(
            "Reset Progress",
            "Are you sure you want to reset all your reading progress? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: async () => {
                        await ProgressService.resetAllProgress();
                        loadStats();
                        Alert.alert("Success", "Progress has been reset.");
                    }
                }
            ]
        );
    };

    const InsightCard = ({ icon: Icon, title, value, titleColor, subtitle }) => (
        <View style={[styles.insightCard, { backgroundColor: theme.surface }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Icon size={20} color={titleColor || theme.primary} />
                <AppText style={[styles.cardTitle, { color: titleColor || theme.textSecondary }]}> {title}</AppText>
            </View>
            <AppText style={[styles.cardValue, { color: theme.text }]}>{value}</AppText>
            {subtitle && <AppText style={[styles.cardSubtitle, { color: theme.primary }]}>{subtitle}</AppText>}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color={colors.text} size={24} />
                </TouchableOpacity>
                <AppText style={[styles.headerTitle, { color: colors.text }]}>Progress & Insights</AppText>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Tabs */}
                <View style={[styles.tabsContainer, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
                    {['Weekly', 'Monthly', 'Yearly'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tab,
                                activeTab === tab && { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <AppText style={activeTab === tab ? [styles.activeTabText, { color: colors.text }] : [styles.tabText, { color: colors.textSecondary }]}>
                                {tab}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Chart */}
                <ActivityChart
                    data={
                        activeTab === 'Weekly' ? stats.weeklyData :
                            activeTab === 'Monthly' ? stats.monthlyData :
                                stats.yearlyData
                    }
                    totalCount={
                        activeTab === 'Weekly' ? stats.weeklyTotal :
                            activeTab === 'Monthly' ? stats.monthlyTotal :
                                stats.yearlyTotal
                    }
                    period={activeTab}
                    chartColors={{
                        background: colors.surface,
                        text: colors.textSecondary,
                        primary: colors.primary
                    }}
                />

                {/* Key Insights */}
                <AppText style={styles.sectionTitle}>Key Insights</AppText>
                <View style={styles.insightsRow}>
                    <InsightCard
                        icon={BookOpen}
                        title="TOTAL AYAHS"
                        value={stats.totalAyahs !== undefined ? stats.totalAyahs.toLocaleString() : '0'}
                    />
                    <InsightCard
                        icon={Flame}
                        title="CURRENT STREAK"
                        value={`${stats.streak} Days`}
                        subtitle={stats.streak > 0 ? "Keep it up!" : "Start reading today!"}
                    />
                </View>

                {/* Advanced KPIs */}
                <AppText style={[styles.sectionTitle, { color: theme.text }]}>Advanced Analytics</AppText>
                <View style={styles.insightsRow}>
                    <InsightCard
                        icon={BarChart2}
                        title="AVG AYAHS/DAY"
                        value={stats.analytics?.avgDaily || '0'}
                        subtitle="Across active days"
                    />
                    <InsightCard
                        icon={Calendar}
                        title="BEST READING DAY"
                        value={stats.analytics?.bestDay?.count || '0'}
                        subtitle={stats.analytics?.bestDay?.date ? new Date(stats.analytics.bestDay.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "-"}
                    />
                </View>

                <View style={styles.insightsRow}>
                    <InsightCard
                        icon={Target}
                        title="EST. COMPLETION"
                        value={stats.analytics?.estimatedDays ? `${stats.analytics.estimatedDays} Days` : "-"}
                        subtitle={stats.analytics?.estimatedDays ? "Based on avg pace" : "Keep reading to estimate"}
                    />
                    <InsightCard
                        icon={Trophy}
                        title="DAYS ACTIVE"
                        value={stats.analytics?.totalDaysActive || '0'}
                        subtitle="Total reading days"
                    />
                </View>

                {/* Khatam Roadmap */}
                <View style={[styles.khatamContainer, { backgroundColor: theme.surface }]}>
                    <View style={styles.khatamHeader}>
                        <View>
                            <AppText style={[styles.khatamTitle, { color: theme.text }]}>Khatam Roadmap</AppText>
                            <AppText style={[styles.khatamSubtitle, { color: theme.textSecondary }]}>Completion Progress</AppText>
                        </View>
                        <View style={[styles.percentBadge, { backgroundColor: theme.primary }]}>
                            <AppText style={[styles.percentText, { color: theme.background }]}>{stats.completionPercent}%</AppText>
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.roadMapBarBg}>
                        <View style={[styles.roadMapBar, { width: `${stats.completionPercent}%`, backgroundColor: theme.primary }]} />
                    </View>

                    {/* Spiritual Insight */}
                    <View style={[styles.spiritualCard, { backgroundColor: isDarkMode ? 'rgba(31, 64, 50, 0.4)' : colors.highlight }]}>
                        <Trophy color={theme.primary} size={24} style={{ marginRight: 12 }} />
                        <View style={{ flex: 1 }}>
                            <AppText style={[styles.spiritualTitle, { color: theme.text }]}>Spiritual Insight</AppText>
                            <AppText style={[styles.spiritualText, { color: theme.textSecondary }]}>
                                "The most beloved deed to Allah is the most regular and constant result even if it were little."
                            </AppText>
                        </View>
                    </View>
                </View>

                {/* Recent Milestones */}
                <AppText style={[styles.sectionTitle, { color: theme.text }]}>Recent Milestones</AppText>

                {/* Milestone 1 */}
                <View style={[styles.milestoneCard, { backgroundColor: theme.surface }]}>
                    <View style={[styles.iconCircle, { backgroundColor: stats.streak >= 10 ? 'rgba(42, 212, 106, 0.2)' : 'rgba(150, 150, 150, 0.1)' }]}>
                        <Trophy size={20} color={stats.streak >= 10 ? theme.primary : theme.textSecondary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <AppText style={[styles.milestoneTitle, { color: stats.streak >= 10 ? theme.text : theme.textSecondary }]}>10-Day Streak</AppText>
                        <AppText style={[styles.milestoneSubtitle, { color: theme.textSecondary }]}>{stats.streak >= 10 ? "Unlocked!" : "Keep reading"}</AppText>
                    </View>
                    {stats.streak < 10 && <Lock size={16} color={theme.textSecondary} />}
                </View>

                {/* Milestone 2 */}
                <View style={[styles.milestoneCard, { marginTop: 8, backgroundColor: theme.surface }]}>
                    <View style={[styles.iconCircle, { backgroundColor: stats.totalAyahs >= 100 ? 'rgba(42, 212, 106, 0.2)' : 'rgba(150, 150, 150, 0.1)' }]}>
                        <BookOpen size={20} color={stats.totalAyahs >= 100 ? theme.primary : theme.textSecondary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <AppText style={[styles.milestoneTitle, { color: stats.totalAyahs >= 100 ? theme.text : theme.textSecondary }]}>100 Ayahs Read</AppText>
                        <AppText style={[styles.milestoneSubtitle, { color: theme.textSecondary }]}>{stats.totalAyahs >= 100 ? "Unlocked!" : `${100 - stats.totalAyahs} to go`}</AppText>
                    </View>
                    {stats.totalAyahs < 100 && <Lock size={16} color={theme.textSecondary} />}
                </View>

                {/* Reset Button */}
                <TouchableOpacity
                    style={[styles.resetButton, { borderColor: COLORS.status?.error || '#FF6B6B' }]}
                    onPress={handleReset}
                >
                    <AppText style={[styles.resetText, { color: COLORS.status?.error || '#FF6B6B' }]}>Reset All Progress</AppText>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    backBtn: {
        padding: 4,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        marginBottom: SPACING.lg,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    tabText: {
        color: COLORS.text.secondary,
        fontWeight: '600',
        fontSize: 13,
    },
    activeTabText: {
        fontWeight: 'bold',
        fontSize: 13,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: SPACING.md,
        marginTop: SPACING.sm,
    },
    insightsRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    insightCard: {
        flex: 1,
        borderRadius: 16,
        padding: SPACING.md,
        minHeight: 120,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    cardValue: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 12,
        color: COLORS.brand.primary,
        marginTop: 4,
        fontWeight: '600',
    },
    khatamContainer: {
        borderRadius: 16,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    khatamHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    khatamTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    khatamSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    percentBadge: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.brand.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.brand.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    percentText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    roadMapBarBg: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        marginBottom: SPACING.lg,
    },
    roadMapBar: {
        height: 8,
        backgroundColor: COLORS.brand.primary,
        borderRadius: 4,
    },
    spiritualCard: {
        backgroundColor: 'rgba(31, 64, 50, 0.5)',
        borderRadius: 12,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    spiritualTitle: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
    },
    spiritualText: {
        color: COLORS.text.secondary,
        fontSize: 13,
        lineHeight: 18,
        fontStyle: 'italic',
    },
    milestoneCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: 12,
        marginBottom: 8,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    milestoneTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    milestoneSubtitle: {
        fontSize: 12,
        color: COLORS.text.tertiary,
    },
    resetButton: {
        marginTop: SPACING.xl,
        padding: SPACING.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.status?.error || '#FF6B6B',
        borderRadius: 12,
    },
    resetText: {
        color: COLORS.status?.error || '#FF6B6B',
        fontWeight: 'bold',
    }
});

export default ProgressScreen;
