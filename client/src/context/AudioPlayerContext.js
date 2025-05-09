// In your AudioPlayerContext.js or equivalent

import React, { createContext, useContext, useState } from 'react';

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => {
  return useContext(AudioPlayerContext);
};

export const AudioPlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const nextSong = () => {
    // Logic for getting the next song from an album or playlist
  };

  const previousSong = () => {
    // Logic for getting the previous song
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        isPlaying,
        setIsPlaying,
        togglePlayPause,
        nextSong,
        previousSong,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export default AudioPlayerContext;
