import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SPACING } from '../../theme/spacing';
import AppText from '../common/AppText';
import { ChevronLeft, BookOpen, Scaling } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/useTheme';

const ReadingHeader = ({ title, subtitle, mode, onToggleMode, onToggleFontSize }) => {
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <ChevronLeft color={colors.text} size={28} />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
                <AppText style={[styles.title, { color: colors.text }]}>{title}</AppText>
                <AppText style={[styles.subtitle, { color: colors.primary }]}>{subtitle}</AppText>
            </View>

            <View style={styles.actionGroup}>
                <TouchableOpacity onPress={onToggleMode} style={styles.iconBtn}>
                    <BookOpen color={colors.primary} size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onToggleFontSize} style={styles.iconBtn}>
                    <Scaling color={colors.primary} size={24} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
    },
    backBtn: {
        width: 40,
        alignItems: 'flex-start',
    },
    titleContainer: {
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginTop: 2,
        textTransform: 'uppercase',
    },
    actionGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    iconBtn: {
        padding: 4,
    }
});

export default ReadingHeader;
