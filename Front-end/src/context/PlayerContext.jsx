import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";

// Create PlayerContext
export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const url = "http://localhost:4000"; // API URL

  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [track, setTrack] = useState(null); // Default track is null to handle initial state better
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  // Play the track
  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  // Pause the track
  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  // Play track with a given ID
  const playWithId = async (id) => {
    const song = songsData.find((song) => song._id === id);
    if (song) {
      // Fetch video and lyrics data for the song
      await fetchSongDetails(song._id);
      setTrack(song);
      play();
    }
  };

  // Fetch additional song details (video and lyrics)
  const fetchSongDetails = async (songId) => {
    try {
      const response = await axios.get(`${url}/api/song/${songId}/details`);
      if (response.data.success) {
        setTrack(prevTrack => ({
          ...prevTrack,
          videoUrl: response.data.videoUrl,
          lyrics: response.data.lyrics
        }));
      }
    } catch (error) {
      console.error("Error fetching song details:", error);
    }
  };

  // Handle previous track
  const previous = () => {
    const currentIndex = songsData.findIndex((item) => item._id === track._id);
    if (currentIndex > 0) {
      setTrack(songsData[currentIndex - 1]);
      play();
    }
  };

  // Handle next track
  const next = () => {
    const currentIndex = songsData.findIndex((item) => item._id === track._id);
    if (currentIndex < songsData.length - 1) {
      setTrack(songsData[currentIndex + 1]);
      play();
    }
  };

  // Handle seeking
  const seekSong = (e) => {
    const seekPosition = (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
    audioRef.current.currentTime = seekPosition;
  };

  // Fetch song data from the backend
  const getSongsData = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      setSongsData(response.data.songs);
      if (response.data.songs.length > 0) {
        setTrack(response.data.songs[0]);
      }
    } catch (error) {
      console.error("Error fetching songs data:", error);
    }
  };

  // Fetch album data from the backend
  const getAlbumData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      setAlbumsData(response.data.albums);
    } catch (error) {
      console.error("Error fetching albums data:", error);
    }
  };

  // Set up the time update for audio
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        seekBar.current.style.width = `${Math.floor(
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        )}%`;

        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [audioRef]);

  // Fetch data on component mount
  useEffect(() => {
    getSongsData();
    getAlbumData();
  }, []);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    songsData,
    albumsData
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
