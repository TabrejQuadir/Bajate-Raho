import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMusic } from 'react-icons/fa';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import axios from 'axios';
import LoginModal from '../components/LoginModal';
import PlaylistModal from '../components/PlaylistModal';
import UserContext from '../context/UserContext';
import { FaHeart } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa';

const AlbumPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { setCurrentSong, currentSong } = useAudioPlayer();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const { isLoggedIn } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const baseUrl = "http://localhost:5000"; // API base URL

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Get the auth token if available
        const token = localStorage.getItem('token');
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};

        // Try to fetch as playlist first
        try {
          const playlistResponse = await axios.get(`${baseUrl}/api/playlists/${albumId}`, config);
          const fetchedPlaylist = playlistResponse.data.playlist;
          setAlbum({
            ...fetchedPlaylist,
            totalDuration: fetchedPlaylist.songs?.reduce((total, song) => total + song.duration, 0) || 0
          });
          setSongs(fetchedPlaylist.songs || []);
          setLoading(false);
          return;
        } catch (playlistError) {
          // If it's not a 404, and we have a token, it might be an auth error
          if (playlistError.response?.status !== 404) {
            // Only throw if it's not an auth error or if we have a token
            if (playlistError.response?.status !== 401 || token) {
              throw playlistError;
            }
          }
        }

        console.log(currentSong);


        // If not found as playlist or unauthorized, try as album
        const albumResponse = await axios.get(`${baseUrl}/api/albums/${albumId}`, config);
        const fetchedAlbum = albumResponse.data;
        const songDetails = await Promise.all(
          fetchedAlbum.songs.map((songId) =>
            axios.get(`${baseUrl}/api/songs/${songId}`, config).then((res) => res.data)
          )
        );

        setAlbum({
          ...fetchedAlbum,
          totalDuration: songDetails.reduce((total, song) => total + song.duration, 0)
        });
        setSongs(songDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching content:", error);
        setLoading(false);
      }
    };

    fetchContent();
  }, [albumId]);

  const handleSongClick = (song) => {
    if (!isLoggedIn) {
      setSelectedSong(song);
      setIsModalOpen(true);
      return;
    }
    setCurrentSong(song.song);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddToPlaylist = (e, song) => {
    e.stopPropagation();
    setSelectedSong(song);
    if (!isLoggedIn) {
      setIsModalOpen(true);
      return;
    }
    setIsPlaylistModalOpen(true);
  };

  const handleClosePlaylistModal = () => setIsPlaylistModalOpen(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Album not found.
      </div>
    );
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-inherit">
      {/* Album Banner */}
      <div className="w-full relative h-auto md:h-[280px] px-4 md:px-8 border-b border-teal-700 flex flex-col md:flex-row items-start md:items-center gap-4 py-4 md:py-0 overflow-x-hidden">
        {/* Album Image or Color Block */}
        {album.image ? (
          <img
            src={`${album.image}`}
            alt={album.name}
            className="w-40 h-40 md:w-60 md:h-60 rounded object-cover"
          />
        ) : album.backgroundColor ? (
          <div className="relative">
            <div
              className="w-40 h-40 md:w-60 md:h-60 rounded object-cover"
              style={{ backgroundColor: album.backgroundColor }}
            ></div>
            <div className="absolute top-2 left-2 md:top-10 md:left-8 bg-opacity-80 p-2 md:p-6 h-[70%] w-[80%] md:w-[15%] rounded-lg text-white shadow-lg max-w-sm">
              <FaMusic className="absolute top-1 md:top-5 text-green-400" />
              <h1 className="absolute top-0 left-8 md:top-3 md:left-14 text-lg md:text-2xl font-bold mb-2 line-clamp-2">
                {album.name}
              </h1>
            </div>
          </div>
        ) : null}

        {/* Album Info */}
        <div className="w-full md:w-[80%] md:absolute md:top-10 md:left-72 space-y-1 md:space-y-4 z-0">
          <h2 className="text-sm md:text-lg text-gray-400">Album</h2>
          <h1 className="text-2xl md:text-4xl lg:text-6xl text-green-400 font-extrabold mb-1 md:mb-2 line-clamp-2">
            {album.name}
          </h1>
          <h2 className="text-sm md:text-lg font-semibold text-gray-400 line-clamp-2">
            {album.description}
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 md:mt-0">
            <div className="flex items-center">
              <span className="text-red-600 font-extrabold text-lg md:text-xl"><FaHeart /></span>
              <span className="text-white ml-1 md:ml-2 font-semibold text-xs md:text-base">
                299,731 saves
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-green-400 font-extrabold text-lg md:text-xl"><FaMusic /></span>
              <span className="text-white ml-1 md:ml-2 font-semibold text-xs md:text-base">
                {songs.length} songs ,
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-green-400 font-extrabold text-lg md:text-xl"><FaClock /></span>
              <span className="text-white ml-1 md:ml-2 font-semibold text-xs md:text-base">
                about {formatDuration(album.totalDuration)} min
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* Songs Section */}
      {/* Songs Section */}
      <div className="my-8 px-2">
        <i className="fas fa-play-circle text-3xl  mb-6 text-green-400"></i>

        {/* Scrollable Container with Fixed Header */}
        <div className="relative max-h-[400px] overflow-y-auto border border-black rounded-lg shadow-inner">

          {/* Table Header - Sticky */}
          <div className="grid grid-cols-3 gap-4 text-gray-300  text-xs md:text-base lg:text-lg bg-[#121212] sticky top-0  py-4 px-2">
            <div className="flex items-center">
              <i className="fas fa-music mr-2"></i>
              <span className="font-semibold">Title</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-user mr-2"></i>
              <span className="font-semibold">Artist</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-clock mr-2"></i>
              <span className="font-semibold">Duration</span>
            </div>
          </div>

          {/* Song Details */}
          <div className="space-y-6 px-2 py-4">
            {songs.map((song, index) => (
              <div
                key={index}
                onClick={() => handleSongClick(song)}
                className={`rounded-lg shadow p-4 cursor-pointer transition-all ${currentSong === song
                  ? 'bg-green-700 text-white'
                  : 'hover:bg-green-400 hover:text-white'
                  }`}
              >
                <div className="grid grid-cols-3 gap-4 text-xs md:text-base">
                  {/* Song Title */}
                  <div className="flex items-center">
                    <p className="mr-3">{index + 1}</p>
                    <img
                      className="h-10 rounded-lg mr-3"
                      src={`${song.song.image}`}
                      alt={song.name}
                    />
                    <span className="font-medium">{song.song.name}</span>
                  </div>

                  {/* Artist */}
                  <div className="flex items-center">
                    <span>{song.song.artist}</span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center">
                    <span className="ml-8">{song.song.duration}</span>
                    <button
                      onClick={(e) => handleAddToPlaylist(e, song)}
                      className="ml-4 p-2 hover:bg-[#3e3e3e] rounded-full"
                    >
                      <FiMoreHorizontal className="w-5 h-5 text-white hover:text-green-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add to Playlist Modal */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={handleClosePlaylistModal}
        song={selectedSong}
        isCreating={false}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        song={selectedSong}
        onRegister={() => navigate('/register')}
        onLogin={() => navigate('/login')}
      />
    </div>
  );
};

export default AlbumPage;
