import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import AppText from '../common/AppText';
import * as Progress from 'react-native-progress';
import { Star } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

const JourneyStats = ({ completionPercent = 0, completedCount = 0, onViewDetails }) => {
    const { colors } = useTheme();
    const theme = colors;
    const juzCompleted = Math.floor(completedCount / 200); // Roughly 200 ayahs per Juz

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <AppText style={[styles.title, { color: theme.text }]} variant="subheader">Your Journey</AppText>
                <TouchableOpacity onPress={onViewDetails}>
                    <AppText style={[styles.link, { color: theme.primary }]}>View Details</AppText>
                </TouchableOpacity>
            </View>

            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.chartContainer}>
                    <Progress.Circle
                        size={70}
                        progress={completionPercent / 100}
                        color={theme.primary}
                        unfilledColor={theme.background}
                        borderWidth={0}
                        thickness={6}
                        strokeCap="round"
                    />
                    <View style={styles.absoluteCenter}>
                        <AppText style={[styles.percentText, { color: theme.text }]}>{completionPercent}%</AppText>
                        <AppText style={[styles.doneText, { color: theme.textSecondary }]}>DONE</AppText>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <AppText style={[styles.cardTitle, { color: theme.text }]}>Quran Completed</AppText>
                    <AppText style={[styles.cardDesc, { color: theme.textSecondary }]}>
                        {completedCount > 0
                            ? `You have read ${completedCount} ayahs (${juzCompleted} Juz). Keep going!`
                            : 'Start reading to track your progress!'
                        }
                    </AppText>

                    {completionPercent >= 5 && (
                        <View style={styles.badge}>
                            <Star size={12} color="#F5B041" fill="#F5B041" />
                            <AppText style={[styles.badgeText, { color: '#F5B041' }]}>GREAT PROGRESS!</AppText>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    link: {
        fontSize: 14,
        fontWeight: '600',
    },
    card: {
        borderRadius: 16,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    absoluteCenter: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    doneText: {
        fontSize: 8,
    },
    infoContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
        letterSpacing: 0.5,
    },
});

export default JourneyStats;
