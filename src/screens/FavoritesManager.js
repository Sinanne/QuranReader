import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useFavoritesManager = () => {
  const [favorites, setFavorites] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [ayaStates, setAyaStates] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedBookmarks = await AsyncStorage.getItem('bookmarked');
        const savedFavorites = await AsyncStorage.getItem('favorites');
        const savedAyaStates = await AsyncStorage.getItem('ayaStates');

        if (savedBookmarks) setBookmarked(JSON.parse(savedBookmarks));
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        if (savedAyaStates) setAyaStates(JSON.parse(savedAyaStates));
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };

    loadData();
  }, []);

  const updateFavoritesInStorage = async (updatedFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      await AsyncStorage.setItem('ayaStates', JSON.stringify(ayaStates));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  };

  const toggleFavorite = async (ayaId) => {
    setAyaStates((prev) => {
      const isFavorited = !prev[ayaId]?.favorite;
      const timestamp = isFavorited ? new Date().toLocaleString() : null;
      const updatedAyaStates = {
        ...prev,
        [ayaId]: {
          ...prev[ayaId],
          favorite: isFavorited,
          timestamp: timestamp,
        },
      };

      const updatedFavorites = isFavorited
        ? [...favorites, ayaId]
        : favorites.filter((id) => id !== ayaId);

      setFavorites(updatedFavorites);
      setAyaStates(updatedAyaStates);
      updateFavoritesInStorage(updatedFavorites);

      return updatedAyaStates;
    });
  };

  const updateBookmarksInStorage = async (updatedBookmarked) => {
    try {
      await AsyncStorage.setItem('bookmarked', JSON.stringify(updatedBookmarked));
      await AsyncStorage.setItem('ayaStates', JSON.stringify(ayaStates));
    } catch (e) {
      console.error('Failed to save bookmarks', e);
    }
  };

  const toggleBookmark = async (ayaId) => {
    setAyaStates((prev) => {
      const isBookmarked = !prev[ayaId]?.bookmarked;
      const timestamp = isBookmarked ? new Date().toLocaleString() : null;
      const updatedAyaStates = {
        ...prev,
        [ayaId]: {
          ...prev[ayaId],
          bookmarked: isBookmarked,
          timestamp: timestamp,
        },
      };

      const updatedBookmarked = isBookmarked
        ? [...bookmarked, ayaId]
        : bookmarked.filter((id) => id !== ayaId);

      setBookmarked(updatedBookmarked);
      setAyaStates(updatedAyaStates);
      updateBookmarksInStorage(updatedBookmarked);

      return updatedAyaStates;
    });
  };

  return {
    favorites,
    bookmarked,
    ayaStates,
    toggleFavorite,
    toggleBookmark,
  };
};