import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ReadingScreen from '../screens/ReadingScreen';
import ExploreScreen from '../screens/ExploreScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MemorizationScreen from '../screens/MemorizationScreen';
import MemorizationPickerScreen from '../screens/MemorizationPickerScreen';

// Theme
import { COLORS } from '../theme/colors';

const Stack = createStackNavigator();

const RootNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: COLORS.brand?.background || '#0D1F16' },
                headerTintColor: COLORS.text?.primary || '#FFFFFF',
                headerTitleStyle: { fontWeight: 'bold' },
                ...TransitionPresets.SlideFromRightIOS,
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Explore"
                component={ExploreScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Quran"
                component={ReadingScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Bookmarks"
                component={BookmarksScreen}
                options={{ title: 'Bookmarks' }}
            />
            <Stack.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{ title: 'Favorites' }}
            />
            <Stack.Screen
                name="Progress"
                component={ProgressScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Memorization"
                component={MemorizationScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="MemorizationPicker"
                component={MemorizationPickerScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default RootNavigator;
