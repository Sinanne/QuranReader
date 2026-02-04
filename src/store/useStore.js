import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';
import { THEMES } from '../theme/colors';
import { DEFAULT_RECITER } from '../constants/Reciters';

const DEFAULT_SETTINGS = {
    // Theme & UI
    themeMode: 'light', // 'light' | 'dark' | 'system'
    isDarkMode: false, // Computed or explicit
    readingStyle: 'Normal', // 'Ayah', 'Continuous', 'Mushaf'

    // Reading Prefs
    fontSize: 18,
    fontName: 'Amiri',
    showWordByWord: false,
    showTafsir: false,
    readingLanguage: 'en', // 'en', 'fr', 'es'

    // Audio
    reciter: DEFAULT_RECITER,
    reciterQuality: 'normal',
    playbackSpeed: 'normal',
    audioQuality: 'high',
    autoPlay: false,

    // Goals & Notifications
    dailyPageGoal: 15,
    memorizationGoal: 5,
    dailyReminder: false,
    prayerNotifications: true,
};

export const useStore = create(
    persist(
        (set, get) => ({
            // Slice: Settings
            settings: DEFAULT_SETTINGS,

            setSettings: (newSettings) => set((state) => ({
                settings: { ...state.settings, ...newSettings }
            })),

            updateSetting: (key, value) => set((state) => ({
                settings: { ...state.settings, [key]: value }
            })),

            // Slice: Progress (Reading History)
            // Array of read history: { suraId, ayaId, timestamp } or simplified checklist
            // We will track "Read Ayahs" by ID to calculate completion
            readAyahs: [], // Array of logic IDs e.g. "1:1", "1:2"

            markAyahRead: (sura, aya) => set((state) => {
                const id = `${sura}:${aya}`;
                if (state.readAyahs.includes(id)) return state;
                return { readAyahs: [...state.readAyahs, id] };
            }),

            toggleAyahRead: (sura, aya) => set((state) => {
                const id = `${sura}:${aya}`;
                const exists = state.readAyahs.includes(id);
                return {
                    readAyahs: exists
                        ? state.readAyahs.filter(x => x !== id)
                        : [...state.readAyahs, id]
                };
            }),

            // Slice: Memorization (Hifz)
            // { id: "2:255", lastReviewed: timestamp, retainment: 0-100, strength: 0-5 }
            memorizedAyahs: [],

            addToMemorized: (sura, aya) => set((state) => {
                const id = `${sura}:${aya}`;
                const exists = state.memorizedAyahs.find(m => m.id === id);
                if (exists) return state;

                return {
                    memorizedAyahs: [
                        ...state.memorizedAyahs,
                        {
                            id,
                            sura: Number(sura),
                            aya: Number(aya),
                            lastReviewed: Date.now(),
                            retainment: 100,
                            strength: 5
                        }
                    ]
                };
            }),

            toggleMemorized: (sura, aya) => set((state) => {
                const id = `${sura}:${aya}`;
                const exists = state.memorizedAyahs.find(m => m.id === id);
                if (exists) {
                    return {
                        memorizedAyahs: state.memorizedAyahs.filter(m => m.id !== id)
                    };
                }
                return {
                    memorizedAyahs: [
                        ...state.memorizedAyahs,
                        {
                            id,
                            sura: Number(sura),
                            aya: Number(aya),
                            lastReviewed: Date.now(),
                            retainment: 100,
                            strength: 5
                        }
                    ]
                };
            }),

            updateMemorization: (sura, aya, data) => set((state) => {
                const id = `${sura}:${aya}`;
                return {
                    memorizedAyahs: state.memorizedAyahs.map(m =>
                        m.id === id ? { ...m, ...data, lastReviewed: Date.now() } : m
                    )
                };
            }),

            // Actions
            resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
            resetProgress: () => set({ readAyahs: [], memorizedAyahs: [] }),
        }),
        {
            name: 'quran-app-storage',
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);
