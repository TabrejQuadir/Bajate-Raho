import {
  FaHome,
  FaList,
  FaHeart,
  FaPlus,
  FaMusic,
  FaSpinner,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useCallback } from 'react';
import UserContext from '../context/UserContext';
import { usePlaylist } from '../context/PlaylistContext';
import PlaylistModal from './PlaylistModal';

const Sidebar = () => {
  const { user } = useContext(UserContext);
  const { playlists, loading } = usePlaylist();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handlePlaylistCreated = () => setIsModalOpen(false);

  const goToProfile = useCallback((e) => {
    e.preventDefault();
    navigate('/profile');
  }, [navigate]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className={`md:hidden fixed top-4 ${sidebarOpen ? 'left-48' : 'left-4'} z-[999] text-white transition-all duration-300`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-64 bg-black rounded-r-3xl px-5 pt-6 flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:relative md:flex`}
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-2 text-xl font-bold text-white mb-8 group relative"
        >
          <FaMusic className="text-green-400 text-2xl group-hover:scale-110 transition-transform duration-300" />
          <span className="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
            Bajate Raho
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-4">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition"
          >
            <FaHome />
            <span>Home</span>
          </Link>

          <Link
            to="/liked"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition"
          >
            <FaHeart className="text-green-400" />
            <span>Liked Songs</span>
          </Link>

          <button
            onClick={() => {
              setIsModalOpen(true);
              setSidebarOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full opacity-0 group-hover:opacity-100 blur transition" />
              <FaPlus className="relative z-10 text-black bg-white rounded-full p-1" />
            </div>
            <span>Create Playlist</span>
          </button>
        </nav>

        {/* Playlists section */}
        <div className="mt-8 space-y-6">
          <h2 className="text-white font-semibold px-2.5 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-green-400/40 to-transparent"></div>
            <span>Your Playlists</span>
            <div className="h-px flex-1 bg-gradient-to-l from-green-400/40 to-transparent"></div>
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-4 text-gray-400">
              <FaSpinner className="animate-spin mr-2" />
              <span>Loading playlists...</span>
            </div>
          ) : user && playlists && playlists.length > 0 ? (
            <div className="space-y-2 overflow-hidden custom-scrollbar">
              {playlists.slice(0, 3).map((playlist) => (
                <Link
                  key={playlist._id}
                  to={`/album/${playlist._id}`}
                  className="flex items-center gap-6 p-2.5 rounded-2xl mt-2 transition-all duration-300 group relative text-gray-400 capitalize hover:text-white overflow-hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-500/0 to-green-500/0 group-hover:from-green-500/50 group-hover:to-transparent rounded-2xl transition-all duration-300"></div>
                  <div className="w-12 h-12 shrink-0 rounded-2xl overflow-hidden relative z-10">
                    {playlist.image ? (
                      <img
                        src={`${playlist.image}`}
                        alt={playlist.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="bg-white w-full h-full"></div>
                    )}
                  </div>
                  <span className="font-medium truncate relative z-10">{playlist.name}</span>
                </Link>
              ))}
              {playlists.length > 3 && (
                <div className="mt-4">
                  <button
                    onClick={(e) => {
                      goToProfile(e);
                      setSidebarOpen(false);
                    }}
                    className="w-full relative text-gray-400 text-sm px-10 py-3 flex items-center justify-center gap-2 rounded-full border border-green-400 hover:border-green-500 transition-all duration-300 group overflow-hidden"
                  >
                    <span className="relative z-10">Show more</span>
                    <FaList className="relative z-10 text-green-400" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400 text-sm px-2.5">
              {user ? "No playlists found" : "Login to see your playlists"}
            </div>
          )}
        </div>

        {/* Playlist Modal */}


        {/* Custom Scrollbar */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        `}</style>
      </aside>
      <PlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPlaylistCreated={handlePlaylistCreated}
        isCreating={true}
      />
    </>
  );
};

export default Sidebar;
