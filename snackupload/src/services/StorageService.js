import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  static KEYS = {
    APP_SETTINGS: 'appSettings',
    BOOKMARKS: 'bookmarked',
    FAVORITES: 'favorites',
    AYA_STATES: 'ayaStates',
    LAST_READ_SURAH: 'lastReadSurah',
    READING_START_DATE: 'readingStartDate',
    SELECTED_ITEMS: 'selectedItems',
    PROGRESS_PERCENTAGE: 'progressPercentage',
    READING_SESSIONS: 'readingSessions',
    PRAYER_TIMES: 'prayerTimes',
    PRAYER_LOCATION: 'prayerLocation',
    DAILY_VERSE: 'dailyVerse',
  };

  static async get(key, defaultValue = null) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error(`StorageService: Failed to get ${key}:`, error);
      return defaultValue;
    }
  }

  static async set(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`StorageService: Failed to set ${key}:`, error);
      return false;
    }
  }

  static async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`StorageService: Failed to remove ${key}:`, error);
      return false;
    }
  }

  static async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('StorageService: Failed to clear storage:', error);
      return false;
    }
  }

  static async getMultiple(keys) {
    try {
      const values = await AsyncStorage.multiGet(keys);
      const result = {};
      values.forEach(([key, value]) => {
        result[key] = value ? JSON.parse(value) : null;
      });
      return result;
    } catch (error) {
      console.error('StorageService: Failed to get multiple keys:', error);
      return {};
    }
  }

  static async setMultiple(keyValuePairs) {
    try {
      const serializedPairs = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(serializedPairs);
      return true;
    } catch (error) {
      console.error('StorageService: Failed to set multiple keys:', error);
      return false;
    }
  }

  // Convenience methods for common operations
  static async getAppSettings(defaultSettings = {}) {
    return this.get(this.KEYS.APP_SETTINGS, defaultSettings);
  }

  static async setAppSettings(settings) {
    return this.set(this.KEYS.APP_SETTINGS, settings);
  }

  static async getBookmarks() {
    return this.get(this.KEYS.BOOKMARKS, []);
  }

  static async setBookmarks(bookmarks) {
    return this.set(this.KEYS.BOOKMARKS, bookmarks);
  }

  static async getFavorites() {
    return this.get(this.KEYS.FAVORITES, []);
  }

  static async setFavorites(favorites) {
    return this.set(this.KEYS.FAVORITES, favorites);
  }

  static async getAyaStates() {
    return this.get(this.KEYS.AYA_STATES, {});
  }

  static async setAyaStates(states) {
    return this.set(this.KEYS.AYA_STATES, states);
  }

  static async getLastReadSurah() {
    return this.get(this.KEYS.LAST_READ_SURAH, null);
  }

  static async setLastReadSurah(surah) {
    return this.set(this.KEYS.LAST_READ_SURAH, surah);
  }

  static async getReadingProgress() {
    return this.get(this.KEYS.PROGRESS_PERCENTAGE, 0);
  }

  static async setReadingProgress(progress) {
    return this.set(this.KEYS.PROGRESS_PERCENTAGE, progress);
  }
}

export default StorageService;