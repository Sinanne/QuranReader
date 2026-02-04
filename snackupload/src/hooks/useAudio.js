/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { RECITERS } from '../constants/Reciters';

export const useAudio = (reciterId = 'alafasy', quality = 'normal') => {
    const soundRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAyaId, setCurrentAyaId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Playlist management
    const playlistRef = useRef([]);
    const currentIndexRef = useRef(-1);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const getAudioUrl = useCallback((sura, ayaNum) => {
        const reciter = RECITERS[reciterId] || RECITERS.alafasy;
        const paddedSura = sura.toString().padStart(3, '0');
        const paddedAya = ayaNum.toString().padStart(3, '0');
        const qualityPath = quality === 'normal' ? '' : `_${quality}`;
        return `${reciter.baseUrl}${qualityPath}/${paddedSura}${paddedAya}.mp3`;
    }, [reciterId, quality]);

    const playNext = async () => {
        if (currentIndexRef.current < playlistRef.current.length - 1) {
            const nextIndex = currentIndexRef.current + 1;
            const nextItem = playlistRef.current[nextIndex];
            await playAudio(nextItem, null, nextIndex);
        } else {
            setIsPlaying(false);
            setCurrentAyaId(null);
        }
    };

    const playPrev = async () => {
        if (currentIndexRef.current > 0) {
            const prevIndex = currentIndexRef.current - 1;
            const prevItem = playlistRef.current[prevIndex];
            await playAudio(prevItem, null, prevIndex);
        }
    };

    const onPlaybackStatusUpdate = (status) => {
        if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
                playNext();
            }
        } else if (status.error) {
            console.error(`Encountered a fatal error during playback: ${status.error}`);
        }
    };

    const playAudio = async (aya, list = null, specificIndex = null) => {
        try {
            if (!aya) return; // resumption logic should be separate or handled

            setIsLoading(true);

            // Update playlist if provided
            if (list) {
                playlistRef.current = list;
            }

            // Determine index
            let index = specificIndex;
            if (index === null) {
                index = playlistRef.current.findIndex(item => item.id === aya.id);
            }
            // If not in playlist (and no list provided), maybe single play?
            if (index !== -1) {
                currentIndexRef.current = index;
            }

            const sura = aya.details.sura;
            const ayaNum = aya.details.aya_sura_id;
            const audioUrl = getAudioUrl(sura, ayaNum);

            // Unload existing
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
            }

            // Setup audio mode
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
            });

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioUrl },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );

            soundRef.current = newSound;
            setCurrentAyaId(aya.id);
            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing audio:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const pauseAudio = async () => {
        if (soundRef.current) {
            await soundRef.current.pauseAsync();
            setIsPlaying(false);
        }
    };

    return {
        playAudio,
        pauseAudio,
        playNext,
        playPrev,
        isPlaying,
        currentAyaId,
        isLoading
    };
};

export default useAudio;
