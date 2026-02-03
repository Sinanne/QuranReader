import { useState, useCallback, useEffect } from 'react';
import { Audio } from 'expo-audio';
import { RECITERS } from '../constants/Reciters';

export const useAudio = (reciterId = 'alafasy', quality = 'normal') => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAyaId, setCurrentAyaId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getAudioUrl = useCallback((sura, ayaNum) => {
        const reciter = RECITERS[reciterId] || RECITERS.alafasy;
        const paddedSura = sura.toString().padStart(3, '0');
        const paddedAya = ayaNum.toString().padStart(3, '0');
        const qualityPath = quality === 'normal' ? '' : `_${quality}`;
        return `${reciter.baseUrl}${qualityPath}/${paddedSura}${paddedAya}.mp3`;
    }, [reciterId, quality]);

    const playAudio = useCallback(async (aya) => {
        try {
            setIsLoading(true);
            
            const sura = aya.details.sura;
            const ayaNum = aya.details.aya_sura_id;
            const audioUrl = getAudioUrl(sura, ayaNum);
            
            if (sound) {
                await sound.unloadAsync();
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioUrl },
                { 
                    shouldPlay: true,
                    volume: 1.0,
                    isLooping: false,
                }
            );

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    if (status.didJustFinish) {
                        setIsPlaying(false);
                        setCurrentAyaId(null);
                    } else if (status.isPlaying) {
                        setIsPlaying(true);
                    } else if (status.isLoaded && !status.isPlaying) {
                        setIsPlaying(false);
                    }
                }
            });

            setSound(newSound);
            setIsPlaying(true);
            setCurrentAyaId(aya.id);
        } catch (error) {
            console.error('Error playing audio:', error);
            setIsLoading(false);
        }
    }, [sound, getAudioUrl]);

    const pauseAudio = useCallback(async () => {
        try {
            if (sound && isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            }
        } catch (error) {
            console.error('Error pausing audio:', error);
        }
    }, [sound, isPlaying]);

    const resumeAudio = useCallback(async () => {
        try {
            if (sound && !isPlaying) {
                await sound.playAsync();
                setIsPlaying(true);
            }
        } catch (error) {
            console.error('Error resuming audio:', error);
        }
    }, [sound, isPlaying]);

    const stopAudio = useCallback(async () => {
        try {
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
                setIsPlaying(false);
                setCurrentAyaId(null);
                setSound(null);
            }
        } catch (error) {
            console.error('Error stopping audio:', error);
        }
    }, [sound]);

    const seekToPosition = useCallback(async (position) => {
        try {
            if (sound && isPlaying) {
                await sound.setPositionAsync(position);
            }
        } catch (error) {
            console.error('Error seeking audio:', error);
        }
    }, [sound, isPlaying]);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    return {
        playAudio,
        pauseAudio,
        resumeAudio,
        stopAudio,
        seekToPosition,
        isPlaying,
        isLoading,
        currentAyaId,
    };
};

export default useAudio;
