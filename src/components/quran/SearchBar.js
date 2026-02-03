import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useSettings } from '../../screens/SettingsContext';
import { SPACING } from '../../theme/spacing';
import { Search } from 'lucide-react-native';

const SearchBar = ({ value, onChangeText, placeholder }) => {
    const { theme } = useSettings();

    return (
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
            <Search size={20} color={theme.text} style={styles.icon} />
            <TextInput
                style={[styles.input, { color: theme.text }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="rgba(0,0,0,0.3)"
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
