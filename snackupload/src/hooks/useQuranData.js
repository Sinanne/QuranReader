import { useState, useMemo, useCallback } from 'react';
import { useStore } from '../store/useStore';

let quranData, translationDataEn, translationDataFr, translationDataEs;

try {
    quranData = require('../data/QuranData.json');
    translationDataEn = require('../data/QuranEn.json');
} catch (error) {
    console.error('Error loading core data:', error);
}

// Load optional languages
try { translationDataFr = require('../data/QuranFR.json'); } catch (e) { console.log('FR data missing'); }
try { translationDataEs = require('../data/QuranES.json'); } catch (e) { console.log('ES data missing'); }

export const useQuranData = () => {
    // Connect to Zustand Store
    const readingLanguage = useStore(state => state.settings.readingLanguage);

    const [searchQuery, setSearchQuery] = useState('');
    const [dataError, setDataError] = useState(null);

    const activeTranslation = useMemo(() => {
        const lang = readingLanguage || 'en';
        if (lang === 'fr') return translationDataFr || [];
        if (lang === 'es') return translationDataEs || [];
        return translationDataEn || [];
    }, [readingLanguage]);

    const normalizedData = useMemo(() => {
        try {
            if (!quranData) return [];
            return quranData.map((aya, index) => {
                let text = aya.aya;
                // Remove Bismillah from first ayah of surahs (except Al-Fatiha)
                if (aya.details.sura !== 1 && aya.details.aya_sura_id === 1) {
                    text = text.replace(/^[\uFEFF\s]*بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '');
                }

                return {
                    ...aya,
                    aya: text,
                    id: index,
                };
            });
        } catch (error) {
            console.error('Error normalizing Quran data:', error);
            setDataError('Failed to load Quran data');
            return [];
        }
    }, []);

    const getTranslation = useCallback((sura, ayaSuraId) => {
        try {
            if (!activeTranslation || activeTranslation.length === 0) {
                return 'Translation data unavailable';
            }
            return activeTranslation.find(
                (t) => t.sura === sura && t.aya_sura_id === ayaSuraId
            )?.aya_eng || 'Translation not found';
        } catch (error) {
            console.error('Error getting translation:', error);
            return 'Translation error';
        }
    }, [activeTranslation]);

    const filteredData = useMemo(() => {
        if (!normalizedData) return [];
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
