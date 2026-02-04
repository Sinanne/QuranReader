import StorageService from '../services/StorageService';
import { useState, useEffect, useCallback } from 'react';

const useBookmarkFavorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [ayaStates, setAyaStates] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedBookmarks = await StorageService.getBookmarks();
        const savedFavorites = await StorageService.getFavorites();
        const savedAyaStates = await StorageService.getAyaStates();

        setBookmarked(savedBookmarks);
        setFavorites(savedFavorites);
        setAyaStates(savedAyaStates);
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };

    loadData();
  }, []);

  const updateStorage = useCallback(async (type, data, states) => {
    try {
      await StorageService.setMultiple([
        [type, data],
        ['ayaStates', states]
      ]);
    } catch (e) {
      console.error(`Failed to save ${type}`, e);
    }
  }, []);

  const toggleFavorite = useCallback(async (ayaId) => {
    setFavorites((currentFavorites) => {
      const isFavorited = !currentFavorites.includes(ayaId);
      const updatedFavorites = isFavorited
        ? [...currentFavorites, ayaId]
        : currentFavorites.filter((id) => id !== ayaId);

      setAyaStates((currentStates) => {
        const updatedStates = {
          ...currentStates,
          [ayaId]: {
            ...currentStates[ayaId],
            favorite: isFavorited,
            timestamp: isFavorited ? new Date().toLocaleString() : null,
          },
        };

        updateStorage('favorites', updatedFavorites, updatedStates);
        return updatedStates;
      });

      return updatedFavorites;
    });
  }, [updateStorage]);

  const toggleBookmark = useCallback(async (ayaId) => {
    setBookmarked((currentBookmarked) => {
      const isBookmarked = !currentBookmarked.includes(ayaId);
      const updatedBookmarked = isBookmarked
        ? [...currentBookmarked, ayaId]
        : currentBookmarked.filter((id) => id !== ayaId);

      setAyaStates((currentStates) => {
        const updatedStates = {
          ...currentStates,
          [ayaId]: {
            ...currentStates[ayaId],
            bookmarked: isBookmarked,
            timestamp: isBookmarked ? new Date().toLocaleString() : null,
          },
        };

        updateStorage('bookmarked', updatedBookmarked, updatedStates);
        return updatedStates;
      });

      return updatedBookmarked;
    });
  }, [updateStorage]);

  return {
    favorites,
    bookmarked,
    ayaStates,
    setAyaStates,
    toggleFavorite,
    toggleBookmark,
  };
};

export default useBookmarkFavorite;