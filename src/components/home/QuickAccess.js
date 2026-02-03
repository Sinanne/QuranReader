import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSettings } from '../../screens/SettingsContext';
import { SPACING } from '../../theme/spacing';
import { Bookmark, Star, Archive, Settings } from 'lucide-react-native';

const QuickAccess = ({ navigation }) => {
    const { theme } = useSettings();

    const actions = [
        { icon: Bookmark, screen: 'Bookmarks' },
        { icon: Star, screen: 'Favorites' },
        { icon: Archive, screen: 'Archives' },
        { icon: Settings, screen: 'Settings' },
    ];

    return (
        <View style={styles.container}>
            {actions.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate(item.screen)}
                >
                    <item.icon color="white" size={22} />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.lg,
        marginTop: SPACING.lg,
    },
    button: {
        padding: SPACING.md,
        borderRadius: SPACING.md,
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
});

export default QuickAccess;
