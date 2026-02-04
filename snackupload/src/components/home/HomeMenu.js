import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppButton from '../common/AppButton';
import { SPACING } from '../../theme/spacing';
import { BookOpen, TrendingUp } from 'lucide-react-native';

const HomeMenu = ({ onReadPress, onProgressPress }) => {
    return (
        <View style={styles.container}>
            <AppButton
                title="Read Holy Quran"
                onPress={onReadPress}
                style={styles.button}
                icon={<BookOpen color="white" size={24} style={styles.icon} />}
                accessibilityLabel="Read Holy Quran"
                accessibilityHint="Navigate to Quran reading screen"
            />
            <AppButton
                title="Track Progress"
                onPress={onProgressPress}
                style={styles.button}
                variant="secondary"
                icon={<TrendingUp color="#800020" size={24} style={styles.icon} />}
                accessibilityLabel="Track Progress"
                accessibilityHint="Navigate to progress tracking screen"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    button: {
        width: '85%',
    },
    icon: {
        marginRight: SPACING.sm,
    },
});

export default HomeMenu;
