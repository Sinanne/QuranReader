import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import AppText from '../common/AppText';
import { useTheme } from '../../theme/useTheme';

const screenWidth = Dimensions.get('window').width;

const ActivityChart = ({ data, totalCount, period = 'week' }) => {
    const { colors, isDarkMode } = useTheme();
    // Default empty data if none provided
    const chartData = data || {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
            data: [0, 0, 0, 0, 0, 0, 0]
        }]
    };

    // Calculate dynamic width based on number of labels
    const labelsCount = chartData.labels.length;
    const baseWidth = screenWidth - 64; // Available width in card
    const normalizedPeriod = period.toLowerCase();
    const dataPointWidth = normalizedPeriod === 'yearly' || normalizedPeriod === 'year' ? (baseWidth / labelsCount) : 55;
    const dynamicWidth = Math.max(baseWidth, labelsCount * dataPointWidth);

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <AppText style={{ color: colors.textSecondary, letterSpacing: 1, fontSize: 12 }}>READING ACTIVITY</AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 4 }}>
                <AppText style={[styles.bigNumber, { color: colors.text }]}>{totalCount || 0}</AppText>
            </View>
            <AppText style={[styles.label, { color: colors.textSecondary }]}>Ayahs read this {period.toLowerCase()}</AppText>

            <View style={styles.chartWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <BarChart
                        data={chartData}
                        width={dynamicWidth}
                        height={180}
                        yAxisLabel=""
                        yAxisSuffix=""
                        withInnerLines={false}
                        withHorizontalLabels={false}
                        chartConfig={{
                            backgroundColor: colors.surface,
                            backgroundGradientFrom: colors.surface,
                            backgroundGradientTo: colors.surface,
                            decimalPlaces: 0,
                            color: (opacity = 1) => isDarkMode ? `rgba(42, 212, 106, ${opacity})` : `rgba(45, 90, 39, ${opacity})`,
                            labelColor: (opacity = 1) => colors.textSecondary,
                            barPercentage: 0.6,
                            fillShadowGradient: colors.primary,
                            fillShadowGradientOpacity: 1,
                            fillShadowGradientFrom: colors.primary,
                            fillShadowGradientTo: colors.primary,
                        }}
                        style={styles.chart}
                        showBarTops={false}
                        fromZero
                    />
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: SPACING.md,
        marginBottom: SPACING.lg,
        borderWidth: 1,
    },
    bigNumber: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 12,
        marginBottom: SPACING.md,
    },
    chartWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
        paddingRight: 0,
        paddingLeft: 0,
    },
    scrollContent: {
        paddingRight: 16,
    }
});

export default ActivityChart;
