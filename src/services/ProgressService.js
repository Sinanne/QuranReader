import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../store/useStore';

const KEYS = {
    // COMPLETED_AYAHS: 'completedAyahs', // Migrated to Zustand/MMKV
    LAST_READ: 'lastRead',
    STREAK_DATA: 'streakData',
    DAILY_PAGES: 'dailyPages',
    ACTIVITY_LOG: 'activityLog',
};

const TOTAL_AYAHS = 6236;

class ProgressService {
    // ==================== COMPLETED AYAHS (Hybrid / Store) ====================

    static async markAyahComplete(surahId, ayahId) {
        try {
            // 1. Update Global Store (Source of Truth)
            const state = useStore.getState();
            // check if already marked to avoid double-logging stats
            const id = `${surahId}:${ayahId}`;
            const alreadyRead = state.readAyahs.includes(id);

            if (!alreadyRead) {
                state.markAyahRead(surahId, ayahId);

                // 2. Trigger Side Effects (Legacy Stats)
                await this.updateStreak();
                await this.incrementDailyPages();
                await this.logActivity(1);
            }
            return true;
        } catch (error) {
            console.error('ProgressService.markAyahComplete error:', error);
            return false;
        }
    }

    static async getCompletedAyahs() {
        // Return from Store
        return useStore.getState().readAyahs;
    }

    static async getCompletionPercentage() {
        const completed = useStore.getState().readAyahs;
        return Math.round((completed.length / TOTAL_AYAHS) * 100);
    }

    static async getCompletedCount() {
        return useStore.getState().readAyahs.length;
    }

    static async getSurahProgress(surahId, totalAyahs) {
        const completed = useStore.getState().readAyahs;
        const prefix = `${surahId}:`;
        // Exact match prefix check
        const surahCompleted = completed.filter(key => key.startsWith(prefix)).length;

        if (totalAyahs === 0) return 0;
        return Math.round((surahCompleted / totalAyahs) * 100);
    }

    // ==================== LAST READ (Legacy / Async) ====================
    // Could migrate to Store soon, but keeping as is for now

    static async setLastRead(surahId, surahName, ayahId, juz = 1) {
        try {
            const lastRead = {
                surahId,
                surahName,
                ayahId,
                juz,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem(KEYS.LAST_READ, JSON.stringify(lastRead));
            return true;
        } catch (error) {
            console.error('ProgressService.setLastRead error:', error);
            return false;
        }
    }

    static async getLastRead() {
        try {
            const data = await AsyncStorage.getItem(KEYS.LAST_READ);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('ProgressService.getLastRead error:', error);
            return null;
        }
    }

    // ==================== STREAK (Legacy / Async) ====================

    static async updateStreak() {
        try {
            const today = new Date().toDateString();
            const streakData = await this.getStreakData();

            if (streakData.lastReadDate === today) {
                return streakData.currentStreak;
            }

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            let newStreak = 1;
            if (streakData.lastReadDate === yesterdayStr) {
                newStreak = streakData.currentStreak + 1;
            }

            const newStreakData = {
                currentStreak: newStreak,
                lastReadDate: today,
                longestStreak: Math.max(newStreak, streakData.longestStreak || 0),
            };

            await AsyncStorage.setItem(KEYS.STREAK_DATA, JSON.stringify(newStreakData));
            return newStreak;
        } catch (error) {
            console.error('ProgressService.updateStreak error:', error);
            return 0;
        }
    }

    static async getStreakData() {
        try {
            const data = await AsyncStorage.getItem(KEYS.STREAK_DATA);
            return data ? JSON.parse(data) : { currentStreak: 0, lastReadDate: null, longestStreak: 0 };
        } catch (error) {
            console.error('ProgressService.getStreakData error:', error);
            return { currentStreak: 0, lastReadDate: null, longestStreak: 0 };
        }
    }

    static async getStreak() {
        const data = await this.getStreakData();
        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (data.lastReadDate === today || data.lastReadDate === yesterdayStr) {
            return data.currentStreak;
        }
        return 0;
    }

    // ==================== DAILY PAGES (Legacy) ====================

    static async incrementDailyPages() {
        try {
            const today = new Date().toDateString();
            const dailyData = await this.getDailyPagesData();

            if (dailyData.date !== today) {
                dailyData.date = today;
                dailyData.pages = 0;
                dailyData.ayahsToday = 0; // Reset ayahs count too
            }

            dailyData.ayahsToday = (dailyData.ayahsToday || 0) + 1;
            dailyData.pages = Math.floor(dailyData.ayahsToday / 15);

            await AsyncStorage.setItem(KEYS.DAILY_PAGES, JSON.stringify(dailyData));
            return dailyData.pages;
        } catch (error) {
            console.error('ProgressService.incrementDailyPages error:', error);
            return 0;
        }
    }

    static async getDailyPagesData() {
        try {
            const data = await AsyncStorage.getItem(KEYS.DAILY_PAGES);
            const parsed = data ? JSON.parse(data) : { date: null, pages: 0, ayahsToday: 0 };

            const today = new Date().toDateString();
            if (parsed.date !== today) {
                return { date: today, pages: 0, ayahsToday: 0 };
            }
            return parsed;
        } catch (error) {
            console.error('ProgressService.getDailyPagesData error:', error);
            return { date: null, pages: 0, ayahsToday: 0 };
        }
    }

    static async getTodayPages() {
        const data = await this.getDailyPagesData();
        return data.pages;
    }

    // ==================== ACTIVITY LOG (Legacy) ====================

    static async logActivity(amount = 1) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const log = await this.getActivityLog();

            if (log[today]) {
                log[today] += amount;
            } else {
                log[today] = amount;
            }

            const sortedDates = Object.keys(log).sort();
            if (sortedDates.length > 365) {
                const newLog = {};
                sortedDates.slice(-365).forEach(date => {
                    newLog[date] = log[date];
                });
                await AsyncStorage.setItem(KEYS.ACTIVITY_LOG, JSON.stringify(newLog));
            } else {
                await AsyncStorage.setItem(KEYS.ACTIVITY_LOG, JSON.stringify(log));
            }
        } catch (error) {
            console.error('ProgressService.logActivity error:', error);
        }
    }

    static async getActivityLog() {
        try {
            const data = await AsyncStorage.getItem(KEYS.ACTIVITY_LOG);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            return {};
        }
    }

    static async getWeeklyActivity() {
        const log = await this.getActivityLog();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const result = [];

        // Find the most recent Sunday
        const today = new Date();
        const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - currentDay);

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = days[date.getDay()];

            result.push({
                day: dayName,
                fullDate: dateStr,
                count: log[dateStr] || 0,
                isToday: date.toDateString() === today.toDateString()
            });
        }
        return result;
    }

    static async getMonthlyActivity() {
        const result = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const log = await this.getActivityLog();
        const today = new Date();

        // Get last 12 months
        for (let i = 11; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const year = d.getFullYear();
            const month = d.getMonth();
            const monthStr = (month + 1).toString().padStart(2, '0');
            const yearMonthPrefix = `${year}-${monthStr}`;

            let count = 0;
            Object.keys(log).forEach(dateKey => {
                if (dateKey.startsWith(yearMonthPrefix)) {
                    count += log[dateKey];
                }
            });

            result.push({
                label: months[month],
                count: count
            });
        }
        return result;
    }

    static async getYearlyActivity() {
        const result = [];
        const log = await this.getActivityLog();
        const today = new Date();

        // Get last 5 years
        for (let i = 4; i >= 0; i--) {
            const year = today.getFullYear() - i;
            const yearStr = year.toString();

            let count = 0;
            Object.keys(log).forEach(dateKey => {
                if (dateKey.startsWith(yearStr)) {
                    count += log[dateKey];
                }
            });

            result.push({
                label: yearStr,
                count: count
            });
        }
        return result;
    }

    static async getAnalytics() {
        const log = await this.getActivityLog();
        const dates = Object.keys(log);
        const totalAyahs = await this.getCompletedCount();

        const analytics = {
            avgDaily: dates.length > 0 ? Math.round(totalAyahs / dates.length) : 0,
            bestDay: { date: null, count: 0 },
            totalDaysActive: dates.length,
            estimatedDays: totalAyahs > 0 ? Math.round((TOTAL_AYAHS - totalAyahs) / (totalAyahs / (dates.length || 1))) : 0
        };

        dates.forEach(date => {
            if (log[date] > analytics.bestDay.count) {
                analytics.bestDay = { date, count: log[date] };
            }
        });

        return analytics;
    }

    static async resetAllProgress() {
        try {
            await AsyncStorage.multiRemove(Object.values(KEYS));
            useStore.getState().resetProgress(); // Assuming this exists or we add it
            return true;
        } catch (error) {
            console.error('Reset Progress Error:', error);
            return false;
        }
    }
}

export default ProgressService;
