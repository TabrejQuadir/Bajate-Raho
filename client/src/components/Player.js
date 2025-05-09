import React, { useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaVolumeUp,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { useAudioPlayer } from "../context/AudioPlayerContext"; // Import the context hook

const Player = () => {
  const { currentSong, isPlaying, togglePlayPause } = useAudioPlayer();
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false); // State to track player expansion
  const [showMessage, setShowMessage] = useState(false);
  const baseUrl = "http://localhost:5000"; // API base URL

  console.log(currentSong);


  // Reset duration and current time when currentSong changes
  useEffect(() => {
    if (!currentSong) {
      setDuration(0);
      setCurrentTime(0);
      if (audio) {
        audio.pause();
        setAudio(null);
      }
    }
  }, [currentSong]);

  // Set up the audio player when a song is selected
  useEffect(() => {
    if (currentSong) {
      const newAudio = new Audio(`${currentSong.audioUrl}`); // Set the audio URL
      setAudio(newAudio);

      newAudio.onloadedmetadata = () => {
        setDuration(newAudio.duration);
      };

      return () => {
        if (newAudio) {
          newAudio.pause();
          setCurrentTime(0);
        }
      };
    }
  }, [currentSong]);

  // Update current time and progress bar as the song plays
  useEffect(() => {
    if (audio) {
      const interval = setInterval(
        () => setCurrentTime(audio.currentTime),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [audio]);

  // Toggle play/pause
  useEffect(() => {
    if (audio) isPlaying ? audio.play() : audio.pause();
  }, [isPlaying, audio]);

  const handlePlayAttempt = () => {
    if (!currentSong) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } else {
      togglePlayPause();
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume / 100;
    }
  };

  // Handle progress change (skip to new time)
  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    setCurrentTime(newTime);
    if (audio) {
      audio.currentTime = newTime;
    }
  };

  const togglePlayerExpansion = () => setIsPlayerExpanded(!isPlayerExpanded);

  return (
    <div
      className={`fixed  ${isPlayerExpanded
        ? "md:right-8 md:top-20 right-4 top-24 z-0"
        : "fixed bottom-0 left-0 right-0 z-[999] bg-black/10 backdrop-blur-lg rounded-t-2xl shadow-2xl"
        }  p-3 md:p-6 rounded-t-3xl shadow-md border border-r-teal-600 border-t-green-500 border-l-teal-600 border-b-green-500 ${isPlayerExpanded
          ? "flex flex-col items-center space-y-4 md:space-y-8"
          : "flex justify-between items-center"
        } ${isPlayerExpanded
          ? "max-h-[90vh] md:max-h-[84%] transition-all duration-200 rounded-2xl bg-black"
          : "h-[70px] md:h-[80px] transition-all duration-200"
        }`}
      style={{ boxShadow: "0px 0px 10px #00FF00" }}
    >
      {showMessage ? (
        <div className="flex flex-col justify-center items-center space-y-2 md:space-y-4 w-full h-full text-center text-white transition-all duration-500">
          <p className="text-lg md:text-2xl font-extrabold tracking-wide transition-transform duration-300 transform animate-fade-in hover:scale-105">
            Select a song to get started
          </p>
          <p className="text-xs md:text-sm tracking-widest uppercase opacity-75 transition-opacity duration-300 hover:opacity-100">
            Your music journey begins here
          </p>
        </div>
      ) : (
        <>
          {/* Left Side (Album Art and Song Details) */}
          <div
            className={`flex ${isPlayerExpanded
              ? "flex-col items-start space-y-3"
              : "items-center space-x-2 md:space-x-4"
              }`}
          >
            {currentSong ? (
              <>
                {currentSong.image ? (
                  <img
                    src={`${currentSong.image}`}
                    alt="Album Art"
                    className={`rounded-lg ${isPlayerExpanded
                      ? "w-48 h-36 md:w-80 md:h-60"
                      : "w-12 h-12 md:w-16 md:h-16"
                      } object-cover shadow-lg`}
                  />
                ) : (
                  <div
                    className={`rounded-lg ${isPlayerExpanded ? "size-48 md:size-64" : "w-12 h-12 md:w-24 md:h-16"
                      } bg-black`}
                    style={{ boxShadow: "0px 0px 10px #00FF00" }}
                  ></div>
                )}

                <div
                  className={`${isPlayerExpanded
                    ? "flex flex-col gap-1 md:gap-2 items-start"
                    : "flex flex-row gap-2 md:gap-6 items-center"
                    } text-white justify-center transition-all duration-300 ease-in-out`}
                >
                  {/* Song Name */}
                  <span
                    className={`${isPlayerExpanded ? "text-lg md:text-xl" : "text-xs md:text-base"
                      } font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-500 animate-[fadeIn_0.5s_ease-in-out]`}
                    style={{ lineHeight: "1.2", letterSpacing: "0.05em" }}
                  >
                    {!isPlayerExpanded && "Song: "}{currentSong.name}
                  </span>

                  {/* Artist Name - hidden in collapsed mobile view */}
                  {isPlayerExpanded && (
                    <span
                      className={`text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-100 to-green-200 animate-[fadeIn_0.5s_ease-in-out] transition-colors duration-300`}
                    >
                      Artist: {currentSong.artist}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div
                className={`rounded-lg ${isPlayerExpanded ? "size-48 md:size-64" : "w-12 h-12 md:w-24 md:h-16"
                  } bg-black`}
                style={{ boxShadow: "0px 0px 10px #00FF00" }}
              ></div>
            )}
          </div>

          {/* Right Side (Controls) */}
          <div
            className={`flex ${isPlayerExpanded
              ? "flex-col items-center space-y-3 md:space-y-4"
              : "gap-2 md:gap-16 items-center"
              }`}
          >
            {/* Volume Control - hidden in collapsed mobile view */}
            {isPlaying && isPlayerExpanded && (
              <div className="flex items-center space-x-2">
                <FaVolumeUp className="text-white text-sm md:text-base" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 md:w-32 bg-gray-600 rounded-full"
                />
              </div>
            )}

            {/* Progress Bar */}
            {isPlayerExpanded && (
              <div
                className={`flex ${isPlayerExpanded ? "flex-col" : "flex-row"
                  } gap-2 md:gap-4 items-center`}
              >
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(currentTime / duration) * 100 || 0}
                  onChange={handleProgressChange}
                  className="w-64 md:w-80 bg-green-600 rounded-full"
                />
                <span className="text-xs md:text-sm text-gray-400">
                  {new Date(currentTime * 1000).toISOString().substr(14, 5)} /{" "}
                  {new Date(duration * 1000).toISOString().substr(14, 5)}
                </span>
              </div>
            )}

            {/* Center Controls */}
            <div
              className={`flex ${isPlayerExpanded
                ? "flex-col items-center space-y-3 md:space-y-4"
                : "gap-2 md:gap-8 items-center"
                }`}
            >
              <div className={`flex ${isPlayerExpanded ? "space-x-4" : "gap-2 md:gap-8"}`}>
                <button className="p-2 md:p-4 text-white bg-green-400 rounded-full shadow-md transition duration-300 hover:bg-green-700">
                  <FaBackward className="text-sm md:text-base" />
                </button>
                <button
                  onClick={handlePlayAttempt}
                  className="p-2 md:p-4 text-white bg-green-500 rounded-full shadow-md transition duration-300 hover:bg-green-700"
                >
                  {isPlaying ? <FaPause className="text-sm md:text-base" /> : <FaPlay className="text-sm md:text-base" />}
                </button>
                <button className="p-2 md:p-4 text-white bg-green-400 rounded-full shadow-md transition duration-300 hover:bg-green-700">
                  <FaForward className="text-sm md:text-base" />
                </button>
              </div>
            </div>

            {/* Expand/Collapse Player Icon */}
            <button
              onClick={togglePlayerExpansion}
              className="p-2 md:p-3 text-black bg-white rounded-full border-2 md:border-4 border-green-400 transition duration-700 hover:bg-black hover:text-white hover:border-green-600"
            >
              {isPlayerExpanded ? <FaArrowDown className="text-sm md:text-base" /> : <FaArrowUp className="text-sm md:text-base" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Player;
