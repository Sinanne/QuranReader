import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import AppText from '../common/AppText';
import * as Progress from 'react-native-progress';
import { BookOpen, Flame, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

const DailyGoals = ({ pagesReadToday = 0, streak = 0, pageGoal = 5 }) => {
    const { colors } = useTheme();
    const theme = colors;
    const pageProgress = Math.min(pagesReadToday / pageGoal, 1);
    const hasReadToday = pagesReadToday > 0;

    return (
        <View style={styles.container}>
            <AppText style={[styles.title, { color: theme.text }]} variant="subheader">Daily Goals</AppText>

            {/* Goal Item 1: Pages Today */}
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(42, 212, 106, 0.1)' }]}>
                    <BookOpen color={theme.primary} size={24} />
                </View>
                <View style={styles.content}>
                    <View style={styles.row}>
                        <AppText style={[styles.itemTitle, { color: theme.text }]}>Read {pageGoal} Pages Today</AppText>
                        <AppText style={[styles.progressText, { color: theme.primary }]}>{pagesReadToday} / {pageGoal}</AppText>
                    </View>
                    <Progress.Bar
                        progress={pageProgress}
                        width={null}
                        height={6}
                        color={theme.primary}
                        unfilledColor={theme.background}
                        borderWidth={0}
                        style={{ marginTop: 8 }}
                    />
                </View>
            </View>

            {/* Goal Item 2: Streak */}
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 176, 65, 0.1)' }]}>
                    <Flame color="#F5B041" size={24} />
                </View>
                <View style={styles.content}>
                    <View style={styles.row}>
                        <View>
                            <AppText style={[styles.itemTitle, { color: theme.text }]}>
                                {streak > 0 ? `${streak} Day Streak` : 'Start Your Streak'}
                            </AppText>
                            <AppText style={[styles.subText, { color: theme.textSecondary }]}>
                                {streak > 0
                                    ? (hasReadToday ? 'Keep it up!' : 'Read today to maintain!')
                                    : 'Read today to begin'
                                }
                            </AppText>
                        </View>
                        {hasReadToday && (
                            <CheckCircle color="#F5B041" fill="#F5B041" size={24} />
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: SPACING.sm,
    },
    card: {
        borderRadius: 16,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        borderWidth: 1,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    content: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    progressText: {
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 12,
        marginTop: 2,
    }
});

export default DailyGoals;
