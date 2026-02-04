import AsyncStorage from '@react-native-async-storage/async-storage';

let storage = null;
let isMMKVAvailable = false;

try {
    // We use require() here because top-level import { MMKV } would be hoisted
    // and trigger the "NitroModules not supported" error in Expo Go immediately.
    const { MMKV } = require('react-native-mmkv');
    storage = new MMKV();
    isMMKVAvailable = true;
    console.log('Storage: MMKV is available and initialized.');
} catch (e) {
    // This will catch the "NitroModules are not supported in Expo Go!" error
    console.log('Storage: MMKV not supported in this environment (likely Expo Go). Using AsyncStorage.');
}

export const zustandStorage = {
    setItem: async (name, value) => {
        if (isMMKVAvailable && storage) {
            try {
                storage.set(name, value);
                return;
            } catch (err) {
                console.error('MMKV setItem failure:', err);
            }
        }
        await AsyncStorage.setItem(name, value);
    },
    getItem: async (name) => {
        if (isMMKVAvailable && storage) {
            try {
                const value = storage.getString(name);
                return value ?? null;
            } catch (err) {
                console.error('MMKV getItem failure:', err);
            }
        }
        return await AsyncStorage.getItem(name);
    },
    removeItem: async (name) => {
        if (isMMKVAvailable && storage) {
            try {
                storage.delete(name);
                return;
            } catch (err) {
                console.error('MMKV removeItem failure:', err);
            }
        }
        await AsyncStorage.removeItem(name);
    },
};
