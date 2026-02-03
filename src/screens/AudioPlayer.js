// AudioPlayer.js
import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

const useAudioPlayer = () => {
  const [sound, setSound] = useState(null);

  const handlePlay = async (ayaDetails) => {
    console.log('Play button pressed for Aya Details:', ayaDetails);
    if (!ayaDetails) {
      console.error('Aya details are missing. Exiting play handler.');
      return;
    }

    const sura = ayaDetails.sura.toString().padStart(3, '0');
    const aya = ayaDetails.aya_sura_id.toString().padStart(3, '0');

    const audioPath = `https://everyayah.com/data/Alafasy_64kbps/${sura}${aya}.mp3`;
    console.log('Audio URL:', audioPath);

    try {
      // Unload the previous sound
      if (sound) {
        console.log('Unloading existing sound...');
        await sound.unloadAsync();
        setSound(null);
      }

      // Create and load the new sound
      console.log('Creating a new audio instance...');
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioPath },
        { shouldPlay: true } // Automatically start playback
      );

      setSound(newSound);
      console.log('Audio successfully loaded. Starting playback...');
    } catch (error) {
      console.error('Error during audio playback:', error);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return { handlePlay };
};

export default useAudioPlayer;