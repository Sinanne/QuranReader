import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useSettings } from '../../screens/SettingsContext';

const HomeHeader = () => {
    const { theme } = useSettings();

    // Using a fallback for mainImage if not defined in the new theme system, 
    // but we should eventually host these locally.
    const mainImage = 'https://parspng.com/wp-content/uploads/2022/09/quranpng.parspng.com-5.png';

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: mainImage }}
                style={styles.icon}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 40,
    },
    icon: {
        width: 240,
        height: 240,
    },
});

export default HomeHeader;
