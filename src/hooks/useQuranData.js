import { useState, useMemo, useCallback } from 'react';

let quranData, translationData;

try {
    quranData = require('../data/QuranData.json');
    translationData = require('../data/QuranEn.json');
} catch (error) {
    console.error('Error loading Quran data:', error);
    quranData = [];
    translationData = [];
}

export const useQuranData = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [dataError, setDataError] = useState(null);

    const normalizedData = useMemo(() => {
        try {
            // Basic normalization or sorting if needed
            return quranData.map((aya, index) => ({
                ...aya,
                id: index, // Ensuring stable ID for FlashList
            }));
        } catch (error) {
            console.error('Error normalizing Quran data:', error);
            setDataError('Failed to load Quran data');
            return [];
        }
    }, []);

    const getTranslation = useCallback((sura, ayaSuraId) => {
        try {
            if (!translationData || translationData.length === 0) {
                return 'Translation data unavailable';
            }
            return translationData.find(
                (t) => t.sura === sura && t.aya_sura_id === ayaSuraId
            )?.aya_eng || 'Translation not found';
        } catch (error) {
            console.error('Error getting translation:', error);
            return 'Translation error';
        }
    }, []);

    const filteredData = useMemo(() => {
        if (!searchQuery) return normalizedData;
        try {
            const query = searchQuery.toLowerCase();
            return normalizedData.filter(item =>
                item.details.name_eng.toLowerCase().includes(query) ||
                item.details.aya.includes(query)
            );
        } catch (error) {
            console.error('Error filtering data:', error);
            return normalizedData;
        }
    }, [normalizedData, searchQuery]);

    return {
        quranData: normalizedData,
        filteredData,
        getTranslation,
        setSearchQuery,
        searchQuery,
        dataError,
    };
};

export default useQuranData;
