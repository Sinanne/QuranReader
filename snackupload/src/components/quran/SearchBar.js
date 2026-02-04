import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { SPACING } from '../../theme/spacing';
import { Search } from 'lucide-react-native';

const SearchBar = ({ value, onChangeText, placeholder }) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.highlight, borderColor: colors.border }]}>
            <Search size={20} color={colors.primary} style={styles.icon} />
            <TextInput
                style={[styles.input, { color: colors.text }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        margin: SPACING.md,
        borderRadius: SPACING.sm,
        height: 48,
        borderWidth: 1,
        elevation: 2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    icon: {
        marginRight: SPACING.sm,
        opacity: 0.5,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
});

export default SearchBar;
